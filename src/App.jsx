import './App.css'
import Destinations from './Components/Destinations/Destinations'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'
import Navbar from './Components/Navbar/Navbar'
import Portfolio from './Components/Portfolio/Portfolio'
import Questions from './Components/Questions/Questions'
import Pricing from './Components/Pricing/pricing.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Portfolio />
      <Destinations />
      <Questions />
      <Pricing/>
      <Footer />
    </>
  )
}

export default App
