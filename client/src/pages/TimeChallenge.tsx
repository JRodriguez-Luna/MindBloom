import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { FaPauseCircle, FaPlay } from 'react-icons/fa';
import { ContinueButton } from '../components/ContinueButton';
import logo from '/images/icons/logo.svg';
import './TimeChallenge.css';

export function TimeChallenge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedChallenge, points } = location.state || {
    selectedChallenge: 0,
    points: null,
  };

  const instructions: string[] = ['Inhale', 'Hold', 'Exhale'];
  const totalSets: number = 3;
  const initialTimer: number = 4;

  const [timer, setTimer] = useState<number>(initialTimer);
  const [instructionIndex, setInstructionIndex] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const timeoutIds = useRef<Array<NodeJS.Timeout>>([]);

  function clearAllTimeouts(): void {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
  }

  function startTimer(): void {
    if (running) return;
    setRunning(true);
    const totalPhases: number = totalSets * instructions.length;
    let currentDelay: number = 0;
    for (let phase = 0; phase < totalPhases; phase++) {
      for (let sec = initialTimer; sec >= 0; sec--) {
        const timeoutId = setTimeout(() => {
          setTimer(sec);
          if (sec === 0) {
            setInstructionIndex((prevIndex: number): number => {
              const nextIndex =
                prevIndex === instructions.length - 1 ? 0 : prevIndex + 1;
              return nextIndex;
            });
            if (phase === totalPhases - 1) {
              setRunning(false);
              setCompleted(true);
            }
          }
        }, currentDelay * 1000);
        timeoutIds.current.push(timeoutId);
        currentDelay++;
      }
    }
  }

  function stopTimer(): void {
    clearAllTimeouts();
    setRunning(false);
  }

  const handleSubmit = async () => {
    try {
      const challengesResponse = await fetch('/api/challenges');
      if (!challengesResponse.ok) throw new Error('Failed to fetch challenges');
      const challenges = await challengesResponse.json();

      if (
        selectedChallenge === null ||
        selectedChallenge === undefined ||
        !challenges[selectedChallenge]
      ) {
        console.error('Invalid selectedChallenge index:', selectedChallenge);
        return;
      }

      const challengeId = challenges[selectedChallenge].id;
      const res = await fetch('/api/user-challenges/completion/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, isComplete: true, points }),
      });

      if (!res.ok) throw new Error('Submission failed');
      navigate('/challenges');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="time-container">
      <div className="time-col">
        <div className="time-row">
          <button className="text-3xl" onClick={() => navigate('/challenges')}>
            <TiChevronLeft />
          </button>
        </div>
        <div className="time-col justify-between items-center mt-6">
          <div className="leaf">
            <img src={logo} alt="logo" />
          </div>
          <div className="time-col justify-center items-center gap-12">
            <p className="text-5xl">{timer}</p>
            <p className="text-base italic">{instructions[instructionIndex]}</p>
            <div className="pause-play-buttons">
              {completed ? (
                <ContinueButton active onClick={handleSubmit} />
              ) : running ? (
                <FaPauseCircle className="text-5xl" onClick={stopTimer} />
              ) : (
                <FaPlay className="text-5xl" onClick={startTimer} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
