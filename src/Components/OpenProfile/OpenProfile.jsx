import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import LogoutButton from '../Logout/Logout.jsx';
import UserProfile from '../UserProfile/UserProfile.jsx';
import './OpenProfile.scss';

const OpenProfile = ({ onClose }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleClose = () => {
    setShowUserProfile(false);
    if (onClose) {
      onClose();
    }
  };

  const overlayContent = (
    <div className='overlay' onClick={handleClose}>
      <div className='content' onClick={(e) => e.stopPropagation()}>
        <button className='close' onClick={handleClose}>
          &times;
        </button>
        <UserProfile />
      </div>
    </div>
  );

  return (
    <>
      <div className='flex-col dropDownProfile'>
        <ul className='flex-col gap-4'>
          <li onClick={() => setShowUserProfile(true)}>Profile</li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
      {showUserProfile && ReactDOM.createPortal(overlayContent, document.body)}
    </>
  );
};

export default OpenProfile;
