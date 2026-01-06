const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');

/**
 * Payment Controller
 * Handles Razorpay payment creation and verification
 */

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Public
 */
const createRazorpayOrder = async (req, res, next) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.status(503).json({
                success: false,
                message: 'Razorpay payment gateway is not configured. Please use COD payment method.'
            });
        }

        const { orderId } = req.body;

        // Validate input
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide orderId'
            });
        }

        // Find the internal order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order already has a Razorpay order ID (prevent duplicate payment)
        if (order.razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: 'Payment already initiated for this order',
                razorpayOrderId: order.razorpayOrderId
            });
        }

        // Check if payment is already completed
        if (order.paymentStatus === 'PAID') {
            return res.status(400).json({
                success: false,
                message: 'Order is already paid'
            });
        }

        // Check if order is cancelled
        if (order.orderStatus === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot process payment for cancelled order'
            });
        }

        // Use server-calculated amount ONLY (never trust frontend)
        const amount = Math.round(order.totalAmount * 100); // Convert to paise (smallest currency unit)

        // Create Razorpay order options
        const options = {
            amount: amount, // Amount in paise
            currency: 'INR',
            receipt: order.invoiceNumber,
            notes: {
                orderId: order._id.toString(),
                invoiceNumber: order.invoiceNumber,
                customerName: order.customer.name,
                customerPhone: order.customer.phone
            }
        };

        // Create Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Update internal order with Razorpay order ID
        order.razorpayOrderId = razorpayOrder.id;
        order.paymentMethod = 'RAZORPAY';
        await order.save();

        // Return Razorpay order details to frontend
        res.status(200).json({
            success: true,
            message: 'Razorpay order created successfully',
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderId: order._id,
                invoiceNumber: order.invoiceNumber,
                // Send key_id to frontend for Razorpay checkout
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        next(error);
    }
};

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify
 * @access  Public
 */
const verifyPayment = async (req, res, next) => {
    try {
        const {
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        // Validate input
        if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required payment details'
            });
        }

        // Find the internal order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify that the Razorpay order ID matches
        if (order.razorpayOrderId !== razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay order ID mismatch'
            });
        }

        // Check if payment is already verified
        if (order.paymentStatus === 'PAID' && order.razorpayPaymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment already verified for this order'
            });
        }

        // Verify Razorpay signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            // Signature verification failed - mark payment as failed
            order.paymentStatus = 'FAILED';
            order.razorpayPaymentId = razorpayPaymentId;
            order.razorpaySignature = razorpaySignature;
            await order.save();

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed. Invalid signature.'
            });
        }

        // Signature verified successfully - update order
        order.paymentStatus = 'PAID';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: order._id,
                invoiceNumber: order.invoiceNumber,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        next(error);
    }
};

/**
 * @desc    Get Razorpay key for frontend
 * @route   GET /api/payments/razorpay-key
 * @access  Public
 */
const getRazorpayKey = async (req, res, next) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay is not configured'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey
};
