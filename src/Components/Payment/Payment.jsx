import React from 'react';
import './Payment.scss';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Payment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert("Transaction completed by " + details.payer.name.given_name);
      onClose();
    });
  };

  const handleError = (err) => {
    console.error("PayPal Checkout Error:", err);
    alert("An error occurred during the transaction. Please try again.");
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

        <h3>Or pay with PayPal</h3>
        <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '0.01' // Update this value with the actual amount
                  }
                }]
              });
            }}
            onApprove={handleApprove}
            onError={handleError}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Payment;
