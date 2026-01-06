const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Authentication Routes
 * Handles admin login and authentication
 */

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged-in admin details
// @access  Private (Admin only)
router.get('/me', verifyJWT, isAdmin, getMe);

module.exports = router;
