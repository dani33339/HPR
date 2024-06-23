import React, { useState } from 'react'
import './/Navbar.css'
import LoginButton from '../Login/Login.jsx'
import LogoutButton from '../Logout/Logout.jsx'
import DropdownProfile from './OpenProfile.jsx'
//imported image
import logo from './assets/logo.png';
import { AiFillCloseCircle } from "react-icons/ai";
import { PiDotsNineBold } from "react-icons/pi";
import { useAuth0 } from '@auth0/auth0-react';
import { CgProfile } from "react-icons/cg";

const Navbar = ()=> {
  const {logout, isAuthenticated} = useAuth0();
  //State to track and update navbar
  const [navBar, setNavBar] = useState("menu")

  const [OpenProfile, setOpenProfile] = useState(false);

  //Function to show navbar
  const showNavBar = () => {
    setNavBar("menu showNavbar");
  }

  //Function to close navbar
  const closeNavBar = () => {
    setNavBar("menu");
  }

  return (
    <div className='navBar'>
      <div className="logoDiv">
        <img src={logo} alt="My Company Logo" className="icon" height={50} />
      </div>

      <div className={navBar}>
        <ul>
          <li className='navList'>Destination</li>
          <li className='navList'>About us</li>
          <li className='navList'>Testimonial</li>
          <li className='navList'>Gallery</li>
        </ul>
        {/* Icon that remove Navbar */}
        <AiFillCloseCircle className='icon closeIcon' onClick={closeNavBar} />
      </div>
      <div className='user_button'>
        <LoginButton/>
      </div> 
      {isAuthenticated && (     
            <CgProfile onClick={()=> setOpenProfile((prev) => !prev)} cursor="pointer"/>
        )}
        {
            OpenProfile && <DropdownProfile/> 
        }
        

     
      
      {/* Icon that toggle Navbar */}
      <PiDotsNineBold className='icon menuIcon' on onClick={showNavBar} />

    </div>
  )
}

export default Navbar
