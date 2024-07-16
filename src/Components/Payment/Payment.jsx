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
        <button className="close-button" onClick={onClose}>×</button>
        
        <h3>Pay with PayPal</h3>
        
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
