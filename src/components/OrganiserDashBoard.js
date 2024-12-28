import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganiserDashboard.css'; // Import the CSS file for the popup styling

const OrganiserDashboard = ({ userId }) => {
  const [trips, setTrips] = useState([]);
  const [tripData, setTripData] = useState({
    name: '',
    description: '',
    dates: { start: '', end: '' },
    price: '',
    slots: '',
    organizerId: userId, // Ensure the organizerId is set from the userId prop
  });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for controlling the popup visibility
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields like `dates`
    if (name === 'start' || name === 'end') {
      setTripData({
        ...tripData,
        dates: { ...tripData.dates, [name]: value },
      });
    } else {
      setTripData({ ...tripData, [name]: value });
    }
  };

  // Handle form submission
  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add trip');
      }
  
      const data = await response.json();
  
      // Set success flag in sessionStorage
      sessionStorage.setItem('tripAdded', 'true');
  
      setTrips([...trips, data.trip]); // Add the new trip to the trips list
  
      // Reset form fields, keeping the organizerId intact
      setTripData({
        name: '',
        description: '',
        dates: { start: '', end: '' },
        price: '',
        slots: '',
        organizerId: userId,
      });
  
      // Navigate after success
      navigate('/userDetails');
  
    } catch (error) {
      setMessage(error.message || 'Failed to add trip');
    }
  };
  

  return (
    <div className="organiser-container">
      <div className="dashboard-header">
        <h1>Organiser Dashboard</h1>
      </div>

      {message && <div className="message">{message}</div>}

      <form className="trip-form" onSubmit={handleAddTrip}>
        <h2>Add a New Trip</h2>
        
        <div className="form-group">
          <label htmlFor="name">Trip Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter trip name"
            value={tripData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Trip Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter trip description"
            value={tripData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start">Start Date</label>
            <input
              id="start"
              type="date"
              name="start"
              value={tripData.dates.start}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end">End Date</label>
            <input
              id="end"
              type="date"
              name="end"
              value={tripData.dates.end}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter price"
              value={tripData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slots">Available Slots</label>
            <input
              id="slots"
              type="number"
              name="slots"
              placeholder="Enter available slots"
              value={tripData.slots}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Add Trip
        </button>
      </form>

      {showPopup && (
        <div className="side-popup">
          <p>Trip Added Successfully!</p>
        </div>
      )}
    </div>
  );
};


export default OrganiserDashboard;
