import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';
import { GoDotFill } from 'react-icons/go';
import { FaPauseCircle, FaPlay } from 'react-icons/fa';
import logo from '/images/icons/logo.svg';
import './TimeChallenge.css';
export function TimeChallenge() {
  const navigate = useNavigate();
  const instructions: Array<string> = ['Inhale', 'Hold', 'Exhale'];
  const totalSets: number = 3;
  const initialTimer: number = 4;
  const [timer, setTimer] = useState<number>(initialTimer);
  const [instructionIndex, setInstructionIndex] = useState<number>(0);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  // Keep references to all timeout IDs so we can cancel them
  const timeoutIds = useRef<Array<NodeJS.Timeout>>([]);
  function clearAllTimeouts(): void {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
  }
  function startTimer(): void {
    if (running) return;
    setRunning(true);
    // Calculate total phases = total sets * number of instructions
    const totalPhases: number = totalSets * instructions.length;
    let currentDelay: number = 0;
    // Outer loop: iterate over each phase
    for (let phase = 0; phase < totalPhases; phase++) {
      // Inner loop: countdown from 4 to 0 seconds for this phase
      for (let sec = initialTimer; sec >= 0; sec--) {
        const timeoutId = setTimeout(() => {
          setTimer(sec);
          // When timer hits 0, update instruction and possibly rounds
          if (sec === 0) {
            setInstructionIndex((prevIndex: number): number => {
              const nextIndex =
                prevIndex === instructions.length - 1 ? 0 : prevIndex + 1;
              if (nextIndex === 0) {
                // Completed a full set
                setRoundsCompleted(
                  (prevRounds: number): number => prevRounds + 1
                );
              }
              return nextIndex;
            });
            // On the very last tick, stop the timer
            if (phase === totalPhases - 1) {
              setRunning(false);
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
              {running ? (
                <FaPauseCircle className="text-5xl" onClick={stopTimer} />
              ) : (
                <FaPlay className="text-5xl" onClick={startTimer} />
              )}
            </div>
            <div className="time-row justify-center items-center text-3xl">
              {/*Future Feature: Dots or n rounds here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
