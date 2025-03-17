import plantIcon from '/images/icons/plant.svg';
import './DesktopLayout.css';
import { LayoutProps } from './Types';
import Calendar from 'react-calendar';
import './Calendar.css';
import { useEffect, useState, useCallback } from 'react';
import { getAuthHeaders } from '../lib/auth';

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];
type MoodData = {
  logDate: string;
  emojiPath: string | null;
};

type WeeklyTracker = {
  emojiPath: string;
  logDate: string;
};

export function DesktopLayout({
  moods,
  progress,
  selectEmoji,
  counter,
  handleSelectedEmoji,
  handleCharacterCount,
  handleSubmit: originalHandleSubmit,
  user,
}: LayoutProps) {
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const handleOnChange = (value: CalendarValue) => {
    if (!(value instanceof Date)) return;
    setSelectedDate(value);
  };

  useEffect(() => {
    async function getMoodData() {
      try {
        if (!user || !user.id) {
          return;
        }

        const formattedDate = `${selectedDate.getFullYear()}-${
          selectedDate.getMonth() + 1
        }-${selectedDate.getDate()}`;

        const res = await fetch(
          `/api/mood-tracking/${user.id}?date=${formattedDate}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch mood data');
        }

        const data = await res.json();
        setMoodData(data);
      } catch (err) {
        setMoodData(null);
      }
    }

    getMoodData();
  }, [selectedDate, user]);

  return (
    <>
      <div className="desktop-container">
        <div className="desktop-col-half left-content gap-4">
          <div className="desktop-row">
            <h1 className="text-3xl">
              Hi, {user?.firstName ? user.firstName : 'Friend'}
            </h1>
          </div>

          <div className="desktop-row">
            <p className="text-2xl">Stats</p>
          </div>

          <div className="desktop-row justify-between">
            <div className="bg-black w-full h-20 rounded-2xl padding">
              <div className="flex h-full justify-center items-center">
                <span>💫 {progress?.completedChallenges ?? 0} Challenges</span>
              </div>
            </div>

            <div className="bg-black w-full h-20 rounded-2xl padding">
              <div className="flex h-full justify-center items-center">
                <span>🔥 {progress?.currentStreak ?? 0} Streaks</span>
              </div>
            </div>
          </div>

          <div className="desktop-row space-between day-tracker">
            <div className="desktop-row w-full justify-between items-center">
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
          </div>

          <div className="desktop-row">
            <Calendar
              onChange={handleOnChange}
              value={selectedDate}
              selectRange={false}
            />
          </div>

          <div className="desktop-row justify-between">
            <div className="desktop-row bg-black w-full h-30 rounded-2xl padding items-center">
              <div className="flex flex-col h-full justify-center items-center text-2xl">
                <span>Mood Tracking</span>
                <span className="text-gray-600">Your mood was:</span>
              </div>

              <div className="flex flex-col h-20 justify-center items-center">
                {moodData?.emojiPath ? (
                  <img src={moodData.emojiPath} alt="Logged mood" />
                ) : (
                  <span className="text-gray-500">No mood logged</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="desktop-col-half right-content gap-5">
          <div className="desktop-row">
            <h1 className="text-xl">Log Mood</h1>
          </div>

          <div className="desktop-row justify-center">
            <div className="journal-card">
              <form
                className="mood-entry-form desktop-col"
                onSubmit={handleSubmit}>
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
            </div>
          </div>

          <div className="line"></div>

          <div className="desktop-row">
            <h1 className="text-xl">Plant Progress</h1>
          </div>

          <div className="desktop-row justify-center">
            <div className="desktop-col justify-center items-center progress">
              <img className="plant" src={plantIcon} alt="plant" />
              <p>Your plant is level: {progress?.level ?? 1}</p>
              <div className="h-4 w-2xs relative bg-white rounded-2xl">
                <div
                  className="bg-fill-bar h-4 w-2xs absolute rounded-2xl"
                  style={{ width: `${progress?.progress ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
