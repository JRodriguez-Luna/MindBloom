import './Profile.css';
import { MdLogout } from 'react-icons/md';

export function Profile() {
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
          <p>Friend Name</p>
          <p>FriendName@gmail.com</p>
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
