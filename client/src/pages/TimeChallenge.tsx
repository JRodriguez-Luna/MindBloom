import { useNavigate } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { GoDotFill } from 'react-icons/go';
import { FaPauseCircle, FaPlay } from 'react-icons/fa';

import logo from '/images/icons/logo.svg';
import './TimeChallenge.css';
import { useState } from 'react';

export function TimeChallenge() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(4);
  const [index, setIndex] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number>();
  const instructions = ['Inhale', 'Hold', 'Exhale'];

  function handleClick() {
    if (!toggle) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1; // Decrement
          } else {
            // Circle around the array
            setIndex((prevIndex) =>
              prevIndex >= instructions.length - 1 ? 0 : prevIndex + 1
            );
            return 4; // Reset the timer for the next round.
          }
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    // Play or Pause
    setToggle((prevToggle) => !prevToggle);
  }

  return (
    <div className="time-container">
      <div className="time-col">
        <div className="time-row">
          <button className="text-3xl" onClick={() => navigate('/challenges')}>
            <TiChevronLeft />
          </button>
        </div>
        <div className="time-col justify-between items-center mt-6">
          {/* Leaf Logo */}
          <div className="leaf">
            <img src={logo} alt="logo" />
          </div>

          <div className="time-col justify-center items-center gap-12">
            <p className="text-5xl">{timer}</p>
            <p className="text-base italic">{instructions[index]}</p>
            <div className="pause-play-buttons">
              <FaPauseCircle
                className={`text-5xl ${toggle ? '' : 'hidden'}`}
                onClick={handleClick}
              />
              <FaPlay
                className={`text-5xl ${toggle ? 'hidden' : ''}`}
                onClick={handleClick}
              />
            </div>

            {/* Dots to be transformed into mini logo */}
            <div className="time-row justify-center items-center text-3xl">
              <GoDotFill />
              <GoDotFill />
              <GoDotFill />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
