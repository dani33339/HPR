import React from 'react'
import './Results.css'

// Imported icons
import skyscraner from '../Results/assets/skyscanner.png'

function LinkResults({channel, partner, url, price}) {

    const renderIcon = () => {
        switch (channel) {
          case 'skyscanner':
            return <img src={skyscraner} alt="Skyscanner" className="icon" />;
          case 'booking':
            return <img src={booking} alt="Booking.com" className="icon" />;
          case 'agoda':
            return <img src={agoda} alt="Agoda" className="icon" />;
          case 'expedia':
            return <img src={expedia} alt="Expedia" className="icon" />;
          case 'reserving':
            return <img src={reserving} alt="Reserving" className="icon" />;
          default:
            return null;
        }
      };

    
    return (
        <div className='ToplevelResult'>
            <a className='providersResult' href = {url}>
                <div className="providerIcon">{renderIcon()}</div>    
                <a className="providerDetails">
                    <span className="providerName">{partner.charAt(0).toUpperCase() + partner.slice(1)}.com</span>
                </a>
                <span className='price'>{price}$</span>             
            </a>
            <hr></hr>
        </div>
       
       
    );
}



export default LinkResults
