import React, { useState } from 'react';
import './SearchHistory.scss';
import Results from '../Results/Results';

const SearchHistory = ({ searches }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const openHotelsForDate = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
    setSelectedHotel(null);
  };

  const openChannelsForHotel = (hotelKey) => {
    setSelectedHotel(selectedHotel === hotelKey ? null : hotelKey);
  };

  const dates = Array.from(new Set(searches.map(search => new Date(search.ts).toDateString())));

  const hotelsForSelectedDate = selectedDate
    ? searches.filter(search => new Date(search.ts).toDateString() === selectedDate)
    : [];

  const uniqueHotelsForSelectedDate = Array.from(new Set(hotelsForSelectedDate.map(search => search.key))).map(key => {
    return {
      key,
      searches: hotelsForSelectedDate.filter(search => search.key === key)
    };
  });

  return (
    <div className="search-history">
      <h3>Your Searches</h3>
      {dates.length > 0 ? (
        <ul className="search-list">
          {dates.map((date, index) => (
            <li key={index}>
              <div className="date-card" onClick={() => openHotelsForDate(date)}>
                <strong>Date:</strong> {date}
              </div>
              {selectedDate === date && (
                <ul className="hotel-list">
                  {uniqueHotelsForSelectedDate.map((hotelGroup, idx) => (
                    <li key={idx}>
                      <div className="hotel-card" onClick={() => openChannelsForHotel(hotelGroup.key)}>
                        <div className="search-dates">
                          <strong>Searched Dates:</strong> {hotelGroup.key.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                      {selectedHotel === hotelGroup.key && (
                        <div className="search-details-list">
                          <Results
                            response={JSON.stringify(hotelGroup.searches[0])} 
                          />
                        </div>
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
