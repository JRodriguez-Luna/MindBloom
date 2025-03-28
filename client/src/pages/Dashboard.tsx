import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';
import { Mood, Progress, User } from './Types';
import { getAuthHeaders } from '../lib/auth';

type DashboardProps = {
  user: User | null;
};

export function Dashboard({ user }: DashboardProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [progress, setProgress] = useState<Progress>();
  const [selectEmoji, setSelectedEmoji] = useState<number>();
  const [counter, setCounter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  async function getProgress() {
    try {
      if (!user || !user.id) {
        setIsLoading(false);
        return;
      }

      const progressReq = await fetch(`/api/progress/${user.id}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (progressReq.status === 404) {
        await fetch(`/api/progress/${user.id}`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
          },
        });
        return getProgress();
      }

      if (!progressReq.ok) {
        throw new Error(`Failed to fetch progress. (${progressReq.status})`);
      }

      const data = await progressReq.json();
      setProgress(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getMoods() {
      try {
        const moodReq = await fetch('/api/moods', {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!moodReq.ok) {
          throw new Error(`Failed to fetch moods. (${moodReq.status})`);
        }

        const data = await moodReq.json();
        setMoods(data);
      } catch (err) {
        setError(err);
      }
    }

    getMoods();

    if (user && user.id) {
      getProgress();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSelectedEmoji = (index: number) => {
    setSelectedEmoji(index);
  };

  const handleCharacterCount = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCounter(event.currentTarget.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setError(undefined);
      event.preventDefault();

      if (selectEmoji === undefined) {
        throw new Error('Please select a mood.');
      }

      if (!user || !user.id) {
        throw new Error('You must be signed in to log moods');
      }

      const formData = new FormData(event.currentTarget);
      const mood = formData.get('mood');
      const detail = formData.get('detail');

      const newMoodReq = await fetch(`/api/mood-logs/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ mood, detail }),
      });

      if (!newMoodReq.ok) {
        throw new Error('Failed to add new mood.');
      }

      setCounter('');
      setSelectedEmoji(undefined);

      if (event.currentTarget) {
        event.currentTarget.reset();
      }

      closeModal();
      await getProgress();
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 768);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  return isDesktop ? (
    <DesktopLayout
      moods={moods}
      progress={progress}
      selectEmoji={selectEmoji}
      counter={counter}
      handleSelectedEmoji={handleSelectedEmoji}
      handleCharacterCount={handleCharacterCount}
      handleSubmit={handleSubmit}
      user={user}
      error={error}
    />
  ) : (
    <MobileLayout
      isOpen={isOpen}
      moods={moods}
      progress={progress}
      selectEmoji={selectEmoji}
      counter={counter}
      handleSelectedEmoji={handleSelectedEmoji}
      handleCharacterCount={handleCharacterCount}
      handleSubmit={handleSubmit}
      openModal={openModal}
      closeModal={closeModal}
      user={user}
      error={error}
    />
  );
}
