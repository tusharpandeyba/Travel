const Trip = require('../models/Trip');

// Get all trips
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trip details by ID
const getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new trip
const addTrip = async (req, res) => {
  try {
    const { name, description, dates, price, slots, organizerId } = req.body;

    // Create a new Trip with the correct fields
    const trip = new Trip({
      name,
      description,
      dates,
      price,
      slots, 
      organizerId,  
    });

    await trip.save();
    res.status(201).json({ message: 'Trip added successfully', trip });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit an existing trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, { new: true });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    res.status(200).json({ message: 'Trip updated successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTrips, getTripDetails, addTrip, updateTrip, deleteTrip };
