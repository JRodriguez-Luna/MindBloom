import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { FaPauseCircle, FaPlay } from 'react-icons/fa';
import { ContinueButton } from '../components/ContinueButton';
import logo from '/images/icons/logo.svg';
import './TimeChallenge.css';
import { User } from './Types';
import { getAuthHeaders } from '../lib/auth';

type TimeChallengeProps = {
  user: User | null;
};

export function TimeChallenge({ user }: TimeChallengeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedChallenge, points } = location.state || {
    selectedChallenge: 0,
    points: null,
  };

  const [submitError, setSubmitError] = useState<string | null>(null);
  const instructions: string[] = ['Inhale', 'Hold', 'Exhale'];
  const totalSets: number = 3;
  const initialTimer: number = 4;

  const [timer, setTimer] = useState<number>(initialTimer);
  const [instructionIndex, setInstructionIndex] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const timeoutIds = useRef<Array<NodeJS.Timeout>>([]);

  useEffect(() => {
    if (!user) {
      setSubmitError('Please sign in to complete challenges');
    } else {
      setSubmitError(null);
    }
  }, [user]);

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
      setSubmitError(null);

      if (!user || !user.id) {
        setSubmitError('Please sign in to complete challenges');
        return;
      }

      const challengesResponse = await fetch('/api/challenges', {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!challengesResponse.ok) throw new Error('Failed to fetch challenges');
      const challenges = await challengesResponse.json();

      if (
        selectedChallenge === null ||
        selectedChallenge === undefined ||
        !challenges[selectedChallenge]
      ) {
        setSubmitError('Challenge not found');
        return;
      }

      const challengeId = challenges[selectedChallenge].id;

      const res = await fetch(`/api/user-challenges/completion/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ challengeId, isComplete: true, points }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Submission failed');
      }

      navigate('/app/challenges');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="time-container">
      <div className="time-col">
        <div className="time-row">
          <button
            className="text-3xl"
            onClick={() => navigate('/app/challenges')}>
            <TiChevronLeft className="cursor-pointer" />
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
                <>
                  {submitError && (
                    <p className="text-red-500 mb-2">{submitError}</p>
                  )}
                  <ContinueButton active onClick={handleSubmit} />
                </>
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
