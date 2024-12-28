const express = require('express');
const router = express.Router();
const tripController = require('../controller/tripController');

// Get all trips
router.get('/', tripController.getAllTrips);

// Get trip details by ID
router.get('/:tripId', tripController.getTripDetails);

// Add a new trip (only accessible by organizers)
router.post('/', tripController.addTrip);

// Edit an existing trip
router.put('/:tripId', tripController.updateTrip);

// Delete a trip
router.delete('/:tripId', tripController.deleteTrip);

module.exports = router;
