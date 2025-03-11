import { useEffect, useState } from 'react';
import { ChallengeCard } from './ChallengeCard';
import { User } from './Types';
import { getAuthHeaders } from '../lib/auth';

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

type ChallengesProps = {
  user: User | null;
};

export function Challenges({ user }: ChallengesProps) {
  const [challenge, setChallenge] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(
    null
  );
  const [points, setPoints] = useState<number | null>(null);
  const [userChallenge, setUserChallenge] = useState<UserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  async function getUserChallenges() {
    try {
      if (!user || !user.id) {
        setUserChallenge([]);
        return;
      }

      const userRes = await fetch(`/api/user-challenges/${user.id}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!userRes.ok) {
        throw new Error(`Failed to fetch user_challenges. (${userRes.status})`);
      }

      const userData = await userRes.json();
      setUserChallenge(userData);
    } catch (err) {
      setError(err);
      setUserChallenge([]);
    }
  }

  useEffect(() => {
    async function getChallenges() {
      try {
        const res = await fetch('/api/challenges', {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch challenges. (${res.status})`);
        }

        const data = await res.json();
        setChallenge(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }

    getChallenges();
    getUserChallenges();
  }, [user]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
  };

  const handleChallengeToggle = (challenge: number) => {
    setSelectedChallenge(challenge);
  };

  const handlePoints = (points: number) => {
    setPoints(points);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !challenge) {
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
      handlePoints={handlePoints}
      selectedCategory={selectedCategory}
      selectedChallenge={selectedChallenge}
      points={points}
      refreshUserChallenges={getUserChallenges}
      user={user}
    />
  );
}
