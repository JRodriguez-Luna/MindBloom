-- Insert users (passwords are hashed for security)
INSERT INTO "users" ("firstName", "lastName", "email", "password", "createdAt", "updatedAt")
VALUES
  ('Demo', 'User', 'demo@mindbloom.com', 'MindBloomDemo', '2025-03-28', '2025-03-28 00:00:00');

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
  (1, 1, false, NULL, '2025-03-26 10:00:00'),
  (1, 2, false, NULL, '2025-03-26 10:00:00'),
  (1, 3, false, NULL, '2025-03-26 10:00:00'),
  (1, 4, false, NULL, '2025-03-26 10:00:00'),
  (1, 5, false, NULL, '2025-03-26 10:00:00'),
  (1, 6, false, NULL, '2025-03-26 10:00:00');

-- Insert mood logs
INSERT INTO "mood_logs" ("userId", "moodId", "detail", "points", "logDate", "createdAt")
VALUES
  (1, 4, 'Started using MindBloom today! Feeling positive about this journey.', 20, '2025-03-26', '2025-03-26 14:30:00'),
  (1, 5, 'Completed two challenges and feeling accomplished!', 25, '2025-03-27', '2025-03-27 18:45:00'),
  (1, 4, 'Had a productive day and practiced mindfulness for 10 minutes.', 15, '2025-03-28', '2025-03-28 20:15:00');

-- Insert progress data
INSERT INTO "progress" ("userId", "totalPoints", "level", "currentStreak", "lastLogDate")
VALUES
  (1, 150, 2, 3, '2025-03-28');
