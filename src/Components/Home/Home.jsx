import React from 'react'
import './Home.css'

//import video
import BgPhoto from './assets/Bgphoto.jpg'

//import icon
import { AiOutlineSwapRight } from "react-icons/ai";

function Home() {
  return (
    <div className='Home'>
      <div className='photoBg'>
      <img src={BgPhoto} alt="My Company Logo" className="Bgimage" />
      </div>
      <div className='sectionText grid'>
        <h1>Discover the World with HPR</h1>
        <p>
        Tired of overpaying for hotels? We get it. That's why we created HPR, your one-stop shop for finding the best deals on hotels around the world.
        </p>
        <button className='btn' flex>
          GET STARTED
        <AiOutlineSwapRight className='icon'/>
        </button>
      </div>   
    </div>
  )
}

export default Home
