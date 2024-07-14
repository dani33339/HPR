import React from 'react';
import './Results.css';
import LinkResults from './LinkResults';

function Results({ response }) {
  const parsedResponse = JSON.parse(response);
  const hotelData = parsedResponse.hotel_data;
  const deals = [
    ...parsedResponse.google_deals,
    ...parsedResponse.skyscanner_deals,
    ...parsedResponse.trivago_deals,
  ];

  return (
    <div>
      <div className='searchItem'>
        <div className="leftContent">
          <img src={hotelData.image_url} alt="תמונה" className='hotel_image' />
          <h1>{hotelData.name}</h1>
          <h4>Reviews: {hotelData.rating}</h4>
          <h3>Address:</h3>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelData.address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hotelData.address}
          </a>
        </div>
        <div className='rightContent'>
          {deals.map((deal, index) => (
            <LinkResults
              key={index}
              channel={deal.channel}
              partner={deal.partner}
              url={deal.url}
              price={deal.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;
