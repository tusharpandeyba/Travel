const User = require('../models/User');
const Trip = require('../models/Trip');

// Add a trip to the cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tripId, quantity } = req.body;

    // Validate if the trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Find the user and add the trip to the cart
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the trip is already in the cart
    const existingTripIndex = user.cart.findIndex(item => item.tripId.toString() === tripId);
    if (existingTripIndex >= 0) {
      // Update the quantity if the trip is already in the cart
      user.cart[existingTripIndex].quantity += quantity;
    } else {
      // Add the trip to the cart if it's not already there
      user.cart.push({ tripId, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get the cart for a user
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('cart.tripId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a trip from the cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, tripId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter out the trip from the cart
    user.cart = user.cart.filter(item => item.tripId.toString() !== tripId);
    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
