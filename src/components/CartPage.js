import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/cart`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      setCartItems((prevItems) => prevItems.filter((item) => item.tripId._id !== itemId));
      setMessage('Item removed from cart');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.tripId.price || 0) * (item.quantity || 0),
      0
    );
  };

  const goToPaymentPage = () => {
    navigate('/payment', { state: { userId, cartItems } });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className='cart-container'>
      <div className="cart-content">
      <div className="cart-header">
        <button className="back-button" onClick={goBack}>
          Back
        </button>
        <h1 className="page-title">Your Cart</h1>
        <div className="header-spacer"></div> {/* This helps with centering the title */}
      </div>

      {message && <div className="cart-message">{message}</div>}
      
      {loading ? (
        <div className="loading-message">Loading cart...</div>
      ) : cartItems.length > 0 ? (
        <div className="cart-content">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Trip</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.tripId._id}>
                  <td>{item.tripId.name}</td>
                  <td>${item.tripId.price}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.tripId.price || 0) * (item.quantity || 0)}</td>
                  <td>
                    <button 
                      className="remove-button" 
                      onClick={() => handleRemoveItem(item.tripId._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-footer">
            <div className="cart-total">
              Total: ${calculateTotal()}
            </div>
            <button className="checkout-button" onClick={goToPaymentPage}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message">Your cart is empty.</div>
      )}
    </div>
    </div>
  );
};

export default CartPage;