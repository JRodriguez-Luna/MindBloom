import { useEffect, useState } from 'react';
import { ChallengeCard } from './ChallengeCard';

export type Challenge = {
  id: number;
  title: string;
  description: string;
  frequency: string;
  points: number;
};

export type UserChallenge = {
  challengeId: number;
  isCompleted: boolean;
  completionDate: Date | null;
};

export function Challenges() {
  const [challenge, setChallenge] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(
    null
  );
  const [userChallenge, setUserChallenge] = useState<UserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function getChallenges() {
      try {
        const res = await fetch('/api/challenges');
        if (!res.ok) {
          throw new Error(`Failed to fetch challenges. (${res.status})`);
        }

        // challenges data
        const data = await res.json();
        console.log('challenge json:', data);

        setChallenge(data);
        setIsLoading(false);
        console.log('challenge', challenge);
      } catch (err) {
        setError(err);
      }
    }

    async function getUserChallenges() {
      try {
        // user response
        const userRes = await fetch('/api/user-challenges/1');
        if (!userRes.ok) {
          throw new Error(
            `Failed to fetch user_challenges. (${userRes.status})`
          );
        }

        // user challenge data
        const userData = await userRes.json();
        console.log('user_challenge json:', userData);

        setUserChallenge(userData);
        console.log('userCompletion', userChallenge);
      } catch (err) {
        setError(err);
      }
    }

    getChallenges();
    getUserChallenges();
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
  };

  const handleChallengeToggle = (challenge: number) => {
    setSelectedChallenge(challenge);
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
      userChallenges={userChallenge}
      handleCategoryToggle={handleCategoryToggle}
      handleChallengeToggle={handleChallengeToggle}
      selectedCategory={selectedCategory}
      selectedChallenge={selectedChallenge}
    />
  );
}
