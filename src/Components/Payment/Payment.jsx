import React from 'react';
import './Payment.scss';

const Payment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="btn" onClick={onClose}>×</button>
        <h2>Complete Your Purchase</h2>
        <form>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="Enter your card number" />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input type="text" placeholder="MM/YY" />
          </div>
          <div className="form-group">
            <label>CVC</label>
            <input type="text" placeholder="CVC" />
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input type="text" placeholder="Name on card" />
          </div>
          <button type="submit" className="submit-button">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
