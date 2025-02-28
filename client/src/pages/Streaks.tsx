import { StreaksProps } from './Types';

export function Streaks({
  completedChallenges = 0,
  currentStreak = 0,
}: StreaksProps) {
  return (
    <div className="dashboard-row space-between">
      <div className="box dashboard-col center">
        <span>💫 {completedChallenges} Challenges</span>
      </div>
      <div className="box dashboard-col center">
        <span>🔥 {currentStreak} Streaks</span>
      </div>
    </div>
  );
}
