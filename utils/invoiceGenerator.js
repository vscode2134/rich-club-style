/**
 * Invoice Number Generator Utility
 * Generates unique invoice numbers for orders
 */

/**
 * Generate a unique invoice number
 * Format: INV-YYYYMMDD-XXXXX
 * Example: INV-20260103-00001
 * 
 * @returns {string} Unique invoice number
 */
const generateInvoiceNumber = () => {
    const date = new Date();

    // Format: YYYYMMDD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Generate random 5-digit number
    const randomNum = Math.floor(10000 + Math.random() * 90000);

    return `INV-${dateStr}-${randomNum}`;
};

/**
 * Generate invoice number with database check
 * Ensures uniqueness by checking against existing orders
 * 
 * @param {Model} OrderModel - Mongoose Order model
 * @returns {Promise<string>} Unique invoice number
 */
const generateUniqueInvoiceNumber = async (OrderModel) => {
    let invoiceNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        invoiceNumber = generateInvoiceNumber();

        // Check if invoice number already exists
        const existingOrder = await OrderModel.findOne({ invoiceNumber });

        if (!existingOrder) {
            isUnique = true;
        }

        attempts++;
    }

    if (!isUnique) {
        throw new Error('Failed to generate unique invoice number after multiple attempts');
    }

    return invoiceNumber;
};

module.exports = {
    generateInvoiceNumber,
    generateUniqueInvoiceNumber
};
