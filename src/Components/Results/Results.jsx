import React from 'react';
import './Results.css';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import LinkResults from './LinkResults';

function Results({ image, name, rating, address, channel, partner, url, price }) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className='searchItem'>
      <div className="leftContent">
        <img src={image} alt="Image" className='hotel_image' /> {/* Render the image using an img tag */}
        <h1>{name}</h1>
        <h4>reviews: {rating}</h4>
        <h3>address:</h3>
        <a href={googleMapsUrl}>{address}</a>
      </div>
      <div className='rightContent'>
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
        <LinkResults channel={channel} partner={partner} url={url} price={price} />
      </div>
    </div>
  );
}

export default Results;
