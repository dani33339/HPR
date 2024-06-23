import React, { useState } from 'react';
import './Destinations.css';
import DateRangeComp from "../DateRangeComp/DateRangeComp.jsx";
import axios from 'axios';
import ReactLoading from 'react-loading';
import Results from '../Results/Results.jsx';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Imported icons
import { FaHotel } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { MdAlternateEmail } from "react-icons/md";

const Destinations = () => {
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const result_hotle_diteils =  {'address': '232 aonang beach, Tambon Ao Nang, Muang Krabi 81180, Thailand'
    , 'image_url': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AUGGfZk1WTi_BWUeZ706A5SwDEQ4AkhrKlDD5T3v09hu0PkPiIktSvkcTrS5t5DvCtp5YLIUtnTWwEkMFZStx-PkYzMW8bbx5gdX9QHIAMfTJaGmYb17ouF-XIjZ7wfSUnbbYtOg5FV0zbd2opEpFsfwysjmDioCxInSg8LoYfjHY1unQzsX&key=AIzaSyBfHKjMQFF7pcg3NdlGe-xlIVSC-ynmFyE', 
    'name': 'Krabi Resort', 
    'rating': '4.2', 
    'skyscanner_id': '128470690',
     'stars': '4', 
     'trivago_id': 'hotel-holiday-style-ao-nang-beach-resort-krabi?search=100-6880320'}

    const result =  {'channel': 'skyscanner', 
      'partner': 'Agoda', 
      'price': 49.5,
       'sr_id': 'ibisbangkoksiam2024-10-162024-10-1721admin20240621133401', 
       'ts': '2024-06-21T13:34:10', 
       'url': '//www.skyscanner.co.in/hotel_deeplink/4.0/IN/en-GB/USD/h_ad/159188513/2024-10-16/2024-10-17/hotel/hotel/hotels?guests=2&rooms=1&legacy_provider_id=22&request_id=11e2cedd-9556-4702-865d-c9fdf0a4bca5&pre_redirect_id=11e2cedd-9556-4702-865d-c9fdf0a4bca5&q_datetime_utc=2024-06-21T13%3A34%3A07&redirect_delay=1000&appName=web&appVersion=2.0&client_id=skyscanner_website&tm_city_code=BKKT&tm_country_code=TH&tm_place_name=Bangkok&tm_stars=4&ticket_price=42.0&deeplink_data=eyJmaWVsZHMiOiB7InNpZ25hdHVyZSI6ICIyYjBkYWRkMGRhMDAwYzM1ZmFjNGFlOWVmZGNmNDRlZSJ9LCAidXJsIjogImh0dHBzOi8vd3d3LmFnb2RhLmNvbS9lbi1nYi9wYXJ0bmVycy9wYXJ0bmVyc2VhcmNoLmFzcHg%2FY2lkPTE4NDYzNzAmaGlkPTMwMTQyNjQmY3VycmVuY3k9VVNEJmNoZWNraW49MjAyNC0xMC0xNiZjaGVja291dD0yMDI0LTEwLTE3Jk51bWJlcm9mQWR1bHRzPTImTnVtYmVyb2ZDaGlsZHJlbj0wJlJvb21zPTEmbWNpZD0zMDM4Jm1hc3RlclJvb21JZD0xODMxMDcxMCJ9&max_price=42.0&channel=website'
      }


  const handleSearch = async () => {
    const url = 'http://129.159.151.202:5000/search';
    const payload = {
      hotel_name:'ibis bangkok siam',
      checkin_date: '2024-06-18', 
      checkout_date: '2024-06-19',
      adults: 2,
      no_rooms: 1,
      children: "",
      user_id: ''
    };
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(url, payload);
      console.log(res);
      setResponse(res.data);
    } catch (err) {
      setError(`Error: ${err.response?.status || 'Unknown'}, ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='destination section container'>
      <div className='secContainer'>
        <div className='secTitle'>
          <span className='redText'>EXPLORE NOW</span>
          <h3>Find your Dream Destination</h3>
          <p>Fill in the fields below to find the best hotel for your next tour.</p>
        </div>
        
        <div className='searchField grid'>
          <div className="inputFiled flex">
            <FaHotel className='icon' />
            <input
              type="text"
              placeholder='Hotel Name'
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="inputFiled flex">
            <MdAlternateEmail className='icon' />
            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <DateRangeComp className="DataRange" />

          <button className='btn flex' onClick={handleSearch} disabled={loading}>
            <BiSearchAlt className='icon' />
            {loading ? 'Searching...' : 'Search'}
          </button>
{/*          
            {loading ?
              ''
            : 
            <ReactLoading 
            type='bars' 
            className='Loading'
            />      
            }
            {response && (
              <div style={{ marginTop: '20px' }}>
                <h3>Search Results:</h3>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
            {error && (
              <div style={{ marginTop: '20px', color: 'red' }}>
                <h3>Error:</h3>
                <p>{error}</p>
              </div>
            )}           */}
        </div>

        <div className='resultsection'>
            <div className='listResult'>
              <Results
              image =  {result_hotle_diteils.image_url}
              name = {result_hotle_diteils.name}
              rating = {result_hotle_diteils.rating}
              address = {result_hotle_diteils.address}
              channel = {result.channel}
              partner = {result.partner}
              url = {result.url}
              price = {result.price}
              />
            </div>
        </div>
      </div>  
    </div>
  );
}

export default Destinations;
