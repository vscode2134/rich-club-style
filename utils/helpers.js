/**
 * Utility Functions
 * Common helper functions used across the application
 */

/**
 * Generate a random string
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Paginate results
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} Skip and limit values for MongoDB
 */
const getPagination = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
};

module.exports = {
    generateRandomString,
    formatCurrency,
    getPagination
};
