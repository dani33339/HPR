import React, { useState, useEffect } from 'react';
import './Results.css';
import LinkResults from './LinkResults';

function Results({ response }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState(''); // key to sort by
  const [sortOrder, setSortOrder] = useState('asc'); // sort order: 'asc' or 'desc'
  const [parsedResponse, setParsedResponse] = useState(null);
  const [deals, setDeals] = useState([]);
  const [hotelData, setHotelData] = useState({});

  useEffect(() => {
    const parsed = JSON.parse(response);
    setParsedResponse(parsed);
    setHotelData(parsed.hotel_data);

    const tempDeals = [];
    addDealsIfNotEmpty(tempDeals, parsed.google_deals);
    addDealsIfNotEmpty(tempDeals, parsed.skyscanner_deals);
    addDealsIfNotEmpty(tempDeals, parsed.trivago_deals);
    addDealsIfNotEmpty(tempDeals, parsed.momondo_deals);

    setDeals(tempDeals);
  }, [response]);

  function addDealsIfNotEmpty(dealsArray, dealsToAdd) {
    if (dealsToAdd && dealsToAdd.length > 0) {
      dealsArray.push(...dealsToAdd);
    }
  }

  const filteredDeals = deals.filter(deal => deal && deal.channel && deal.channel.toLowerCase().includes(filter.toLowerCase()));

  const sortedDeals = filteredDeals.sort((a, b) => {
    if (sortKey === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortKey === 'channel') {
      return sortOrder === 'asc' ? a.channel.localeCompare(b.channel) : b.channel.localeCompare(a.channel);
    } else if (sortKey === 'partner') {
      return sortOrder === 'asc' ? a.partner.localeCompare(b.partner) : b.partner.localeCompare(a.partner);
    } else {
      return 0;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className='searchItem'>
      {hotelData && (
        <div className="leftContent">
          {hotelData.image_url && <img src={hotelData.image_url} alt="תמונה" className='hotel_image' />}
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
      )}
      <div className='rightContent'>
        <input
          type="text"
          placeholder="Filter by Meta search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
        />
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => { setSortKey('price'); toggleSortOrder(); }}>
            Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
          </button>
          <button onClick={() => { setSortKey('channel'); toggleSortOrder(); }}>
            Sort by Meta search ({sortOrder === 'asc' ? 'A to Z' : 'Z to A'})
          </button>
          <button onClick={() => { setSortKey('partner'); toggleSortOrder(); }}>
            Sort by OTA ({sortOrder === 'asc' ? 'A to Z' : 'Z to A'})
          </button>
        </div>
        {sortedDeals.length > 0 ? (
          sortedDeals.map((deal, index) => (
            <LinkResults
              key={index}
              channel={deal.channel}
              partner={deal.partner}
              url={deal.url}
              price={deal.price}
            />
          ))
        ) : (
          <p>No deals available</p>
        )}
      </div>
    </div>
  );
}

export default Results;
