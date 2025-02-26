import { useNavigate } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { Streaks } from './Streaks';
import { MoodData, StreaksProps } from './Types';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export function CalendarView({
  completedChallenges,
  currentStreak,
}: StreaksProps) {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        navigate('/');
      }
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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

        const res = await fetch(`/api/mood-tracking/1?date=${formattedDate}`);
        if (!res.ok) throw new Error('Failed to fetch mood data');

        const data = await res.json();
        setMoodData(data);
      } catch (err) {
        console.error('Error fetching mood data:', err);
        setMoodData(null);
      }
    }

    getMoodData();
  }, [selectedDate]);

  return (
    <>
      <div className="challenge-container h-auto">
        <div className="dashboard-col gap-6">
          {/* Navigate back */}
          <button className="text-3xl" onClick={() => navigate('/')}>
            <TiChevronLeft />
          </button>

          {/* Title */}
          <div className="dashboard-row">
            <h1 className="text-3xl">Your Stats</h1>
          </div>

          {/* Challenges and Streaks */}
          <Streaks
            completedChallenges={completedChallenges}
            currentStreak={currentStreak}
          />

          {/* Calendar */}
          <div className="dashboard-row">
            <Calendar
              onChange={handleOnChange}
              value={selectedDate}
              calendarType="iso8601"
              maxDetail="month"
            />
          </div>

          {/* Mood Tracking */}
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
