import React, { useState } from 'react';
import LogoutButton from '../Logout/Logout.jsx';
import UserProfile from '../UserProfile/UserProfile.jsx';

const OpenProfile = ({ onClose }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <div className='flex-col dropDownProfile'>
      {showUserProfile ? (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='close-button' onClick={() => setShowUserProfile(false)}>
              &times;
            </button>
            <UserProfile />
          </div>
         
        </div>
      ) : (
        <ul className='flex-col gap-4'>
          <li onClick={() => setShowUserProfile(true)}>Profile</li>     
          <li>
            <LogoutButton />
          </li>
        </ul>
      )}
    </div>
  );
}

export default OpenProfile;
