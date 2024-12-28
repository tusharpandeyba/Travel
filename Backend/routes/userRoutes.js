const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Register a new user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Get user details
router.get('/:userId', userController.getUserDetails);

module.exports = router;
