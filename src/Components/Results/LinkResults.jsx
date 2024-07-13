import React from 'react';
import './Results.css';
import skyscanner from './assets/skyscanner.png';


function LinkResults({ channel, partner, url, price }) {
  const renderIcon = () => {
    switch (channel) {
      case 'skyscanner':
        return <img src={skyscanner} alt="Skyscanner" className="icon" />;
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

  const displayPartner = typeof partner === 'string' && partner.length > 0
    ? partner.charAt(0).toUpperCase() + partner.slice(1)
    : '';

  return (
    <div className='ToplevelResult'>
      <a className='providersResult' href={url}>
        <div className="providerIcon">{renderIcon()}</div>
        <div className="providerDetails">
          <span className="providerName">{displayPartner}</span>
        </div>
        <span className='price'>{price}$</span>
      </a>
      <hr />
    </div>
  );
}

export default LinkResults;
