const Coupon = require('../models/Coupon');

/**
 * Coupon Controller
 * Handles coupon creation and validation
 */

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Admin
 */
const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, expiryDate, isActive } = req.body;

        // Validate required fields
        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide code, discountType, discountValue, and expiryDate'
            });
        }

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        // Create coupon
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            expiryDate,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Admin
 */
const getAllCoupons = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const coupons = await Coupon.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Validate and get coupon details
 * @route   POST /api/coupons/validate
 * @access  Public
 */
const validateCoupon = async (req, res, next) => {
    try {
        const { code, subtotal } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Please provide coupon code'
            });
        }

        // Find coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Check if coupon is valid
        if (!coupon.isValid()) {
            const reason = !coupon.isActive ? 'Coupon is inactive' : 'Coupon has expired';
            return res.status(400).json({
                success: false,
                message: reason
            });
        }

        // Calculate discount if subtotal provided
        let discountAmount = 0;
        if (subtotal) {
            discountAmount = coupon.calculateDiscount(subtotal);
        }

        res.status(200).json({
            success: true,
            message: 'Coupon is valid',
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount,
                expiryDate: coupon.expiryDate
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update coupon
 * @route   PUT /api/coupons/:id
 * @access  Admin
 */
const updateCoupon = async (req, res, next) => {
    try {
        const { discountType, discountValue, expiryDate, isActive } = req.body;

        let coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Update fields (code cannot be updated)
        if (discountType !== undefined) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = discountValue;
        if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Admin
 */
const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon
};
