import challengeIcon from '/images/icons/challenges.svg';
import dashboardIcon from '/images/icons/dashboard.svg';
import profileIcon from '/images/icons/profile.svg';
import { Outlet, Link } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  return (
    <>
      <div className="nav-container">
        <nav className="row icons">
          <Link>
            <img src={challengeIcon} alt="challenge" />
          </Link>
          <Link to="/">
            <img src={dashboardIcon} alt="dashboard" />
          </Link>
          <Link>
            <img src={profileIcon} alt="profile" />
          </Link>
        </nav>
      </div>

      <Outlet />
    </>
  );
}
