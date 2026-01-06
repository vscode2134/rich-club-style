const Razorpay = require('razorpay');

/**
 * Razorpay Configuration
 * Initialize Razorpay instance with credentials from environment
 */

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  Razorpay credentials not found in environment variables');
    console.warn('   Online payments will not work without RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
    console.warn('   COD payments will continue to work normally');

    // Export null if credentials not provided
    module.exports = null;
} else {
    // Initialize Razorpay instance only if credentials are available
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    console.log('✅ Razorpay configured successfully');
    module.exports = razorpayInstance;
}

