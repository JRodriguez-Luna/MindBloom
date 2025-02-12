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
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  function handleClick() {
    if (!toggle) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1; // Decrement
          } else {
            setIndex((prevIndex) => {
              const newIndex =
                prevIndex >= instructions.length - 1 ? 0 : prevIndex + 1;
              console.log(
                `Timer reached 0. Updating index from ${prevIndex} to ${newIndex}`
              );
              if (newIndex === 0) {
                setRoundsCompleted((prevRound) => prevRound + 1);
                console.log(`Rounds completed: ${roundsCompleted + 1}`);
              }
              return newIndex;
            });
            return 4; // Reset the timer
          }
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      console.log('Interval cleared');
    }
    setToggle((prevToggle) => !prevToggle);
    console.log(`Toggle set to: ${!toggle}`);
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

            <div className="time-row justify-center items-center text-3xl">
              {[0, 1, 2].map((dotIndex) => (
                <GoDotFill
                  key={dotIndex}
                  className={
                    roundsCompleted === dotIndex ? 'text-teal-400' : ''
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
