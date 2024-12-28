// express intance
const express= require('express');
const cors = require('cors');
require("dotenv").config();
const PORT =process.env.PORT ||3000;



// Import Routes
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoute');

const app= express();
app.use(cors());
// parsing 
app.use(express.json());

// listen to port
const connectWithDb =require('./config/database');
connectWithDb();

// API Routes
app.use('/api/users', userRoutes);       // User-related routes
app.use('/api/trips', tripRoutes);       // Trip-related routes
app.use('/api/bookings', bookingRoutes); // Booking-related routes
app.use('/api/payments', paymentRoutes); // Payment-related routes
app.use('/api/cart', cartRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Travel Website API!');
});
  
  // Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});