import React, { useState } from 'react';
import './SearchHistory.scss';

const SearchHistory = ({ searches }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const openChannelsForDate = (date) => {
    setSelectedDate(date);
    setSelectedChannel(null);
  };

  const openSearchDetails = (search) => {
    setSelectedChannel(search);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedChannel(null);
  };

  const dates = Array.from(new Set(searches.map(search => new Date(search.ts).toDateString())));

  const channelsForSelectedDate = selectedDate
    ? searches.filter(search => new Date(search.ts).toDateString() === selectedDate)
    : [];

  return (
    <div className="search-history">
      <h3>Your Searches</h3>
      {dates.length > 0 ? (
        <ul className="search-list">
          {dates.map((date, index) => (
            <li key={index} onClick={() => openChannelsForDate(date)}>
              <strong>Date:</strong> {date} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No searches found</p>
      )}
      {selectedDate && (
        <div className="search-details-modal" onClick={closeModal}>
          <div className="search-details-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <h3>Channels for {selectedDate}</h3>
            <ul className="channel-list">
              {channelsForSelectedDate.map((search, index) => (
                <li key={index} onClick={() => openSearchDetails(search)}>
                  <strong>Channel:</strong> {search.channel} <br />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {selectedChannel && (
        <div className="search-details-modal" onClick={closeModal}>
          <div className="search-details-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <h3>Search Details</h3>
            <p><strong>Channel:</strong> {selectedChannel.channel}</p>
            <p><strong>Partner:</strong> {selectedChannel.partner}</p>
            <p><strong>Price:</strong> {selectedChannel.price}</p>
            <p><strong>Date:</strong> {new Date(selectedChannel.ts).toLocaleString()}</p>
            <p><strong>URL:</strong> <a href={selectedChannel.url} target="_blank" rel="noopener noreferrer">Link</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
