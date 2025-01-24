set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "firstName" text,
  "lastName" text,
  "email" text UNIQUE,
  "password" text,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()',
  "updatedAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "mood_logs" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "moodId" integer,
  "detail" varchar(150),
  "points" integer DEFAULT 1,
  "logDate" date,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "mood" (
  "id" serial PRIMARY KEY,
  "moodName" varchar(20),
  "emojiPath" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "challenges" (
  "id" serial PRIMARY KEY,
  "title" text,
  "description" text,
  "frequency" varchar(20),
  "points" integer,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "user_challenges" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "challengeId" integer,
  "isCompleted" boolean DEFAULT false,
  "completionDate" date,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "progress" (
  "id" serial PRIMARY KEY,
  "userId" integer,
  "totalPoints" integer DEFAULT 0,
  "level" integer DEFAULT 1,
  "currentStreak" integer DEFAULT 0,
  "lastLogDate" date
);

COMMENT ON COLUMN "mood"."moodName" IS 'Values: happy, sad, angry, neutral, excited';

COMMENT ON COLUMN "challenges"."frequency" IS 'Values: daily, weekly, monthly';

ALTER TABLE "mood_logs" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "mood_logs" ADD FOREIGN KEY ("moodId") REFERENCES "mood" ("id");

ALTER TABLE "user_challenges" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "user_challenges" ADD FOREIGN KEY ("challengeId") REFERENCES "challenges" ("id");

ALTER TABLE "progress" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
