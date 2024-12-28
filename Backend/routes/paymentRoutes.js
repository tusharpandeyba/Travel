const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentsByUser,
  getPaymentById,
  deletePayment,
} = require('../controller/paymentController');

// Create a payment
router.post('/', createPayment);

// Get all payments for a user
router.get('/user/:userId', getPaymentsByUser);

// Get payment by ID
router.get('/:paymentId', getPaymentById);

// Delete a payment
router.delete('/:paymentId', deletePayment);

module.exports = router;
