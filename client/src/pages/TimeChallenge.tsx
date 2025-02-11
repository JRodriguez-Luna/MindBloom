import { useNavigate } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { GoDotFill } from 'react-icons/go';
import { FaPauseCircle, FaPlay } from 'react-icons/fa';

import logo from '/images/icons/logo.svg';
import './TimeChallenge.css';

export function TimeChallenge() {
  const navigate = useNavigate();

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
            <p className="text-5xl">4</p>
            <p className="text-base italic">Inhale, Hold, Exhale</p>
            <div className="pause-play-buttons">
              <FaPauseCircle className="text-5xl" />
              <FaPlay className="text-5xl hidden" />
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
