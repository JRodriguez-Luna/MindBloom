import { useCallback, useEffect, useState } from 'react';
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

  const fetchMoodHistory = useCallback(async () => {
    try {
      if (!userId) {
        console.error('Failed to get user.id');
        return;
      }

      const res = await fetch(`/api/mood-tracking/${userId}/weekly`, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!res.ok) throw new Error(`Response Status: ${res.status}`);

      const data = await res.json();
      setHistoryTracker(data);
    } catch (err) {
      console.error(`Error fetching weekly mood data: ${err}`);
    }
  }, [userId]);

  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory, refreshTrigger]);

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
