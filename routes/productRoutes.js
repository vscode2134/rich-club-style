const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    checkStock
} = require('../controllers/productController');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Product Routes
 * All routes for product management
 */

// @route   POST /api/products
// @desc    Create a new product
// @access  Admin
router.post('/', verifyJWT, isAdmin, createProduct);

// @route   GET /api/products
// @desc    Get all products (with optional filters)
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put('/:id', verifyJWT, isAdmin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Admin
router.delete('/:id', verifyJWT, isAdmin, deleteProduct);

// @route   GET /api/products/:id/stock/:size
// @desc    Check stock availability for a size
// @access  Public
router.get('/:id/stock/:size', checkStock);

module.exports = router;
