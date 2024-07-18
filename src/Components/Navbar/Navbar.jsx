import React, { useState } from 'react';
import './Navbar.scss';
import LoginButton from '../Login/Login.jsx';
import OpenProfile from '../OpenProfile/OpenProfile.jsx';
import logo from './assets/logo.png';
import { AiFillCloseCircle } from "react-icons/ai";
import { PiDotsNineBold } from "react-icons/pi";
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = ({ scrollToDestinations, scrollToAboutUs, scrollToPricing, scrollToQuestions }) => {
  const { isAuthenticated, user } = useAuth0();
  const [navBar, setNavBar] = useState("menu");
  const [openProfile, setOpenProfile] = useState(false);

  const showNavBar = () => {
    setNavBar("menu showNavbar");
  };

  const closeNavBar = () => {
    setNavBar("menu");
  };

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  return (
    <div className='navBar'>
      <div className="logoDiv">
        <img src={logo} alt="My Company Logo" className="icon" height={50} />
      </div>

      <div className={navBar}>
        <ul>
          <li className='navList' onClick={scrollToAboutUs}>About us</li>
          <li className='navList' onClick={scrollToPricing}>Pricing</li>
          <li className='navList' onClick={scrollToQuestions}>Questions</li>
        </ul>
        <AiFillCloseCircle className='icon closeIcon' onClick={closeNavBar} />
      </div>

      <div className='user_button'>
        {!isAuthenticated ? <LoginButton /> : null}
      </div>

      <div className='profile'>
        {isAuthenticated && (
          <>
            <img 
              src={user.picture} 
              alt="Profile" 
              onClick={() => setOpenProfile((prev) => !prev)} 
              className="profile-icon" 
            />
            {openProfile && <OpenProfile onClose={handleProfileClose} />}
          </>
        )}
      </div>
        
      <PiDotsNineBold className='icon menuIcon' onClick={showNavBar} />
    </div>
  );
}

export default Navbar;
