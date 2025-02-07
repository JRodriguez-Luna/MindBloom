import { useEffect, useState } from 'react';
import { ChallengeCard } from './ChallengeCard';

type Challenge = {
  title: string;
  description: string;
  frequency: string;
  points: number;
};

export function Challenges() {
  const [challenge, setChallenge] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function getChallenges() {
      try {
        const res = await fetch('/api/challenges');
        if (!res.ok) {
          throw new Error(`Failed to fetch challenges. (${res.status})`);
        }

        const data = await res.json();
        console.log('challenge json:', data);
        setChallenge(data);
        setIsLoading(false);
        console.log('challenge', challenge);
      } catch (err) {
        setError(err);
      }
    }

    getChallenges();
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !challenge) {
    console.error('fetch error:', error);
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <ChallengeCard
      challenges={challenge}
      handleCategoryToggle={handleCategoryToggle}
      selectedCategory={selectedCategory}
    />
  );
}
