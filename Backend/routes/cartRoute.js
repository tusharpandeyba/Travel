const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartHandler');

// Add a trip to the cart
router.post('/:userId/cart', cartController.addToCart);

// Get the cart for a user
router.get('/:userId/cart', cartController.getCart);

// Remove a trip from the cart
router.delete('/:userId/cart/:tripId', cartController.removeFromCart);

module.exports = router;
