/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg, { Client } from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

type Mood = {
  moodName: string;
  emojiPath: string;
};

type ChallengeCompletion = {
  userId: number;
  challengeId: number;
  isCompleted: boolean;
  completionDate: Date | null;
};

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Auth
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw new ClientError(400, 'Missing required fields.');
    }

    const hashPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("firstName", "lastName", "email", "password")
      values($1, $2, $3, $4)
      returning *;
    `;

    const param = [firstName, lastName, email, hashPassword];
    const [user] = (await db.query(sql, param)).rows;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ClientError(400, 'Invalid login');
    }

    const sql = `
      select "id", "email", "password"
      from "users"
      where "email" = $1;
    `;

    const [user] = (await db.query(sql, [email])).rows;
    if (!user) {
      throw new ClientError(401, 'Invalid email or password');
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new ClientError(401, 'Invalid email or password');
    }

    const payload = {
      userId: user.userId,
      email: user.email,
    };

    const token = jwt.sign(payload, hashKey);

    res.status(200).json({
      user: payload,
      token,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/progress/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (isNaN(+userId) || !Number.isInteger(+userId) || +userId < 1) {
      throw new ClientError(404, `User with Id ${userId} does not exist.`);
    }

    const sql = `
      select
        "p"."totalPoints", "p"."level", "p"."currentStreak",
        COUNT(*) FILTER (where "uc"."isCompleted" = true)::int as "completedChallenges"
      from progress as "p"
      join
        "user_challenges" as "uc" using("userId")
      where
        "userId" = $1
      group by
        "p"."totalPoints", "p"."level", "p"."currentStreak";
    `;

    const params = [userId];
    const result = await db.query(sql, params);

    const [userProgress] = result.rows;
    if (!userProgress) {
      throw new ClientError(
        404,
        `Failed to retrieve level, totalPoints, and currentStreak for user with ID ${userId}.`
      );
    }

    // Calculate progress percentage
    const progress = ((userProgress.totalPoints % 10) / 10) * 100;

    res.status(200).json({ ...userProgress, progress });
  } catch (err) {
    next(err);
  }
});

app.get('/api/moods', async (req, res, next) => {
  try {
    const sql = `
      select "moodName", "emojiPath"
      from mood;
    `;

    const moods: Mood[] = (await db.query(sql)).rows;
    if (moods.length === 0) {
      throw new ClientError(404, 'No moods found.');
    }

    res.status(200).json(moods);
  } catch (err) {
    next(err);
  }
});

app.get('/api/mood-tracking/:userId', async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.params.userId;

    if (
      Number.isNaN(userId) ||
      !Number.isInteger(+userId) ||
      Number(userId) < 1
    ) {
      throw new ClientError(400, 'Invalid userId.');
    }

    if (!date) {
      throw new ClientError(400, 'Missing logDate');
    }

    //  Get the users most recent log script
    const sqlRecentMood = `
      select
        "logDate", "moodId"
      from mood_logs
      where "userId" = $1 and "logDate" = $2
      order by "createdAt" desc
      limit 1;
    `;

    const [recentMood] = (await db.query(sqlRecentMood, [userId, date])).rows;
    if (!recentMood) {
      return res.status(200).json({
        logDate: date,
        emojiPath: null,
      });
    }

    const sqlMood = `
      select "emojiPath"
      from mood
      where "id" = $1;
    `;

    const [moodPath] = (await db.query(sqlMood, [recentMood.moodId])).rows;
    if (!moodPath) {
      throw new ClientError(404, `Id ${recentMood.moodId} does not exist.`);
    }

    res.status(200).json({
      logDate: recentMood.logDate,
      emojiPath: moodPath.emojiPath,
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/mood-logs/:userId', async (req, res, next) => {
  try {
    const { mood, detail } = req.body;
    const userId = req.params.userId;
    const points = 1;

    if (
      Number.isNaN(userId) ||
      !Number.isInteger(+userId) ||
      Number(userId) < 1
    ) {
      throw new ClientError(400, 'Invalid userId.');
    }

    // get the moodId from mood where mood = the selected mood from user
    const sqlMoodId = `
      select id
      from mood
      where "moodName" = $1;
    `;

    const [moodId] = (await db.query(sqlMoodId, [mood])).rows;
    if (!moodId) {
      throw new ClientError(400, 'Mood selected does not exists.');
    }

    // add the newLog with the appropriate id
    const sqlNewLog = `
      insert into mood_logs ("userId", "moodId", "detail", "logDate")
      values ($1, $2, $3, CURRENT_DATE)
      returning *;
    `;

    const [newLog] = (await db.query(sqlNewLog, [userId, moodId.id, detail]))
      .rows;
    if (!newLog) {
      throw new ClientError(404, `User with Id ${userId} does not exist.`);
    }

    // update users total points.
    const sqlUpdateTotalPoints = `
      update progress
      set "totalPoints" = "totalPoints" + $1
      where "userId" = $2
      returning *;
    `;

    const [updatedProgress] = (
      await db.query(sqlUpdateTotalPoints, [points, userId])
    ).rows;

    // Increment every 10 points
    const newLevel = Math.floor(updatedProgress.totalPoints / 10) + 1;

    // only trigger if level is greater than the current level
    if (newLevel > updatedProgress.level) {
      const sqlUpdateLevel = `
        update progress
        set "level" = $1
        where "userId" = $2
        returning "level";
      `;

      const [updateLevel] = (await db.query(sqlUpdateLevel, [newLevel, userId]))
        .rows;
      if (!updateLevel) {
        throw new ClientError(
          404,
          `Failed to update level for user with ID ${userId}.`
        );
      }
    }

    // Streak Tracking
    const streakSql = `
      update "progress"
      set
        "currentStreak" = case
          when "lastLogDate" is null then 1
          when $2::date = "lastLogDate" + interval '1 day' then "currentStreak" + 1
          when $2::date > "lastLogDate" + interval '1 day' then 1
          else "currentStreak"
        end,
        "lastLogDate" = greatest("lastLogDate", $2::date)
      where "userId" = $1
      returning "currentStreak";
    `;

    const [streak] = (await db.query(streakSql, [userId, newLog.logDate])).rows;
    if (!streak) {
      throw new ClientError(
        404,
        `Failed to update streak for user with ID ${userId}`
      );
    }

    res.status(201).json({
      newLog,
      updatedTotalPoints: updatedProgress.totalPoints,
      updatedLevel: newLevel,
      streak,
    });
  } catch (err) {
    next(err);
  }
});

//  Get stored challenges
app.get('/api/challenges', async (req, res, next) => {
  try {
    const sql = `
      select *
      from challenges;
    `;

    const challenges = (await db.query(sql)).rows;
    if (!challenges) {
      throw new ClientError(404, `No challenges found.`);
    }

    res.status(200).json(challenges);
  } catch (err) {
    next(err);
  }
});

// Get users challenge status
app.get('/api/user-challenges/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (isNaN(+userId) || !Number.isInteger(+userId) || +userId < 1) {
      throw new ClientError(400, 'Invalid userId.');
    }

    const sql = `
      select "challengeId", "isCompleted"
      from user_challenges
      where "userId" = $1
      order by "challengeId" asc;
    `;

    const userChallenges = (await db.query(sql, [userId])).rows;
    if (!userChallenges) {
      throw new ClientError(404, `User with id ${userId} does not exists.`);
    }

    res.status(200).json(userChallenges);
  } catch (err) {
    next(err);
  }
});

//  Update challenges if completed or not
app.post('/api/user-challenges/completion/:userId', async (req, res, next) => {
  try {
    const { challengeId, isComplete, points } = req.body;
    const userId = req.params.userId;

    if (typeof isComplete !== 'boolean') {
      throw new ClientError(400, `Invalid. 'isComplete' must be a boolean.`);
    }

    if (
      Number.isNaN(challengeId) ||
      !Number.isInteger(+challengeId) ||
      Number(challengeId) < 1
    ) {
      throw new ClientError(400, 'Invalid challengeId.');
    }

    if (
      Number.isNaN(userId) ||
      !Number.isInteger(+userId) ||
      Number(userId) < 1
    ) {
      throw new ClientError(400, 'Invalid userId.');
    }

    if (
      Number.isNaN(points) ||
      !Number.isInteger(+points) ||
      Number(points) < 1
    ) {
      throw new ClientError(400, 'Invalid points.');
    }

    const sql = `
      update user_challenges
      set
        "isCompleted" = $1,
        "completionDate" = CURRENT_DATE
      where
        "userId" = $2 and "challengeId" = $3
      returning *;
    `;

    const [challengeCompleted]: ChallengeCompletion[] = (
      await db.query(sql, [isComplete, userId, challengeId])
    ).rows;
    if (!challengeCompleted) {
      throw new ClientError(404, `User with ID ${userId} does not exists.`);
    }

    // update users total points.
    const sqlUpdateTotalPoints = `
      update progress
      set "totalPoints" = "totalPoints" + $1
      where "userId" = $2
      returning *;
    `;

    const [updatedProgress] = (
      await db.query(sqlUpdateTotalPoints, [points, userId])
    ).rows;

    // Increment every 10 points
    const newLevel = Math.floor(updatedProgress.totalPoints / 10) + 1;

    // only trigger if level is greater than the current level
    if (newLevel > updatedProgress.level) {
      const sqlUpdateLevel = `
        update progress
        set "level" = $1
        where "userId" = $2
        returning "level";
      `;

      const [updateLevel] = (await db.query(sqlUpdateLevel, [newLevel, userId]))
        .rows;
      if (!updateLevel) {
        throw new ClientError(
          404,
          `Failed to update level for user with ID ${userId}.`
        );
      }
    }

    res.status(200).json({
      challengeCompleted,
      updatedProgress,
      updatedLevel: newLevel,
    });
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
