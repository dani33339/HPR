import React, { useEffect } from 'react';
import './Results.css';
import LinkResults from './LinkResults';

function Results({ response, responseHotel }) {
  useEffect(() => {
    console.log("Response Props:", { response, responseHotel });
  }, [response, responseHotel]);

  return (
    <div>
      <div className='searchItem'>
        <div className="leftContent">
          <img src={responseHotel.image_url} alt="תמונה" className='hotel_image' />
          <h1>{responseHotel.name}</h1>
          <h4>ביקורות: {responseHotel.rating}</h4>
          <h3>כתובת:</h3>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(responseHotel.address)}`} target="_blank" rel="noopener noreferrer">{responseHotel.address}</a>
        </div>
        <div className='rightContent'>
          {response.map((result, index) => (
            <LinkResults
              key={index}
              channel={result.channel}
              partner={result.partner}
              url={result.url}
              price={result.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;
