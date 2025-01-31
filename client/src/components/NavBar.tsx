import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  const [selected, isSelected] = useState<number>(1);

  const handleSelected = (index: number) => {
    isSelected(index);
  };

  const navItem = [
    {
      path: '/challenges',
      src: '/images/icons/challenges.svg',
      alt: 'challenges',
    },
    {
      path: '/',
      src: '/images/icons/dashboard.svg',
      alt: 'dashboard',
    },
    {
      path: '/profile',
      src: '/images/icons/profile.svg',
      alt: 'profile',
    },
  ];

  return (
    <>
      <div className="nav-container">
        <nav className="row icons">
          {navItem.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              onClick={() => handleSelected(index)}>
              <img
                src={item.src}
                alt={item.alt}
                className={`${
                  selected === index ? 'filter brightness-0 invert' : ''
                }`}
              />
            </Link>
          ))}
        </nav>
      </div>

      <Outlet />
    </>
  );
}
