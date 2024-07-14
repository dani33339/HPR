import React, { useState } from 'react';
import './Navbar.css';
import LoginButton from '../Login/Login.jsx';
import OpenProfile from './OpenProfile.jsx';
// imported image
import logo from './assets/logo.png';
import { AiFillCloseCircle } from "react-icons/ai";
import { PiDotsNineBold } from "react-icons/pi";
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();
  // State to track and update navbar
  const [navBar, setNavBar] = useState("menu");

  const [openProfile, setOpenProfile] = useState(false);

  // Function to show navbar
  const showNavBar = () => {
    setNavBar("menu showNavbar");
  };

  // Function to close navbar
  const closeNavBar = () => {
    setNavBar("menu");
  };

  return (
    <div className='navBar'>
      <div className="logoDiv">
        <img src={logo} alt="My Company Logo" className="icon" height={50} />
      </div>

      <div className={navBar}>
        <ul>
          <li className='navList'>About us</li>
          <li className='navList'>pricing</li>
          <li className='navList'>questions</li>
        </ul>
        {/* Icon that remove Navbar */}
        <AiFillCloseCircle className='icon closeIcon' onClick={closeNavBar} />
      </div>
      <div className='user_button'>
        <LoginButton />
      </div>
      <div className='profile'>
        {isAuthenticated && (
          <img 
            src={user.picture} 
            alt="Profile" 
            onClick={() => setOpenProfile((prev) => !prev)} 
            className="profile-icon" 
            style={{ cursor: 'pointer' }}
          />
        )}
        {
          openProfile && <OpenProfile />
        }
      </div>
      {/* Icon that toggle Navbar */}
      <PiDotsNineBold className='icon menuIcon' onClick={showNavBar} />
    </div>
  );
}

export default Navbar;
