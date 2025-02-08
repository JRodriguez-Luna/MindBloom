import plantIcon from '/images/icons/plant.svg';
import handLeafIcon from '/images/icons/handleaf.svg';
import flowerBranchIcon from '/images/icons/flowerbranch.svg';
import { ContinueButton } from '../components/ContinueButton';
import { Modal } from './Modal';
import './ChallengeCard.css';
import { useState } from 'react';

type ChallengeCardProps = {
  challenges: {
    title: string;
    description: string;
    frequency: string;
    points: number;
  }[];
  handleCategoryToggle: (category: string) => void;
  handleChallengeToggle: (challenge: number) => void;
  selectedCategory: string;
  selectedChallenge: number | null;
};

export function ChallengeCard({
  challenges,
  handleCategoryToggle,
  handleChallengeToggle,
  selectedCategory,
  selectedChallenge,
}: ChallengeCardProps) {
  const challengeCategories = [
    {
      category: 'Daily',
      icon: plantIcon,
    },
    {
      category: 'Weekly',
      icon: handLeafIcon,
    },
    {
      category: 'Monthly',
      icon: flowerBranchIcon,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="challenge-container">
        <div className="challenge-col gap-4">
          {/* Title */}
          <div className="challenge-row">
            <h1 className="text-3xl">Challenges</h1>
          </div>

          {/* Motivation */}
          <div className="challenge-row justify-center italic">
            Grow your wellness plant today!
          </div>

          {/* Challenges Category */}
          <div className="challenge-col items-center ">
            <div className="challenges">
              {/* Category Challenges */}
              {challengeCategories.map((category) => (
                <div key={category.category}>
                  <button
                    className="challenge-box"
                    onClick={() => handleCategoryToggle(category.category)}>
                    <div>
                      <h3 className="text-l">{`${category.category} Challenge`}</h3>
                      <p className="text-sm text-gray-600">0/3 Completed</p>
                    </div>
                    <div>
                      <img src={category.icon} alt={`${category.category}`} />
                    </div>
                  </button>

                  {/* Filter */}
                  {selectedCategory === category.category &&
                    challenges.map(
                      (challenge, index) =>
                        challenge.frequency ===
                          selectedCategory.toLowerCase() && (
                          <button
                            key={index}
                            className={`challenge ${
                              selectedChallenge === index
                                ? 'challenge-selected'
                                : ''
                            }`}
                            onClick={() => handleChallengeToggle(index)}>
                            <div className="challenge-detail challenge-row gap-6">
                              <img
                                src={category.icon}
                                alt={`${challenge.frequency}-icon`}
                              />
                              <div>
                                <h3 className="text-l w-50">
                                  {challenge.title}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {challenge.description}
                                </p>
                              </div>
                              <span>+{challenge.points}</span>
                            </div>
                          </button>
                        )
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContinueButton
        active={selectedChallenge !== null}
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form className="challenge-entry-form challenge-col gap-10 ">
          <h2 className="text-l">Write 3 things you are grateful for today.</h2>
          <div className="challenge-col w-full gap-3">
            <label
              className="challenge-row items-center justify-between w-full gap-3"
              htmlFor="">
              1.
              <textarea
                name="entry"
                className="challenge-entry"
                placeholder="I am grateful for..."
              />
            </label>

            <label
              className="challenge-row items-center justify-between w-full gap-3"
              htmlFor="">
              2.
              <textarea
                name="entry"
                className="challenge-entry"
                placeholder="I am grateful for..."
              />
            </label>

            <label
              className="challenge-row items-center justify-between w-full gap-3"
              htmlFor="">
              3.
              <textarea
                name="entry"
                className="challenge-entry"
                placeholder="I am grateful for..."
              />
            </label>
          </div>

          <div className="flex w-full justify-between items-center">
            <button>Cancel</button>
            <button
              type="submit"
              id="modal-button"
              className="custom-button cursor-pointer">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
