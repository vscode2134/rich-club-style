const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Coupon Routes
 * All routes for coupon management
 */

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Admin
router.post('/', verifyJWT, isAdmin, createCoupon);

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Admin
router.get('/', verifyJWT, isAdmin, getAllCoupons);

// @route   POST /api/coupons/validate
// @desc    Validate a coupon code
// @access  Public
router.post('/validate', validateCoupon);

// @route   PUT /api/coupons/:id
// @desc    Update coupon
// @access  Admin
router.put('/:id', verifyJWT, isAdmin, updateCoupon);

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon
// @access  Admin
router.delete('/:id', verifyJWT, isAdmin, deleteCoupon);

module.exports = router;
