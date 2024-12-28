const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

// Book a trip
const bookTrip = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tripId, quantity } = req.body;

    const user = await User.findById(userId);
    const trip = await Trip.findById(tripId);

    if (!user || !trip) return res.status(404).json({ message: 'User or Trip not found' });

    // Check availability
    if (trip.availableSlots < quantity) {
      return res.status(400).json({ message: 'Not enough slots available' });
    }

    // Create booking
    const booking = new Booking({ userId, tripId, quantity, price: trip.price * quantity });
    await booking.save();

    // Update trip available slots
    trip.availableSlots -= quantity;
    await trip.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a user
const getBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).populate('tripId');
    if (!bookings) return res.status(404).json({ message: 'No bookings found' });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { userId, bookingId} = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const trip = await Trip.findById(booking.tripId);

    // Refund logic based on the booking date and trip date (simplified)
    const refund = calculateRefund(booking, trip);

    // Update the trip's available slots
    trip.availableSlots += booking.quantity;
    await trip.save();

    await booking.delete();

    res.status(200).json({ message: `Booking cancelled. Refund: ${refund}%` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refund calculation (simplified)
const calculateRefund = (booking, trip) => {
  const today = new Date();
  const tripDate = new Date(trip.dates.start); // Assuming start date
  const daysBeforeTrip = Math.floor((tripDate - today) / (1000 * 60 * 60 * 24));

  if (daysBeforeTrip >= 15) return 100; // Full refund
  if (daysBeforeTrip >= 7) return 50;  // 50% refund
  return 0;  // No refund
};

module.exports = { bookTrip, getBookings, cancelBooking };
