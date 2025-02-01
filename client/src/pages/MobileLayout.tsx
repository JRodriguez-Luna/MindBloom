import plantIcon from '/images/icons/plant.svg';
import { Modal } from './Modal';
import './MobileLayout.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

type Mood = {
  moodName: string;
  emojiPath: string;
};

type Progress = {
  totalPoints: number;
  level: number;
  progress: number;
};

export function MobileLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [progress, setProgress] = useState<Progress>();
  const [selectEmoji, setSelectedEmoji] = useState<number>();
  const [counter, setCounter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    async function getMoods() {
      try {
        const moodReq = await fetch('/api/moods');
        if (!moodReq.ok) {
          throw new Error(`Failed to fetch moods. (${moodReq.status})`);
        }

        const data = await moodReq.json();
        setIsLoading(false);
        setMoods(data);
      } catch (err) {
        setError(err);
      }
    }

    async function getProgress() {
      try {
        const progressReq = await fetch('/api/progress/1');
        if (!progressReq.ok) {
          throw new Error(`Failed to fetch progress. (${progressReq.status})`);
        }

        const data = await progressReq.json();
        setIsLoading(false);
        setProgress(data);
      } catch (err) {
        setError(err);
      }
    }

    getMoods();
    getProgress();
  }, []);

  const handleSelectedEmoji = (index: number) => {
    setSelectedEmoji(index);
  };

  const handleCharacterCount = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCounter(event.currentTarget.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      if (selectEmoji === null) {
        throw new Error('Please select a mood.');
      }

      const formData = new FormData(event.currentTarget);
      const mood = formData.get('mood');
      const detail = formData.get('detail');

      const newMoodReq = await fetch('/api/mood-logs/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, detail }),
      });

      if (!newMoodReq.ok) {
        throw new Error('Failed to add new mood.');
      }

      closeModal();
    } catch (err) {
      setError(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('fetch error:', error);
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-col gap-6">
          {/* User's Name */}
          <div className="dashboard-row">
            <h1 className="text-3xl">Hi, Jesus</h1>
          </div>

          {/* Stats */}
          <div className="dashboard-row space-between">
            <p>Your stats</p>
            <p>View all</p>
          </div>

          {/* Challenges and Streaks */}
          <div className="dashboard-row space-between">
            <div className="box dashboard-col center">
              <span>💫 26 challenges</span>
            </div>
            <div className="box dashboard-col center">
              <span>🔥 5 Streaks</span>
            </div>
          </div>

          {/* 7 Day Tracker */}
          <div className="dashboard-row space-between padding-top">
            <div className="dashboard-col center start">
              <p>Once you start logging we will track your progress here.</p>
            </div>
            <div className="dashboard-col center flex end">
              <div className="dashboard-row">
                <p>Circle Here</p>
              </div>
              <div className="dashboard-row">Today</div>
            </div>
          </div>

          {/* Plant */}
          <div className="dashboard-row center">
            <div className="dashboard-col center progress">
              <img className="plant" src={plantIcon} alt="plant" />
              <p>Your plant is level: {progress?.level}</p>
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
