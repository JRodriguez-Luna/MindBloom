export type Mood = {
  moodName: string;
  emojiPath: string;
};

export type Progress = {
  totalPoints: number;
  level: number;
  progress: number;
  currentStreak: number;
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
