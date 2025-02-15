-- Insert users (passwords are hashed for security)
INSERT INTO "users" ("firstName", "lastName", "email", "password", "createdAt", "updatedAt")
VALUES
  ('John', 'Doe', 'john.doe@example.com', 'hashedpassword123', '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
  ('Jane', 'Smith', 'jane.smith@example.com', 'hashedpassword456', '2025-01-02 10:00:00', '2025-01-02 10:00:00'),
  ('Alice', 'Johnson', 'alice.johnson@example.com', 'hashedpassword789', '2025-01-03 10:00:00', '2025-01-03 10:00:00');

-- Insert moods
INSERT INTO "mood" ("moodName", "emojiPath", "createdAt")
VALUES
  ('angry', '/images/emoji/angry.svg', '2025-01-01 10:00:00'),
  ('sad', '/images/emoji/sad.svg', '2025-01-01 10:00:00'),
  ('neutral', '/images/emoji/neutral.svg', '2025-01-01 10:00:00'),
  ('happy', '/images/emoji/happy.svg', '2025-01-01 10:00:00'),
  ('super', '/images/emoji/super.svg', '2025-01-01 10:00:00');

-- Insert challenges
INSERT INTO "challenges" ("title", "description", "frequency", "points", "createdAt")
VALUES
  ('Gratitude Journal', 'Write 3 things you are grateful for today.', 'daily', 15, '2025-01-01 10:00:00'),
  ('Deep Breathing Exercise', 'Take 3 deep breaths, inhale for 4 seconds, hold for 4, exhale for 4.', 'daily', 15, '2025-01-01 10:00:00'),
  ('Refresh Your Morning', '30 mins phone-free after waking up.', 'weekly', 15, '2025-01-01 10:00:00'),
  ('Take A Short Walk', 'Take a peaceful 15-30 minute walk to reset your day.', 'weekly', 15, '2025-01-01 10:00:00'),
  ('Mindful Reading', 'Spend 30 mins reading something you enjoy.', 'weekly', 20, '2025-01-01 10:00:00'),
  ('Monthly Clean-Up', 'Spend 1 hour cleaning and organizing your living space.', 'monthly', 15, '2025-01-01 10:00:00');

-- Insert user challenges
INSERT INTO "user_challenges" ("userId", "challengeId", "isCompleted", "completionDate", "createdAt")
VALUES
  (1, 1, false, NULL, '2025-01-01 10:00:00'),
  (1, 2, false, '2025-01-02', '2025-01-01 10:00:00'),
  (1, 3, false, NULL, '2025-01-01 10:00:00'),
  (2, 1, false, '2025-01-02', '2025-01-02 10:00:00'),
  (2, 4, false, NULL, '2025-01-02 10:00:00'),
  (3, 5, false, '2025-01-31', '2025-01-03 10:00:00');

-- Insert mood logs
INSERT INTO "mood_logs" ("userId", "moodId", "detail", "points", "logDate", "createdAt")
VALUES
  (1, 1, 'Had a good day at work and completed my challenges!', 15, '2025-01-01', '2025-01-01 10:00:00'),
  (1, 4, 'Feeling okay today, looking forward to tomorrow.', 10, '2025-01-02', '2025-01-02 10:00:00'),
  (2, 2, 'Stressed about work, but managed to do some journal.', 5, '2025-01-02', '2025-01-02 10:00:00'),
  (3, 5, 'Happy with my progress this month and reflecting on it!', 20, '2025-01-03', '2025-01-03 10:00:00');

-- Insert progress data
INSERT INTO "progress" ("userId", "totalPoints", "level", "currentStreak", "lastLogDate")
VALUES
  (1, 50, 2, 2, '2025-01-02'),
  (2, 40, 1, 1, '2025-01-02'),
  (3, 35, 1, 2, '2025-01-03');
