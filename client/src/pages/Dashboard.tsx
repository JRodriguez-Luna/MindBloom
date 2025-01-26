import plantIcon from '/images/icons/plant.svg';
import { Modal } from './Modal';
import './Dashboard.css';
import { useEffect, useState } from 'react';

type Mood = {
  moodName: string;
  emojiPath: string;
};

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectEmoji, setSelectedEmoji] = useState(null);

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
        setMoods(data);
      } catch (err) {
        throw new Error('failed.');
      }
    }

    getMoods();
  }, []);

  const handleSelectedEmoji = (index: any) => {
    setSelectedEmoji(index);
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-col gap">
          {/* User's Name */}
          <div className="dashboard-row">
            <h1>Hi, Jesus</h1>
          </div>

          {/* Future Features HERE */}
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
              <p>Your plant is level: 1</p>
              <div className="progress-bar">
                <div className="fill-bar"></div>
              </div>
            </div>
          </div>

          <div className="dashboard-row center">
            <button
              onClick={openModal}
              className="custom-button button-text cursor-pointer"
              type="submit">
              Log Mood
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <form className="mood-entry-form dashboard-col" action="">
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
          <p>What made you feel this way?</p>
          <textarea
            name="journal-entry"
            className="journal-entry"
            maxLength={150}></textarea>
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
