const Payment = require('../models/Payment');

// Create a payment
exports.createPayment = async (req, res) => {
  try {
    const { userId, tripId, amount, paymentMethod } = req.body;

    // Validate input
    if (!userId || !tripId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const payment = new Payment({ userId, tripId, amount, paymentMethod });
    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payments for a user
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
