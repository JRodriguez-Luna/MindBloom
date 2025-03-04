import logoIcon from '/images/icons/logo.svg';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  const [selected, isSelected] = useState<number>(0);

  const handleSelected = (index: number) => {
    isSelected(index);
  };

  const navItem = [
    {
      path: '/app',
      src: '/images/icons/dashboard.svg',
      alt: 'dashboard',
    },
    {
      path: '/app/challenges',
      src: '/images/icons/challenges.svg',
      alt: 'challenges',
    },
    {
      path: '/app/profile',
      src: '/images/icons/profile.svg',
      alt: 'profile',
    },
  ];

  return (
    <>
      <div className="nav-container desktop-nav-container">
        <nav className="row icons">
          <img className="desktop-logo" src={logoIcon} alt="logo" />
          {navItem.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              onClick={() => handleSelected(index)}>
              <div
                className={`icon-box ${
                  selected === index ? 'selected-box' : ''
                }`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`${
                    selected === index ? 'filter brightness-0 invert' : ''
                  }`}
                />
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <Outlet />
    </>
  );
}
