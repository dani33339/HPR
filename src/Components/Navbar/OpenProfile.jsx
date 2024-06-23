import React from 'react'
import './/Navbar.css'
import LogoutButton from '../Logout/Logout.jsx'


function OpenProfile() {
  return (
    <div className= 'flex-col dropDownProfile'> 
            <ul className='flex-col gap-4'>
              <li >Profile</li>
              <li>Settings</li>
              <li>
                <LogoutButton/>
              </li>
            </ul>
    </div>
  )
}

export default OpenProfile
