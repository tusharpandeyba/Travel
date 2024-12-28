import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false); // Add state for popup
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, userId } = location.state || {};
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const bookingDetails = safeCartItems.map(item => ({
        tripId: item.tripId._id,
        quantity: item.quantity,
      }));

      for (const trip of bookingDetails) {
        const response = await fetch(`http://localhost:5000/api/bookings/${userId}/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trip),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Booking successful!');
          setShowBookingPopup(true);  // Show the confirmation popup
          setTimeout(() => setShowBookingPopup(false), 3000);  // Hide the popup after 3 seconds
        } else {
          setMessage(data.message || 'Booking failed');
        }
      }

      navigate(`/userDetails`);
    } catch (error) {
      setMessage(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return safeCartItems.reduce((total, item) => 
      total + item.tripId.price * item.quantity, 0
    );
  };

  // Handle the back button click
  const handleBack = () => {
    navigate(-1);  // This will navigate back to the previous page
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Payment Page</h1>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>Back</button>

      {message && <div className="payment-message">{message}</div>}

      {/* Booking Confirmation Popup */}
      {showBookingPopup && (
        <div className="side-popup">
          <p>Booking Confirmed!</p>
        </div>
      )}

      <div className="cart-summary">
        <h2>Cart Items</h2>
        {safeCartItems.length > 0 ? (
          <>
            <ul className="cart-items-list">
              {safeCartItems.map(item => (
                <li key={item.tripId._id} className="cart-item">
                  <span>{item.tripId.name}</span>
                  <span>{item.quantity} x ₹{item.tripId.price}</span>
                </li>
              ))}
            </ul>
            <div className="total-amount">
              Total: ₹{calculateTotal()}
            </div>
          </>
        ) : (
          <div className="empty-cart-message">No items in your cart.</div>
        )}
      </div>

      <button 
        className="payment-button" 
        onClick={handlePayment} 
        disabled={loading || safeCartItems.length === 0}
      >
        {loading ? 'Processing Payment...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default PaymentPage;
