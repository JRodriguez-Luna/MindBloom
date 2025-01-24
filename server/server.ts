/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg, { Client } from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/mood-logs/:userId', async (req, res, next) => {
  try {
    const { mood, detail } = req.body;
    const userId = req.params.userId;
    const points = 1;
    const validMoods = ['happy', 'sad', 'angry', 'neutral', 'super'];

    if (!validMoods.includes(mood)) {
      throw new ClientError(400, 'One mood must be selected.');
    }

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

    // ** Update the users current level **

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

    res.status(201).json({
      newLog,
      updatedTotalPoints: updatedProgress.totalPoints,
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
