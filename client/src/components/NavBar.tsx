import logoIcon from '/images/icons/logo.svg';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
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

  // Function to determine if an item is selected based on the current path
  const isSelected = (path: string) => {
    // Exact match for dashboard
    if (path === '/app' && currentPath === '/app') {
      return true;
    }

    return path !== '/app' && currentPath.startsWith(path);
  };

  return (
    <>
      <div className="nav-container desktop-nav-container">
        <nav className="row icons">
          <img className="desktop-logo" src={logoIcon} alt="logo" />
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <div
                className={`icon-box ${
                  isSelected(item.path) ? 'selected-box' : ''
                }`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`${
                    isSelected(item.path) ? 'filter brightness-0 invert' : ''
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
