import { FormEvent, useState } from 'react';
import { Modal } from '../pages/Modal';

type RenderChallengeProps = {
  selectedCategory: string;
  selectedChallenge: number | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function RenderChallenge({
  selectedCategory,
  selectedChallenge,
  isOpen,
  setIsOpen,
}: RenderChallengeProps) {
  const [error, setError] = useState<boolean[]>([]);
  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const form = event.currentTarget;
      const formData = new FormData(form);
      const entries = Object.fromEntries(formData.entries());
      const errors = Object.values(entries).map((entry) => entry === '');
      setError(errors);

      if (errors.includes(true)) {
        console.warn('Please fill in all fields');
        return;
      }

      console.log('Form data:', entries);
      form.reset(); // Reset form inputs
      setIsOpen(false);
      setError([]);
    } catch (err) {
      console.error('err', err);
    }
  };

  console.log('Array Error:', error);

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
          return (
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div>Another Challenge</div>
            </Modal>
          );

        default:
          return null;
      }

    case 'Weekly':
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
