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
  selectedCategory: string;
};

export function ChallengeCard({
  challenges,
  handleCategoryToggle,
}: ChallengeCardProps) {
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
              {/* Daily */}
              <button
                className="challenge-box"
                onClick={() => handleCategoryToggle('daily')}>
                <div>
                  <h3 className="text-l">Daily Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={plantIcon} alt="daily-icon" />
                </div>
              </button>

              {/* Series of Daily Challenges */}

              {challenges.map(
                (challenge, index) =>
                  challenge.frequency === 'daily' && (
                    <button
                      key={index}
                      className="challenge challenge-selected">
                      <div className="challenge-detail challenge-row gap-6">
                        <img src={plantIcon} alt="daily-icon" />
                        <div>
                          <h3 className="text-l w-50">{challenge.title}</h3>
                          <p className="text-xs text-gray-400">
                            {challenge.description}
                          </p>
                        </div>
                        <span>+{challenge.points}</span>
                      </div>
                    </button>
                  )
              )}

              {/* Weekly */}
              <button className="challenge-box">
                <div>
                  <h3 className="text-l">Weekly Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={handLeafIcon} alt="weekly-icon" />
                </div>
              </button>

              {/* Series of Weekly Challenges */}
              {challenges.map(
                (challenge, index) =>
                  challenge.frequency === 'weekly' && (
                    <button
                      key={index}
                      className="challenge challenge-selected">
                      <div className="challenge-detail challenge-row gap-6">
                        <img src={handLeafIcon} alt="daily-icon" />
                        <div>
                          <h3 className="text-l w-50">{challenge.title}</h3>
                          <p className="text-xs text-gray-400">
                            {challenge.description}
                          </p>
                        </div>
                        <span>+{challenge.points}</span>
                      </div>
                    </button>
                  )
              )}

              {/* Monthly */}
              <button className="challenge-box">
                <div>
                  <h3 className="text-l">Monthly Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={flowerBranchIcon} alt="monthly-icon" />
                </div>
              </button>

              {/* Series of Monthly Challenges */}
              {challenges.map(
                (challenge, index) =>
                  challenge.frequency === 'monthly' && (
                    <button
                      key={index}
                      className="challenge challenge-selected">
                      <div className="challenge-detail challenge-row gap-6">
                        <img src={flowerBranchIcon} alt="daily-icon" />
                        <div>
                          <h3 className="text-l w-50">{challenge.title}</h3>
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
          </div>
        </div>
      </div>
    </>
  );
}
