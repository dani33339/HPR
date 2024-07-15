import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Pricing.scss';
import Payment from '../Payment/Payment';

const Pricing = () => {
  const { isAuthenticated } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pricing section container">
      <h1 className="pricing-title">Pricing</h1>
      <div className="pricing-cards">
        {!isAuthenticated && (
          <div className="pricing-card">
            <h2 className="card-title">Regular</h2>
            <p className="card-subtitle">For regular travelers</p>
            <p className="card-price">$0/mo</p>
            <button className="card-button">Sign up</button>
            <ul className="card-features">
              <li>Unlimited search queries</li>
              <li>Limited to one search engine</li>
            </ul>
          </div>
        )}
        <div className="pricing-card">
          <h2 className="card-title">Vip</h2>
          <p className="card-subtitle">For frequent travelers who want the best price</p>
          <p className="card-price">$5/mo</p>
          <button className="card-button" onClick={openModal}>Buy now</button>
          <p className="card-trial">Or start a <a href="#">14-day free trial</a></p>
          <p className="card-features-title">Everything in Essentials, plus:</p>
          <ul className="card-features">
            <li>Access to 5 search engines</li>
            <li>Unlimited search queries</li>
          </ul>
        </div>
      </div>
      <Payment isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Pricing;
