import React, { useState } from 'react';
import './Destinations.css';
import DateRangeComp from "../DateRangeComp/DateRangeComp.jsx";
import ReactLoading from 'react-loading';
import Results from '../Results/Results.jsx';
import format from 'date-fns/format';
import { FaHotel } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { MdAlternateEmail } from "react-icons/md";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { handleSearch, getHotel } from '../api/hotel.js'; 

const GuestPicker = ({ numOfAdults, setNumOfAdults, numOfChildren, setNumOfChildren, numOfRooms, setNumOfRooms }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="guestPicker">
      <button className="guestPickerButton" onClick={() => setOpen(!open)}>
        <FaUser /> {numOfAdults} מבוגרים · {numOfChildren} ילדים · {numOfRooms} חדר <FaChevronDown />
      </button>
      {open && (
        <div className="guestPickerDropdown">
          <div className="guestPickerOption">
            <span>מבוגרים</span>
            <button onClick={() => setNumOfAdults(Math.max(1, numOfAdults - 1))}>-</button>
            <span>{numOfAdults}</span>
            <button onClick={() => setNumOfAdults(numOfAdults + 1)}>+</button>
          </div>
          <div className="guestPickerOption">
            <span>ילדים</span>
            <button onClick={() => setNumOfChildren(Math.max(0, numOfChildren - 1))}>-</button>
            <span>{numOfChildren}</span>
            <button onClick={() => setNumOfChildren(numOfChildren + 1)}>+</button>
          </div>
          <div className="guestPickerOption">
            <span>חדרים</span>
            <button onClick={() => setNumOfRooms(Math.max(1, numOfRooms - 1))}>-</button>
            <span>{numOfRooms}</span>
            <button onClick={() => setNumOfRooms(numOfRooms + 1)}>+</button>
          </div>
          <button className="guestPickerDone" onClick={() => setOpen(false)}>סיום</button>
        </div>
      )}
    </div>
  );
};

const Destinations = () => {
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numOfAdults, setNumOfAdults] = useState(1);
  const [numOfChildren, setNumOfChildren] = useState(0);
  const [numOfRooms, setNumOfRooms] = useState(1);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseHotel, setResponseHotel] = useState(null);
  const [errorHotel, setErrorHotel] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearchClick = () => {
    const payload = {
      hotel_name: hotelName,
      checkin_date: format(startDate, 'yyyy-MM-dd'),
      checkout_date: format(endDate, 'yyyy-MM-dd'),
      adults: numOfAdults,
      no_rooms: numOfRooms,
      children: numOfChildren,
      user_id: '' // בהנחה ש user_id אינו חובה או מטופל במקום אחר
    };

    handleSearch(payload, setLoading, setError, setResponse);
    getHotel(hotelName, setResponseHotel, setErrorHotel);
  };

  return (
    <div className='destination section container'>
      <div className='secContainer'>
        <div className='secTitle'>
          <span className='redText'>גלה עכשיו</span>
          <h3>מצא את היעד החלומי שלך</h3>
          <p>מלא את השדות למטה כדי למצוא את המלון הטוב ביותר לטיול הבא שלך.</p>
        </div>
        
        <div className='searchField grid'>
          <div className="inputFiled flex">
            <FaHotel className='icon' />
            <input
              type="text"
              placeholder='שם המלון'
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="inputFiled flex">
            <MdAlternateEmail className='icon' />
            <input
              type="email"
              placeholder='אימייל'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <DateRangeComp className="DataRange" onDateChange={handleDateChange} />

          <GuestPicker 
            numOfAdults={numOfAdults} 
            setNumOfAdults={setNumOfAdults}
            numOfChildren={numOfChildren} 
            setNumOfChildren={setNumOfChildren}
            numOfRooms={numOfRooms} 
            setNumOfRooms={setNumOfRooms}
          />

          <button className='btn flex' disabled={loading} onClick={handleSearchClick}>
            <BiSearchAlt className='icon' />
            {loading ? 'מחפש...' : 'חיפוש'}
          </button>
        </div>
        {loading ? (
            <ReactLoading type='bars' className='Loading' />
          ) : null}
          
          {response && responseHotel && (
            <div style={{ marginTop: '20px' }}>
              
              <div className='resultsection'>
                <Results
                  response={response}   
                  responseHotel={responseHotel}      
                />
              </div>
            </div>
          )}
          {(error || errorHotel) && (
            <div style={{ marginTop: '20px', color: 'red' }}>
              <h3>שגיאה:</h3>
              <p>{error || errorHotel}</p>
            </div>
          )}
      </div>  
    </div>
  );
}

export default Destinations;
