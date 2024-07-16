import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [searches, setSearches] = useState([]);

  const fetchUserSearches = async () => {
    try {
      const response = await axios.get(`${process.env.SERVER_URL}/deals?user_id=${encodeURIComponent(user.sub)}`);
      const flattenedSearches = response.data.flat();
      setSearches(flattenedSearches);
    } catch (error) {
      console.error('Error fetching user searches:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSearches();
    }
  }, []);

  return (
    <div className="user-profile">
      {console.log(user)}
      {isAuthenticated ? (
        <div className="profile-details">
          <img src={user.picture} alt="Profile" className="profile-picture" />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          {user["/roles"] && user["/roles"].length > 0 && (
            <p>Your membership: {user["/roles"][0]}</p>
          )}

          <h3>Your Searches</h3>
          <ul className="search-list">
            {Array.isArray(searches) && searches.length > 0 ? (
              searches.map((search, index) => (
                <li key={index}>
                  <strong>Channel:</strong> {search.channel} <br />
                  <strong>Partner:</strong> {search.partner} <br />
                  <strong>Price:</strong> {search.price} <br />
                  <strong>Date:</strong> {new Date(search.ts).toLocaleString()} <br />
                  <strong>URL:</strong> <a href={search.url} target="_blank" rel="noopener noreferrer">Link</a>
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
