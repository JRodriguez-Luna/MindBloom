import challengeIcon from '/images/icons/challenges.svg';
import dashboardIcon from '/images/icons/dashboard.svg';
import profileIcon from '/images/icons/profile.svg';
import './Header.css';

export function Header() {
  return (
    <>
      <div className="nav-container">
        <nav className="row icons">
          <div className="column icon">
            <img src={challengeIcon} alt="challenge" />
          </div>
          <div className="column icon">
            <img src={dashboardIcon} alt="dashboard" />
          </div>
          <div className="column icon">
            <img src={profileIcon} alt="profile" />
          </div>
        </nav>
      </div>
    </>
  );
}
