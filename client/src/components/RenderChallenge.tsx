import { FormEvent, useState } from 'react';
import { Modal } from '../pages/Modal';
import { useNavigate } from 'react-router-dom';
import { User } from '../pages/Types';

type RenderChallengeProps = {
  selectedCategory: string;
  selectedChallenge: number | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  points: number | null;
  refreshUserChallenges: () => Promise<void>;
  user: User | null;
};

export function RenderChallenge({
  selectedCategory,
  selectedChallenge,
  isOpen,
  setIsOpen,
  points,
  refreshUserChallenges,
  user,
}: RenderChallengeProps) {
  const [error, setError] = useState<boolean[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setSubmitError(null);

      if (!user || !user.id) {
        setSubmitError('Please sign in to complete challenges');
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const entries = Object.fromEntries(formData.entries());
      const errors = Object.values(entries).map((entry) => entry === '');
      setError(errors);

      if (errors.includes(true)) {
        return;
      }

      const challengesResponse = await fetch('/api/challenges');
      if (!challengesResponse.ok) throw new Error('Failed to fetch challenges');
      const challenges = await challengesResponse.json();

      if (!challenges || !challenges[selectedChallenge!]) {
        throw new Error('Challenge not found');
      }

      const challengeId = challenges[selectedChallenge!].id;

      const res = await fetch(`/api/user-challenges/completion/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, isComplete: true, points }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Submission failed');
      }

      form.reset();
      setIsOpen(false);
      setError([]);
      await refreshUserChallenges();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  switch (selectedCategory) {
    case 'Daily':
      switch (selectedChallenge) {
        case 0:
          return (
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <form
                className="challenge-entry-form challenge-col gap-10"
                onSubmit={handleSubmit}>
                <h2 className="text-l">
                  Write 3 things you are grateful for today.
                </h2>
                <div className="challenge-col w-full gap-3">
                  <label className="challenge-row items-center justify-between w-full gap-3">
                    <p className={`${error[0] ? 'text-red-500' : ''}`}>1.</p>
                    <textarea
                      name="gratitude-1"
                      className="challenge-entry"
                      placeholder="I am grateful for..."
                    />
                  </label>

                  <label className="challenge-row items-center justify-between w-full gap-3">
                    <p className={`${error[1] ? 'text-red-500' : ''}`}>2.</p>
                    <textarea
                      name="gratitude-2"
                      className="challenge-entry"
                      placeholder="I am grateful for..."
                    />
                  </label>

                  <label className="challenge-row items-center justify-between w-full gap-3">
                    <p className={`${error[2] ? 'text-red-500' : ''}`}>3.</p>
                    <textarea
                      name="gratitude-3"
                      className="challenge-entry"
                      placeholder="I am grateful for..."
                    />
                  </label>
                </div>

                {submitError && <p className="text-red-500">{submitError}</p>}

                <div className="flex w-full justify-between items-center">
                  <button type="button" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="modal-button"
                    className="custom-button cursor-pointer">
                    Save
                  </button>
                </div>
              </form>
            </Modal>
          );

        case 1:
          navigate('/time-challenge', { state: { selectedChallenge, points } });
          break;

        default:
          return null;
      }
      break;

    case 'Weekly':
      return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>No challenges defined yet.</div>
        </Modal>
      );

    case 'Monthly':
      return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>No challenges defined yet.</div>
        </Modal>
      );

    default:
      return null;
  }
}
