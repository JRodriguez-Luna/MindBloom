import plantIcon from '/images/icons/plant.svg';
import checkmarkIcon from '/images/icons/checkmark.svg';
import './DesktopLayout.css';
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

export function DesktopLayout() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [progress, setProgress] = useState<Progress>();
  const [selectEmoji, setSelectedEmoji] = useState<number>();
  const [counter, setCounter] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

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
      event.preventDefault();

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

      setIsLogged(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
      <div className="desktop-container">
        <div className="desktop-col-half left-content gap-4">
          {/* User's name */}
          <div className="desktop-row">
            <h1 className="text-3xl">Hi, Jesus</h1>
          </div>

          {/* Stats Title */}
          <div className="desktop-row">
            <p className="text-2xl">Stats</p>
          </div>

          {/* Streaks */}
          <div className="desktop-row justify-between">
            <div className="bg-black w-full h-20 rounded-2xl padding">
              <div className="flex h-full justify-center items-center">
                <span>💫 26 challenges</span>
              </div>
            </div>

            <div className="bg-black w-full h-20 rounded-2xl padding">
              <div className="flex h-full justify-center items-center">
                <span>🔥 5 Streaks</span>
              </div>
            </div>
          </div>

          {/* 7 Day Tracker */}
          {/* Future Feature: Will be replaced when first mood is logged. */}
          <div className="desktop-row space-between day-tracker">
            <div className="desktop-col justify-start items-start">
              <p>Once you start logging, we will track your progress here.</p>
            </div>

            <div className="desktop-col justify-start items-end">
              <p>Circle Here</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="desktop-col-half right-content gap-14">
          <div className="desktop-row">
            <h1 className="text-xl">Log Mood</h1>
          </div>

          {/* Log Mood */}
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
                  className="custom-button cursor-pointer"
                  disabled={isLogged}>
                  {isLogged ? (
                    <img
                      className="filter brightness-0 invert"
                      src={checkmarkIcon}
                      alt="checkmark"
                    />
                  ) : (
                    'Log Mood'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Line */}
          <div className="line"></div>

          {/* Plant Title */}
          <div className="desktop-row">
            <h1 className="text-xl">Plant Progress</h1>
          </div>

          {/* Plant Visual */}
          <div className="desktop-row justify-center">
            <div className="desktop-col justify-center items-center progress">
              <img className="plant" src={plantIcon} alt="plant" />
              <p>Your plant is level: {progress?.level}</p>
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
