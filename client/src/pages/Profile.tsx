import './Profile.css';
import { MdLogout } from 'react-icons/md';
import { User } from './Types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type ProfileProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export function Profile({ user, setUser }: ProfileProps) {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoggingOut && user === null) {
      navigate('/');
    }
  }, [user, isLoggingOut, navigate]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setUser(null);
  };

  if (!user?.firstName || !user?.lastName || !user.email) {
    return (
      <div className="profile-container profile-col">
        Loading profile information...
      </div>
    );
  }
  const userName = user.firstName + ' ' + user.lastName;

  return (
    <div className="profile-container">
      <div className="profile-col gap-4">
        <div className="profile-row">
          <h1 className="text-3xl">Profile</h1>
        </div>

        <div className="profile-row justify-center items-center">
          <img className="profile-pic" src="" alt="" />
        </div>

        <div className="profile-col justify-center items-center">
          <p>{userName}</p>
          <p>{user.email}</p>
        </div>

        <div className="profile-row justify-center items-center">
          <button
            className="logout-button profile-row justify-evenly items-center text-xl"
            onClick={handleLogout}>
            <MdLogout className="text-3xl" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
