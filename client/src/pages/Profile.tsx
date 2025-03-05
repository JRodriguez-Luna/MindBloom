import './Profile.css';
import { MdLogout } from 'react-icons/md';
import { User } from './Types';

type ProfileProps = {
  user: User | null;
};

export function Profile({ user }: ProfileProps) {
  if (!user?.firstName || !user?.lastName || !user.email) {
    console.error('Failed to get profile details');
    return;
  }
  const userName = user.firstName + user.lastName;

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
          <button className="logout-button profile-row justify-evenly items-center text-xl">
            <MdLogout className="text-3xl" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
