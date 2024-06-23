import React from 'react'
import './Footer.css'

//imported image
import logo from './assets/logo.png';

//imported icon
import { ImFacebook } from "react-icons/im";
import { AiFillInstagram } from "react-icons/ai";


function Footer() {
  return (
    <div className='footer'> 
      <div className="secContainer container grid">
        <div className="logoDiv">
          <div className="footerLogo">
            <img src={logo} alt="My Company Logo" className="icon"/>       
          </div>

          <div className="socials flex">
            <ImFacebook className='icon'/>
            <AiFillInstagram className='icon'/>
          </div>

          <div className='footerLinks'>
              <span className='linkTitle'>Information</span>
              <li>
                <a href=''>Home</a>
              </li>
              <li>
                <a href=''>Explore</a>
              </li>
              <li>
                <a href=''>Travel</a>
              </li>
              <li>
                <a href=''>Blog</a>
              </li>
          </div>

          <div className='footerLinks'>
              <span className='linkTitle'>Helpful Links</span>
              <li>
                <li>
                  <a href=''>Destination</a>
                </li>
                <li>
                  <a href=''>Support</a>
                </li>
                <li>
                  <a href=''>Travel & Condition</a>
                </li>
                <li>
                  <a href=''>Privacy</a>
                </li>
              </li>
          </div>
          
          <div className='footerLinks'>
              <span className='linkTitle'>Contact Details</span>
              <span className='phone'>example</span>
              <span className='email'>exemple@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
