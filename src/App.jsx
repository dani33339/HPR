import React, { useRef } from 'react';
import './App.css';
import Destinations from './Components/Destinations/Destinations';
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Portfolio from './Components/Portfolio/Portfolio';
import Questions from './Components/Questions/Questions';
import Acountstype from './Components/Acountstype/Acountstype';

function App() {
  const destinationsRef = useRef(null);
  const aboutUsRef = useRef(null);
  const pricingRef = useRef(null);
  const questionsRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDestinations = () => {
    if (destinationsRef.current) {
      destinationsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <>
      <Navbar 
        scrollToDestinations={() => scrollToSection(destinationsRef)} 
        scrollToAboutUs={() => scrollToSection(aboutUsRef)}
        scrollToPricing={() => scrollToSection(pricingRef)}
        scrollToQuestions={() => scrollToSection(questionsRef)}
      />
      <Home scrollToDestinations={scrollToDestinations} />
        <Portfolio />
      <div ref={destinationsRef} className="scroll-target">
        <Destinations />
      </div>
      <div ref={questionsRef}>
        <Questions />
      </div>
      <div ref={pricingRef}>
        <Acountstype />   
      </div>
      <div ref={aboutUsRef}>
        <Footer />
      </div>
    </>
  );
}

export default App;
