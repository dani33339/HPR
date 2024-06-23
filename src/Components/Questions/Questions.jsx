import React, { useState } from 'react'
import './Questions.css'
import Accordion from './Accordion'

function Questions() {

  const [active, setActive] = useState("How do I choose the right hotel for me?")

  return (
    <div className='questions section container'>
      <div className="secHeading">
        <h3>
          Frequently Asked Questions
        </h3>
      </div>

      <div className="secContainer grid">

        <div className="accordion grid">
          <Accordion
            title="How do I choose the right hotel for me?"
            desc="test"
            active={active}
            setActive={setActive}
          />
          <Accordion
            title="What are the best times to visit specific destinations?"
            desc="test"
            active={active}
            setActive={setActive}
          />
          <Accordion
            title="How can I find budget-friendly travel options and deals?"
            desc="test"
            active={active}
            setActive={setActive}
          />

          <Accordion
            title="What essential items should I pack for my adventure?"
            desc="test"
            active={active}
            setActive={setActive}
          />
        </div>

        <div className="form">
          <div className="secHeading">
            <h4>
              Do you have any specific question?
            </h4>
            <p>
              Please fill the form below and our
              dedicated team will get in touch with
              you as soon soon as possible.
            </p>
          </div>

          <div className="formContent grid">
            <input type='email' placeholder='Enter email address' data-aos="fade-up"/>
            <textarea placeholder='Enter your question here' data-aos="fade-up"/>
            <button className='btn' data-aos="fade-up">Submit Inquiry</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Questions
