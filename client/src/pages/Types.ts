export type Mood = {
  moodName: string;
  emojiPath: string;
};

export type User = {
  id: number;
  email: string;
  password: string;
};

export type StreaksProps = {
  completedChallenges?: number;
  currentStreak?: number;
};

export type MoodData = {
  logDate: string;
  emojiPath: string | null;
};

export type Progress = {
  totalPoints?: number;
  level?: number;
  progress?: number;
  currentStreak: number;
  completedChallenges: number;
};

export type LayoutProps = {
  moods: Mood[];
  progress?: Progress;
  selectEmoji?: number;
  counter: string;
  isOpen?: boolean;
  handleSelectedEmoji: (index: number) => void;
  handleCharacterCount: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  openModal?: () => void;
  closeModal?: () => void;
};
