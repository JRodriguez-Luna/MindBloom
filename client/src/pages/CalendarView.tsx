import { useNavigate, useLocation } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { Streaks } from './Streaks';
import { MoodData } from './Types';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import { User } from './Types';
import { getAuthHeaders } from '../lib/auth';

type CalendarViewProps = {
  user: User | null;
};

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export function CalendarView({ user }: CalendarViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { completedChallenges = 0, currentStreak = 0 } = location.state || {};
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    function handleRedirect() {
      if (window.innerWidth >= 768) {
        navigate('/');
      }
    }

    window.addEventListener('resize', handleRedirect);

    return () => window.removeEventListener('resize', handleRedirect);
  }, [navigate]);

  const handleOnChange = (value: CalendarValue) => {
    if (!(value instanceof Date)) return;
    setSelectedDate(value);
  };

  useEffect(() => {
    async function getMoodData() {
      try {
        const formattedDate = `${selectedDate.getFullYear()}-${
          selectedDate.getMonth() + 1
        }-${selectedDate.getDate()}`;

        if (!user?.id) return;
        const res = await fetch(
          `/api/mood-tracking/${user.id}?date=${formattedDate}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch mood data');

        const data = await res.json();
        setMoodData(data);
      } catch (err) {
        setMoodData(null);
      }
    }

    getMoodData();
  }, [selectedDate, user?.id]);

  return (
    <>
      <div className="challenge-container h-auto" id="calender-view">
        <div className="dashboard-col gap-6">
          <button className="text-3xl" onClick={() => navigate('/app')}>
            <TiChevronLeft />
          </button>

          <div className="dashboard-row">
            <h1 className="text-3xl">Your Stats</h1>
          </div>

          <Streaks
            completedChallenges={completedChallenges}
            currentStreak={currentStreak}
          />

          <div className="dashboard-row">
            <Calendar onChange={handleOnChange} value={selectedDate} />
          </div>

          <div className="dashboard-row justify-between">
            <div className="dashboard-row bg-black w-full h-30 rounded-2xl padding items-center">
              <div className="flex flex-col h-full justify-center items-center text-base">
                <span>Mood Tracking</span>
                <span className="text-gray-600">Your mood was:</span>
              </div>

              <div className="flex flex-col h-15 justify-center">
                {moodData?.emojiPath ? (
                  <img src={moodData.emojiPath} alt="Logged mood" />
                ) : (
                  <span className="text-gray-500">No mood logged</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
