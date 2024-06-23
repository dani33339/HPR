import React from 'react'
import './Subscribe.css'

//Imported Image
import image from "../Subscribe/assets/image.png"


function Subscribe() {
  return (
    <div className='subscribe section container'>
      <div className='secContainer grid'>
        <img src = {image} alt = 'Div Image'/>

        <div className='textDiv' data-aos="fade-up">
          <h4>Best Way To Start Your Journey</h4>
          <p>
          We offer personalized itineraries tailored to
          individual preferences
          and interests.
          </p>
          <button className='btn'>Start Here</button>
        </div>
      </div>    
    </div>
  )
}

export default Subscribe
