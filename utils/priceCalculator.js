/**
 * Price Calculation Utility
 * Reusable helpers for calculating order totals, discounts, and taxes
 */

/**
 * Calculate subtotal from order items
 * @param {Array} items - Array of order items with price and quantity
 * @returns {number} Subtotal amount
 */
const calculateSubtotal = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return 0;
    }

    return items.reduce((total, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        return total + itemTotal;
    }, 0);
};

/**
 * Calculate discount amount based on coupon
 * @param {number} subtotal - Subtotal amount
 * @param {Object} coupon - Coupon object with discountType and discountValue
 * @returns {number} Discount amount
 */
const calculateDiscount = (subtotal, coupon) => {
    if (!coupon || subtotal <= 0) {
        return 0;
    }

    const { discountType, discountValue } = coupon;

    if (discountType === 'percentage') {
        const discount = (subtotal * discountValue) / 100;
        return Math.round(discount * 100) / 100; // Round to 2 decimal places
    }

    if (discountType === 'flat') {
        // Flat discount cannot exceed subtotal
        return Math.min(discountValue, subtotal);
    }

    return 0;
};

/**
 * Calculate final total amount
 * @param {number} subtotal - Subtotal amount
 * @param {number} discount - Discount amount
 * @returns {number} Final total amount
 */
const calculateTotal = (subtotal, discount = 0) => {
    const total = subtotal - discount;
    return Math.max(0, Math.round(total * 100) / 100); // Ensure non-negative and round to 2 decimals
};

/**
 * Calculate complete order pricing
 * @param {Array} items - Array of order items
 * @param {Object} coupon - Optional coupon object
 * @returns {Object} Object with subtotal, discount, and totalAmount
 */
const calculateOrderPricing = (items, coupon = null) => {
    const subtotal = calculateSubtotal(items);
    const discount = calculateDiscount(subtotal, coupon);
    const totalAmount = calculateTotal(subtotal, discount);

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100
    };
};

/**
 * Validate item pricing
 * Ensures item prices match product prices (security check)
 * @param {Array} items - Order items with productId and price
 * @param {Model} ProductModel - Mongoose Product model
 * @returns {Promise<boolean>} True if all prices are valid
 */
const validateItemPrices = async (items, ProductModel) => {
    for (const item of items) {
        const product = await ProductModel.findById(item.productId);

        if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
        }

        // Check if price matches (allow small floating point differences)
        if (Math.abs(product.price - item.price) > 0.01) {
            throw new Error(`Price mismatch for product: ${product.name}`);
        }
    }

    return true;
};

module.exports = {
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
    calculateOrderPricing,
    validateItemPrices
};
