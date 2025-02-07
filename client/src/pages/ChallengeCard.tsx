import plantIcon from '/images/icons/plant.svg';
import handLeafIcon from '/images/icons/handleaf.svg';
import flowerBranchIcon from '/images/icons/flowerbranch.svg';
import './ChallengeCard.css';

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
  const challengeList = [
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
              {challengeList.map((l) => (
                <div key={l.category}>
                  <button
                    className="challenge-box"
                    onClick={() => handleCategoryToggle(l.category)}>
                    <div>
                      <h3 className="text-l">{`${l.category} Challenge`}</h3>
                      <p className="text-sm text-gray-600">0/3 Completed</p>
                    </div>
                    <div>
                      <img src={l.icon} alt={`${l.category}`} />
                    </div>
                  </button>

                  {/* Filter */}
                  {selectedCategory === l.category &&
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
                                src={l.icon}
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
    </>
  );
}
