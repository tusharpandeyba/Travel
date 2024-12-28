const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');

// Book a trip
router.post('/:userId/book', bookingController.bookTrip);

// Get all bookings for a user
router.get('/:userId/bookings', bookingController.getBookings);

// Cancel a booking
router.delete('/:userId/bookings/:bookingId', bookingController.cancelBooking);

module.exports = router;
