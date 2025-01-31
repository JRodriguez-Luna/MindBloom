import challengeIcon from '/images/icons/challenges.svg';
import dashboardIcon from '/images/icons/dashboard.svg';
import profileIcon from '/images/icons/profile.svg';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  const [selected, isSelected] = useState<number>(1);

  const handleSelected = (index: number) => {
    isSelected(index);
  };

  return (
    <>
      <div className="nav-container">
        <nav className="row icons">
          <Link to="/challenges" onClick={() => handleSelected(0)}>
            <img
              src={challengeIcon}
              alt="challenge"
              className={`${
                selected === 0 ? 'filter brightness-0 invert' : ''
              }`}
            />
          </Link>
          <Link to="/" onClick={() => handleSelected(1)}>
            <img
              src={dashboardIcon}
              alt="dashboard"
              className={`${
                selected === 1 ? 'filter brightness-0 invert' : ''
              }`}
            />
          </Link>
          <Link to="/profile" onClick={() => handleSelected(2)}>
            <img
              src={profileIcon}
              alt="profile"
              className={`${
                selected === 2 ? 'filter brightness-0 invert' : ''
              }`}
            />
          </Link>
        </nav>
      </div>

      <Outlet />
    </>
  );
}
