const Product = require('../models/Product');

/**
 * Product Controller
 * Handles all product-related operations
 */

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Admin (no auth implemented yet)
 */
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, sizes, images } = req.body;

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, price, and category'
            });
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            sizes: sizes || { S: 0, M: 0, L: 0, XL: 0 },
            images: images || [],
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
    try {
        const { category, isActive, search } = req.query;

        // Build query
        const query = {};

        if (category) {
            query.category = category;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Text search if provided
        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Admin
 */
const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, sizes, images, isActive } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update fields
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (sizes !== undefined) product.sizes = sizes;
        if (images !== undefined) product.images = images;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product (soft delete - set isActive to false)
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check stock availability for a specific size
 * @route   GET /api/products/:id/stock/:size
 * @access  Public
 */
const checkStock = async (req, res, next) => {
    try {
        const { id, size } = req.params;
        const { quantity } = req.query;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const availableStock = product.sizes[size] || 0;
        const requestedQty = parseInt(quantity) || 1;

        res.status(200).json({
            success: true,
            data: {
                productName: product.name,
                size,
                availableStock,
                requestedQuantity: requestedQty,
                isAvailable: availableStock >= requestedQty
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    checkStock
};
