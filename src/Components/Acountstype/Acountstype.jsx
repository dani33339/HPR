import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Acountstype.scss';
import Payment from '../Payment/Payment';
import LoginButton from '../Login/Login.jsx';

const Acountstype = () => {
  const { user, isAuthenticated } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const userIsVip = isAuthenticated && user["/roles"] && user["/roles"].includes("vip");

  return (
    <div className="pricing section container" >
       {!userIsVip && (  
       <h1 className="pricing-title">Pricing</h1>
       )}
      <div className="pricing-cards" data-aos="fade-up">
        {!isAuthenticated && (        
          <div className="pricing-card"> 
            <h2 className="card-title">Regular</h2>
            <p className="card-subtitle">For regular travelers</p>
            <p className="card-price">$0/mo</p>          
             <LoginButton />
            <ul className="card-features">
              <li>Unlimited search queries</li>
              <li>Limited to one search engine</li>
            </ul>
          </div>
        )}
        {!userIsVip && (
          <div className="pricing-card">
            <h2 className="card-title">Vip</h2>
            <p className="card-subtitle">For frequent travelers who want the best price</p>
            <p className="card-price">$5/mo</p>
            <button className="card-button" onClick={openModal}>Buy now</button>
            <ul className="card-features">
              <li>Access to 3 search engines</li>
              <li>Unlimited search queries</li>
            </ul>
          </div>
        )}
      </div>
      <Payment isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Acountstype;
