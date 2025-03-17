import { useEffect, useState } from 'react';
import '../pages/MobileLayout.css';
import { getAuthHeaders } from '../lib/auth';

type WeeklyTrackerData = {
  emojiPath: string;
  logDate: string;
};

type WeeklyMoodTrackerProps = {
  userId?: string | number;
  refreshTrigger?: number;
};

export function WeeklyMoodTracker({
  userId,
  refreshTrigger = 0,
}: WeeklyMoodTrackerProps) {
  const [historyTracker, setHistoryTracker] = useState<WeeklyTrackerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMoodHistory() {
      setIsLoading(true);
      setError(null);

      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`/api/mood-tracking/${userId}/weekly`, {
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed with status: ${res.status}`);
        }

        const data = await res.json();
        setHistoryTracker(data);
      } catch (err) {
        console.error(
          `Error fetching weekly mood data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setError('Unable to load mood history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMoodHistory();
  }, [userId, refreshTrigger]);

  const generatePastWeek = (): { date: string; abbr: string }[] => {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);

      result.push({
        date: day.toISOString().split('T')[0],
        abbr: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.getDay()],
      });
    }

    return result;
  };

  const pastWeek = generatePastWeek();

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center py-2">
        <div className="text-sm text-gray-400">Loading mood data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full justify-center items-center py-2">
        <div className="text-sm text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-between items-center">
      {pastWeek.map((day) => {
        const dayMood = historyTracker.find(
          (mood) =>
            new Date(mood.logDate).toISOString().split('T')[0] === day.date
        );

        return (
          <div key={day.date} className="flex flex-col items-center">
            <img
              className="emoji-icon"
              src={
                dayMood ? dayMood.emojiPath : '/images/emoji/gray-neutral.svg'
              }
              alt="mood"
            />
            <p>{day.abbr}</p>
          </div>
        );
      })}
    </div>
  );
}
