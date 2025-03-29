import plantIcon from '/images/icons/plant.svg';
import { Modal } from './Modal';
import './MobileLayout.css';
import { Link } from 'react-router-dom';
import { LayoutProps } from './Types';
import { Streaks } from './Streaks';
import { useEffect, useState } from 'react';
import { WeeklyMoodTracker } from '../components/WeeklyMoodTracker';
import { ToastContainer, toast } from 'react-toastify';

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
  error,
}: LayoutProps) {
  const [refreshData, setRefreshData] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await originalHandleSubmit(event);
    setRefreshData((prev) => prev + 1);
  };

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error! ${message}`);
    }
  }, [error]);

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
            <WeeklyMoodTracker userId={user?.id} refreshTrigger={refreshData} />
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

          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme=""
          />
        </form>
      </Modal>
    </>
  );
}
