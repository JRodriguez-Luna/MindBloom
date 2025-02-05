import plantIcon from '/images/icons/plant.svg';
import handLeafIcon from '/images/icons/handleaf.svg';
import flowerBranchIcon from '/images/icons/flowerbranch.svg';
import './Challenges.css';

export function Challenges() {
  return (
    <>
      <div className="challenge-container">
        <div className="challenge-col gap-4">
          <div className="challenge-row">
            <h1 className="text-3xl">Challenges</h1>
          </div>

          <div className="challenge-row justify-center italic">
            Grow your wellness plant today!
          </div>

          <div className="challenge-col items-center">
            <ul className="challenges">
              <li className="challenge-box">
                <div>
                  <h3 className="text-l">Daily Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={plantIcon} alt="daily-icon" />
                </div>
              </li>
              <li className="challenge-box">
                <div>
                  <h3 className="text-l">Weekly Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={handLeafIcon} alt="weekly-icon" />
                </div>
              </li>
              <li className="challenge-box">
                <div>
                  <h3 className="text-l">Monthly Challenge</h3>
                  <p className="text-sm text-gray-600">0/3 Completed</p>
                </div>
                <div>
                  <img src={flowerBranchIcon} alt="monthly-icon" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
