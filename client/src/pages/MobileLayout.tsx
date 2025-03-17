import plantIcon from '/images/icons/plant.svg';
import { Modal } from './Modal';
import './MobileLayout.css';
import { Link } from 'react-router-dom';
import { LayoutProps } from './Types';
import { Streaks } from './Streaks';
import { useEffect, useState, useCallback } from 'react';
import { getAuthHeaders } from '../lib/auth';

type WeeklyTracker = {
  emojiPath: string;
  logDate: string;
};

export function MobileLayout({
  isOpen,
  moods,
  progress,
  selectEmoji,
  counter,
  handleSelectedEmoji,
  handleCharacterCount,
  handleSubmit: originalHandleSubmit,
  openModal = () => {},
  closeModal = () => {},
  user,
}: LayoutProps) {
  const [historyTracker, setHistoryTracker] = useState<WeeklyTracker[]>([]);
  const [refreshData, setRefreshData] = useState(0);

  const fetchMoodHistory = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error('Failed to get user.id');
        return;
      }

      const res = await fetch(`/api/mood-tracking/${user.id}/weekly`, {
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
  }, [user?.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await originalHandleSubmit(event);
    setRefreshData((prev) => prev + 1);
  };

  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory, refreshData]);

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
    <>
      <div className="dashboard-container">
        <div className="dashboard-col gap-6">
          <div className="dashboard-row">
            <h1 className="text-3xl">Hi, {user?.firstName || 'Friend'}</h1>
          </div>

          <div className="dashboard-row space-between">
            <p className="text-xl">Your stats</p>
            <Link
              to="/app/calendar"
              state={{
                completedChallenges: progress?.completedChallenges,
                currentStreak: progress?.currentStreak,
              }}>
              View All
            </Link>
          </div>

          <Streaks
            completedChallenges={progress?.completedChallenges}
            currentStreak={progress?.currentStreak}
          />

          <div className="dashboard-row w-full h-15 items-center">
            {pastWeek.map((day) => {
              const dayMood = historyTracker.find(
                (mood) =>
                  new Date(mood.logDate).toISOString().split('T')[0] ===
                  day.date
              );

              return (
                <div key={day.date} className="flex flex-col items-center">
                  <img
                    className="emoji-icon"
                    src={
                      dayMood
                        ? dayMood.emojiPath
                        : '/images/emoji/gray-neutral.svg'
                    }
                    alt="mood"
                  />
                  <p>{day.abbr}</p>
                </div>
              );
            })}
          </div>

          <div className="dashboard-row center">
            <div className="dashboard-col center progress">
              <img className="plant" src={plantIcon} alt="plant" />
              <p>Your plant is level: {progress?.level ?? 1}</p>
              <div className="progress-bar">
                <div
                  className="fill-bar"
                  style={{ width: `${progress?.progress ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-row center">
            <button
              onClick={openModal}
              className="custom-button button-text cursor-pointer text-red-600">
              Log Your Mood
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <form className="mood-entry-form dashboard-col" onSubmit={handleSubmit}>
          <p>How are you feeling today?</p>
          <div className="emojis dashboard-row">
            {moods.map((mood, index) => {
              const id = `mood-${mood.moodName}`;
              return (
                <label key={mood.moodName} htmlFor={id}>
                  <input
                    onClick={() => handleSelectedEmoji(index)}
                    type="radio"
                    name="mood"
                    id={id}
                    value={mood.moodName}
                  />
                  <img
                    className={`emoji cursor-pointer ${
                      selectEmoji === index ? 'selected' : ''
                    }`}
                    src={mood.emojiPath}
                    alt={mood.moodName}
                  />
                </label>
              );
            })}
          </div>
          <p>What contributed to this feeling?</p>
          <textarea
            name="detail"
            className="journal-entry"
            maxLength={150}
            value={counter}
            onChange={handleCharacterCount}
          />
          <p>{counter.length}/150</p>
          <button
            type="submit"
            id="modal-button"
            className="custom-button cursor-pointer">
            Log Mood
          </button>
        </form>
      </Modal>
    </>
  );
}
