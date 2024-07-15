import React, { useState } from 'react';
import './Destinations.css';
import DateRangeComp from "../DateRangeComp/DateRangeComp.jsx";
import ReactLoading from 'react-loading';
import format from 'date-fns/format';
import { FaHotel } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { MdAlternateEmail } from "react-icons/md";
import { handleSearch as searchHotel } from '../api/hotel.js'; 
import Results from '../Results/Results.jsx';
import { useAuth0 } from '@auth0/auth0-react';

const Destinations = () => {
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearchClick = () => {
    let user_role;
    console.log(user);
    if (user && user["/roles"] && user["/roles"].length > 0) {
      user_role = user["/roles"][0];
    } else {
      user_role = "user";
    }
  
    let user_id;
    if (isAuthenticated) {
      user_id = encodeURIComponent(user.sub);
    } else {
      user_id = "guest";
    }
  
    const payload = {
      hotel_name: hotelName,
      checkin_date: format(startDate, 'yyyy-MM-dd'),
      checkout_date: format(endDate, 'yyyy-MM-dd'),
      user_id: user_id,
      user_role: user_role
    };
  
    searchHotel(payload, setLoading, setError, setResponse);
  };

  return (
    <div className='destination section container'>
      <div className='secContainer'>
        <div className='secTitle'>
          <span className='redText'>Find now</span>
          <h3>Find your Dream Destination</h3>
          <p>Fill in the fields below to find the best price for your desired hotel.</p>
        </div>
        
        <div className='searchField '>
          <div className="inputFiled flex">
            <FaHotel className='icon' />
            <input
              type="text"
              placeholder='hotel name'
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="inputFiled flex">
            <MdAlternateEmail className='icon' />
            <input
              type="email"
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <DateRangeComp className="DataRange" onDateChange={handleDateChange} />

          <button className='serchebtn btn flex' disabled={loading} onClick={handleSearchClick}>
            <BiSearchAlt className='icon' />
            {loading ? 'searching...' : 'search'}
          </button>
        </div>
        {loading ? (
            <ReactLoading type='bars' className='Loading' />
          ) : null}
          
          {response && (
            <div style={{ marginTop: '20px' }}>
              
              <div className='resultsection'>
                <Results
                  response={JSON.stringify(response, null, 2)}   
                />
              </div>
            </div>
          )}
          {error && (
            <div style={{ marginTop: '20px', color: 'red' }}>
              <h3>error:</h3>
              <p>{error}</p>
            </div>
          )}
          
      </div>  
    </div>
  );
}

export default Destinations;
