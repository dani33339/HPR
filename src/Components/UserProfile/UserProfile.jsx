import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserProfile.scss';
import SearchHistory from '../SearchHistory/SearchHistory';

const UserProfile = ({ onClose }) => {
  const { user, isAuthenticated } = useAuth0();
  const [searches, setSearches] = useState([]);

  const fetchUserSearches = async () => {
    try {
      const response = await axios.get(`${process.env.SERVER_URL}/deals?user_id=${encodeURIComponent(user.sub)}&user_role=${user["/roles"][0]}`);
      const data = response.data;
      const formattedData = Object.keys(data).map(key => {
        return {
          key,
          google_deals: data[key].google_deals,
          hotel_data: data[key].hotel_data,
          momondo_deals: data[key].momondo_deals,
          skyscanner_deals: data[key].skyscanner_deals,
          trivago_deals: data[key].trivago_deals,
          ts: data[key].skyscanner_deals.length > 0 ? data[key].skyscanner_deals[0].ts : new Date().toISOString() // assuming ts is in skyscanner_deals
        };
      });
      setSearches(formattedData);
    } catch (error) {
      console.error('Error fetching user searches:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSearches();
    }
  }, [isAuthenticated]);

  return (
    <div className="user-profile">
      {isAuthenticated ? (
        <div className="profile-details">
          <img src={user.picture} alt="Profile" className="profile-picture" />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          {user["/roles"] && user["/roles"].length > 0 && (
            <p>Your membership: {user["/roles"][0]}</p>
          )}
          <SearchHistory searches={searches} />
        </div>
      ) : (
        <p>Please log in to see your profile</p>
      )}
    </div>
  );
};

export default UserProfile;
