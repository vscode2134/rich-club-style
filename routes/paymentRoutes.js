const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey
} = require('../controllers/paymentController');

/**
 * Payment Routes
 * Handles Razorpay payment processing
 * All routes are PUBLIC (no authentication required)
 */

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Public
router.post('/create-order', createRazorpayOrder);

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Public
router.post('/verify', verifyPayment);

// @route   GET /api/payments/razorpay-key
// @desc    Get Razorpay key for frontend
// @access  Public
router.get('/razorpay-key', getRazorpayKey);

module.exports = router;
