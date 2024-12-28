import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashBoard.css';

const UserDashboard = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();

        const tripsResponse = await fetch(`http://localhost:5000/api/bookings/${userId}/bookings`);
        if (!tripsResponse.ok) throw new Error('Failed to fetch booked trips');
        const tripsData = await tripsResponse.json();

        setUserDetails(userData);
        setBookedTrips(tripsData);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const tripAdded = sessionStorage.getItem('tripAdded');
    if (tripAdded === 'true') {
      setShowPopup(true);
      sessionStorage.removeItem('tripAdded');
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToLandingPage = () => {
    navigate('/');
  };

  const goToOrganizerDashboard = () => {
    navigate('/organiserDashBoard');
  };

  const goToCartPage = () => {
    navigate(`/cart`);
  };

  return (
    <div className='dashboard-container'>
      <div className="dashboard-content">
      <div className="dashboard-header">
        <button className="back-button" onClick={goToLandingPage}>
          Back
        </button>
        <h1>User Dashboard</h1>
        <button className="cart-button-header" onClick={goToCartPage}>
          Go to Cart
        </button>
      </div>

      {showPopup && (
        <div className="side-popup">
          <p>Trip Added Successfully!</p>
        </div>
      )}

      {message && <div className="error-message">{message}</div>}

      {loading ? (
        <div className="loading-message">Loading dashboard...</div>
      ) : (
        <div>
          {userDetails && (
            <div className="user-details">
              <h2>User Details</h2>
              <p className="user-info">
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p className="user-info">
                <strong>Email:</strong> {userDetails.email}
              </p>
              <div className="user-actions">
                <button className="organize-button" onClick={goToOrganizerDashboard}>
                  Organize a Trip
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}

          <div className="trips-section">
            <h2>Booked Trips</h2>
            {bookedTrips.length > 0 ? (
              bookedTrips.map((trip) => (
                <div key={trip._id} className="trip-card">
                  <h2>{trip?.tripId?.name}</h2>
                  <p className="trip-details">{trip?.tripId?.description}</p>
                  <p className="trip-details">
                    Dates:{' '}
                    {trip?.tripId?.dates?.start
                      ? new Date(trip?.tripId?.dates?.start).toLocaleDateString()
                      : 'N/A'}{' '}
                    -{' '}
                    {trip?.tripId?.dates?.end
                      ? new Date(trip?.tripId?.dates?.end).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="trip-details">Price: ₹{trip?.tripId?.price}</p>
                  <p className="trip-details">Slots Booked: {trip?.tripId?.slotsBooked}</p>
                </div>
              ))
            ) : (
              <p className="empty-cart-message">No booked trips found.</p>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UserDashboard;