import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';
import { Mood, Progress } from './Types';

export function Dashboard() {
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
      const progressReq = await fetch('/api/progress/1');
      if (!progressReq.ok) {
        throw new Error(`Failed to fetch progress. (${progressReq.status})`);
      }

      const data = await progressReq.json();
      setIsLoading(false);
      setProgress(data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    async function getMoods() {
      try {
        const moodReq = await fetch('/api/moods');
        if (!moodReq.ok) {
          throw new Error(`Failed to fetch moods. (${moodReq.status})`);
        }

        const data = await moodReq.json();
        setIsLoading(false);
        setMoods(data);
      } catch (err) {
        setError(err);
      }
    }

    getMoods();
    getProgress();
  }, []);

  const handleSelectedEmoji = (index: number) => {
    setSelectedEmoji(index);
  };

  const handleCharacterCount = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCounter(event.currentTarget.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      if (selectEmoji === null) {
        throw new Error('Please select a mood.');
      }

      const formData = new FormData(event.currentTarget);
      const mood = formData.get('mood');
      const detail = formData.get('detail');

      const newMoodReq = await fetch('/api/mood-logs/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, detail }),
      });

      if (!newMoodReq.ok) {
        throw new Error('Failed to add new mood.');
      }

      // Clear inputs
      setCounter('');
      setSelectedEmoji(undefined);

      // Check to see if currentTarget is not null, else it will Error.
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
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('fetch error:', error);
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
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
    />
  );
}
