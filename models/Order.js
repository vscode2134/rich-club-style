const mongoose = require('mongoose');

/**
 * Order Model
 * Manages customer orders with invoice generation and payment tracking
 */
const orderSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },
        customer: {
            name: {
                type: String,
                required: [true, 'Customer name is required'],
                trim: true,
                maxlength: [100, 'Name cannot exceed 100 characters']
            },
            phone: {
                type: String,
                required: [true, 'Customer phone is required'],
                validate: {
                    validator: function (phone) {
                        // Indian phone number validation (10 digits)
                        return /^[6-9]\d{9}$/.test(phone);
                    },
                    message: 'Please provide a valid 10-digit phone number'
                }
            },
            address: {
                type: String,
                required: [true, 'Customer address is required'],
                trim: true,
                maxlength: [500, 'Address cannot exceed 500 characters']
            }
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            size: {
                type: String,
                required: [true, 'Size is required'],
                enum: {
                    values: ['S', 'M', 'L', 'XL', 'XXL'],
                    message: '{VALUE} is not a valid size'
                }
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Quantity must be a whole number'
                }
            },
            price: {
                type: Number,
                required: [true, 'Price is required'],
                min: [0.01, 'Price must be greater than 0']
            }
        }],
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
            min: [0, 'Subtotal cannot be negative']
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative']
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total amount cannot be negative'],
            validate: {
                validator: function (value) {
                    // Total should equal subtotal - discount
                    return Math.abs(value - (this.subtotal - this.discount)) < 0.01;
                },
                message: 'Total amount must equal subtotal minus discount'
            }
        },
        couponCode: {
            type: String,
            uppercase: true,
            trim: true
        },
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required'],
            enum: {
                values: ['RAZORPAY'],
                message: 'Payment method must be RAZORPAY'
            },
            default: 'RAZORPAY'
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: {
                values: ['PENDING', 'PAID', 'FAILED'],
                message: '{VALUE} is not a valid payment status'
            },
            default: 'PENDING'
        },
        orderStatus: {
            type: String,
            required: true,
            enum: {
                values: ['PLACED', 'CANCELLED'],
                message: '{VALUE} is not a valid order status'
            },
            default: 'PLACED'
        },
        // Razorpay payment tracking fields
        razorpayOrderId: {
            type: String,
            trim: true
        },
        razorpayPaymentId: {
            type: String,
            trim: true
        },
        razorpaySignature: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt
    }
);

// Pre-save hook to validate items array
orderSchema.pre('save', function (next) {
    if (!this.items || this.items.length === 0) {
        return next(new Error('Order must contain at least one item'));
    }
    next();
});

// Add indexes for better query performance
orderSchema.index({ invoiceNumber: 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 }); // For sorting by date

module.exports = mongoose.model('Order', orderSchema);
