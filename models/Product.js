const mongoose = require('mongoose');

/**
 * Product Model
 * Enhanced schema for clothing eCommerce with size-based inventory
 */
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
            min: [0.01, 'Price must be greater than 0'],
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: 'Price must be greater than 0'
            }
        },
        category: {
            type: String,
            required: [true, 'Please provide a product category'],
            enum: {
                values: ['men', 'women', 'kids', 'accessories', 'footwear', 'other'],
                message: '{VALUE} is not a valid category'
            }
        },
        // Size-based inventory for clothing
        sizes: {
            S: {
                type: Number,
                default: 0,
                min: [0, 'Stock cannot be negative'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Stock must be a whole number'
                }
            },
            M: {
                type: Number,
                default: 0,
                min: [0, 'Stock cannot be negative'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Stock must be a whole number'
                }
            },
            L: {
                type: Number,
                default: 0,
                min: [0, 'Stock cannot be negative'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Stock must be a whole number'
                }
            },
            XL: {
                type: Number,
                default: 0,
                min: [0, 'Stock cannot be negative'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Stock must be a whole number'
                }
            },
            XXL: {
                type: Number,
                default: 0,
                min: [0, 'Stock cannot be negative'],
                validate: {
                    validator: Number.isInteger,
                    message: 'Stock must be a whole number'
                }
            }
        },
        images: [{
            type: String,
            validate: {
                validator: function (url) {
                    // Basic URL validation
                    return /^https?:\/\/.+/.test(url) || url.startsWith('/');
                },
                message: 'Please provide a valid image URL'
            }
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt
    }
);

// Virtual field to calculate total stock across all sizes
productSchema.virtual('totalStock').get(function () {
    return (this.sizes?.S || 0) + (this.sizes?.M || 0) +
        (this.sizes?.L || 0) + (this.sizes?.XL || 0) + (this.sizes?.XXL || 0);
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
