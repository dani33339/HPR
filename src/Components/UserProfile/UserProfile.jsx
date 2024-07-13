import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Replace with your API endpoint to get user searches
      const fetchUserSearches = async () => {
        try {
          const response = await axios.get(`/api/user-searches?userId=${user.sub}`);
          setSearches(response.data);
        } catch (error) {
          console.error('Error fetching user searches', error);
        }
      };

      fetchUserSearches();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="user-profile">
      {isAuthenticated ? (
        <div className="profile-details">
          <img src={user.picture} alt="Profile" className="profile-picture" />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          
          <h3>Your Searches</h3>
          <ul className="search-list">
            {Array.isArray(searches) && searches.length > 0 ? (
              searches.map((search, index) => (
                <li key={index}>
                  {search.query} - {search.date}
                </li>
              ))
            ) : (
              <p>No searches found</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Please log in to see your profile</p>
      )}
    </div>
  );
};

export default UserProfile;
