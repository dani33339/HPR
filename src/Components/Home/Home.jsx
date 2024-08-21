import React from 'react';
import './Home.css';
import BgPhoto from './assets/Bgphoto.jpg';
import { AiOutlineSwapRight } from "react-icons/ai";

const Home = ({ scrollToDestinations }) => {
  return (
    <div className='Home'>
      <div className='photoBg'>
        <img src={BgPhoto} alt="Background" className="Bgimage" />
      </div>
      <div className='sectionText grid'>
        <h1>Discover the World with HPR</h1>
        <p>
          Tired of overpaying for hotels? We get it. That's why we created HPR, your one-stop shop for finding the best deals on hotels around the world.
        </p>
        <button className='btn' onClick={scrollToDestinations}>
          GET STARTED
          <AiOutlineSwapRight className='icon' />
        </button>
      </div>   
    </div>
  );
};

export default Home;
