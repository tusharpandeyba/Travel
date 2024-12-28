import React, { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [peopleCounts, setPeopleCounts] = useState({});

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips');
        if (!response.ok) throw new Error('Error fetching trips');
        const data = await response.json();
        setTrips(data);

        const initialCounts = data.reduce((acc, trip) => {
          acc[trip._id] = 1;
          return acc;
        }, {});
        setPeopleCounts(initialCounts);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleUserDashboard = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/userDetails';
    } else {
      window.location.href = '/login';
    }
  };

  const handleAddToCart = async (trip) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      alert('Please log in to add items to the cart');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tripId: trip._id, quantity: peopleCounts[trip._id] }),
      });

      if (!response.ok) {
        throw new Error('Failed to add trip to cart');
      }

      alert(`${trip.name} has been added to your cart for ${peopleCounts[trip._id]} people!`);
    } catch (error) {
      alert('Error adding trip to cart');
    }
  };

  const handleGoToCart = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('Please log in to view the cart');
      window.location.href = '/login';
    } else {
      window.location.href = '/cart';
    }
  };

  const handlePeopleCountChange = (tripId, count) => {
    setPeopleCounts((prevCounts) => ({
      ...prevCounts,
      [tripId]: Math.max(1, parseInt(count, 10) || 1),
    }));
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Our Trips</h1>
        <div className="header-buttons">
          <button className="cart-button" onClick={handleGoToCart}>
            Go to Cart
          </button>
          <button className="menu-button" onClick={handleUserDashboard}>
            ☰
          </button>
        </div>
      </header>

      <main className="landing-main">
        <h2 className="section-title">Upcoming Trips</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading trips...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : trips.length > 0 ? (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip._id} className="trip-card">
                <h3 className="trip-title">{trip.name}</h3>
                <div className="trip-details">
                <p className="trip-description">
                  {trip.description.split(' ').slice(0, 45).join(' ')}{trip.description.split(' ').length > 45 ? '...' : ''}
                </p>

                  <p className="trip-date">
                    <span>Start Date:</span> {new Date(trip.dates?.start).toLocaleDateString()}
                  </p>
                  <p className="trip-price">
                    <span>Price:</span> ₹{trip.price}
                  </p>
                </div>
                <div className="trip-actions">
                <div className="people-counter">
                  <label>Number of People:</label>
                  <button
                    type="button"
                    onClick={() => handlePeopleCountChange(trip._id, (peopleCounts[trip._id] || 1) - 1)}
                    disabled={peopleCounts[trip._id] <= 1}
                  >
                    -
                  </button>
                  <span>{peopleCounts[trip._id] || 1}</span>
                  <button
                    type="button"
                    onClick={() => handlePeopleCountChange(trip._id, (peopleCounts[trip._id] || 1) + 1)}
                  >
                    +
                  </button>
                </div>


                  <button 
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(trip)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-trips">No trips available.</p>
        )}
      </main>
    </div>
  );
};

export default LandingPage;