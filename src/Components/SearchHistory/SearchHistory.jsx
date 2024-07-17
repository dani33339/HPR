import React, { useState } from 'react';
import './SearchHistory.scss';

const SearchHistory = ({ searches }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const openChannelsForDate = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
    setSelectedChannel(null);
  };

  const openSearchDetails = (channel) => {
    setSelectedChannel(selectedChannel === channel ? null : channel);
  };

  const closeModal = () => {
    setSelectedChannel(null);
  };

  const dates = Array.from(new Set(searches.map(search => new Date(search.ts).toDateString())));

  const channelsForSelectedDate = selectedDate
    ? searches.filter(search => new Date(search.ts).toDateString() === selectedDate)
    : [];

  const uniqueChannelsForSelectedDate = Array.from(
    new Set(channelsForSelectedDate.map(search => search.channel))
  ).map(channel => {
    return {
      channel,
      searches: channelsForSelectedDate.filter(search => search.channel === channel)
    };
  });

  return (
    <div className="search-history">
      <h3>Your Searches</h3>
      {dates.length > 0 ? (
        <ul className="search-list">
          {dates.map((date, index) => (
            <li key={index}>
              <div className="date-card" onClick={() => openChannelsForDate(date)}>
                <strong>Date:</strong> {date}
              </div>
              {selectedDate === date && (
                <ul className="channel-list">
                  {uniqueChannelsForSelectedDate.map((channelGroup, idx) => (
                    <li key={idx}>
                      <div className="channel-card" onClick={() => openSearchDetails(channelGroup.channel)}>
                        <strong>Channel:</strong> {channelGroup.channel}
                      </div>
                      {selectedChannel === channelGroup.channel && (
                        <ul className="search-details-list">
                          {channelGroup.searches.map((search, searchIdx) => (
                            <li key={searchIdx}>
                              <div className="search-card">
                                <p><strong>Partner:</strong> {search.partner}</p>
                                <p><strong>Price:</strong> {search.price}</p>
                                <p><strong>Date:</strong> {new Date(search.ts).toLocaleString()}</p>
                                <p><strong>URL:</strong> <a href={search.url} target="_blank" rel="noopener noreferrer">Link</a></p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No searches found</p>
      )}
    </div>
  );
};

export default SearchHistory;
