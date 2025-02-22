import plantIcon from '/images/icons/plant.svg';
import './DesktopLayout.css';
import { LayoutProps } from './Types';

export function DesktopLayout({
  moods,
  progress,
  selectEmoji,
  counter,
  handleSelectedEmoji,
  handleCharacterCount,
  handleSubmit,
}: LayoutProps) {
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
                <span>💫 {progress?.completedChallenges} Challenges</span>
              </div>
            </div>

            <div className="bg-black w-full h-20 rounded-2xl padding">
              <div className="flex h-full justify-center items-center">
                <span>🔥 {progress?.currentStreak} Streaks</span>
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
        <div className="desktop-col-half right-content gap-5">
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
                  className="custom-button cursor-pointer">
                  Log Mood
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
