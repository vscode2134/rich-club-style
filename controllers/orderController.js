const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { generateUniqueInvoiceNumber } = require('../utils/invoiceGenerator');
const { calculateOrderPricing, validateItemPrices } = require('../utils/priceCalculator');

/**
 * Order Controller
 * Handles order creation and management
 */

/**
 * @desc    Create a new order (Online Payment)
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res, next) => {
    try {
        const { customer, items, couponCode, paymentMethod } = req.body;

        // Validate required fields
        if (!customer || !customer.name || !customer.phone || !customer.address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide complete customer details (name, phone, address)'
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        // Validate each item has required fields
        for (const item of items) {
            if (!item.productId || !item.size || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have productId, size, and quantity'
                });
            }
        }

        // Validate stock availability and populate item details
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Product is not available: ${product.name}`
                });
            }

            // Check stock for the specific size
            const availableStock = product.sizes[item.size] || 0;
            if (availableStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} (Size: ${item.size}). Available: ${availableStock}`
                });
            }

            // Add item with product details
            orderItems.push({
                productId: product._id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Validate coupon if provided
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (!coupon) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid coupon code'
                });
            }

            if (!coupon.isValid()) {
                const reason = !coupon.isActive ? 'Coupon is inactive' : 'Coupon has expired';
                return res.status(400).json({
                    success: false,
                    message: reason
                });
            }
        }

        // Calculate pricing server-side (NEVER trust client)
        const pricing = calculateOrderPricing(orderItems, coupon);

        // Generate unique invoice number
        const invoiceNumber = await generateUniqueInvoiceNumber(Order);

        // Create order
        const order = await Order.create({
            invoiceNumber,
            customer: {
                name: customer.name,
                phone: customer.phone,
                address: customer.address
            },
            items: orderItems,
            subtotal: pricing.subtotal,
            discount: pricing.discount,
            totalAmount: pricing.totalAmount,
            couponCode: couponCode ? couponCode.toUpperCase() : undefined,
            paymentMethod: paymentMethod || 'RAZORPAY',
            paymentStatus: 'PENDING',
            orderStatus: 'PLACED'
        });

        // Reduce stock for each item
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { [`sizes.${item.size}`]: -item.quantity } }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Admin
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus, startDate, endDate } = req.query;

        // Build query
        const query = {};

        if (orderStatus) {
            query.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const orders = await Order.find(query)
            .populate('items.productId', 'name category')
            .sort({ createdAt: -1 });

        // Calculate summary statistics
        const summary = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            placedOrders: orders.filter(o => o.orderStatus === 'PLACED').length,
            cancelledOrders: orders.filter(o => o.orderStatus === 'CANCELLED').length
        };

        res.status(200).json({
            success: true,
            count: orders.length,
            summary,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Admin / Customer (with invoice number)
 */
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'name category images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get order by invoice number
 * @route   GET /api/orders/invoice/:invoiceNumber
 * @access  Public (for order tracking)
 */
const getOrderByInvoice = async (req, res, next) => {
    try {
        const order = await Order.findOne({ invoiceNumber: req.params.invoiceNumber.toUpperCase() })
            .populate('items.productId', 'name category images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        if (orderStatus) {
            order.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Admin / Customer
 */
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.orderStatus === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled'
            });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { [`sizes.${item.size}`]: item.quantity } }
            );
        }

        order.orderStatus = 'CANCELLED';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get order details formatted for WhatsApp
 * @route   GET /api/orders/:id/whatsapp
 * @access  Admin
 */
const getOrderWhatsAppMessage = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const date = new Date(order.createdAt).toLocaleDateString('en-IN');

        let message = `━━━━ *RICH CLUB* ━━━━\n`;
        message += `*Invoice:* #${order.invoiceNumber}\n`;
        message += `*Date:* ${date}\n\n`;

        message += `*CUSTOMER DETAILS*\n`;
        message += `*Name:* ${order.customer.name}\n`;
        message += `*Phone:* ${order.customer.phone}\n`;
        message += `*Address:* ${order.customer.address}\n\n`;

        message += `*ORDER ITEMS*\n`;
        order.items.forEach(item => {
            message += `- ${item.name} (${item.size}) x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}\n`;
        });

        message += `\n*TOTAL AMOUNT:* ₹${order.totalAmount.toLocaleString()}\n`;
        message += `*PAYMENT:* ${order.paymentMethod} (${order.paymentStatus})\n`;
        message += `*ORDER STATUS:* ${order.orderStatus}\n`;
        message += `━━━━━━━━━━━━━━━━━`;

        res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get daily summary formatted for WhatsApp
 * @route   GET /api/admin/daily-summary/whatsapp
 * @access  Admin
 */
const getDailySummaryWhatsAppMessage = async (req, res, next) => {
    try {
        // Get today's range (start of day to now)
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));

        const orders = await Order.find({
            createdAt: { $gte: startOfDay }
        });

        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'PAID')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        // Fetch remaining stock overview
        const products = await Product.find({ isActive: true });
        const lowStockProducts = products.filter(p => p.totalStock < 5);

        let message = `━━━━ *RICH CLUB DAILY SUMMARY* ━━━━\n`;
        message += `*Date:* ${new Date().toLocaleDateString('en-IN')}\n\n`;

        message += `*METRICS*\n`;
        message += `*Total Orders Today:* ${totalOrders}\n`;
        message += `*Total Revenue (PAID):* ₹${totalRevenue.toLocaleString()}\n\n`;

        if (lowStockProducts.length > 0) {
            message += `*LOW STOCK ALERT*\n`;
            lowStockProducts.forEach(p => {
                message += `- ${p.name}: ${p.totalStock} left\n`;
            });
        } else {
            message += `*STOCK:* All good! ✅\n`;
        }

        message += `━━━━━━━━━━━━━━━━━━━━━━━`;

        res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrderByInvoice,
    updateOrderStatus,
    cancelOrder,
    getOrderWhatsAppMessage,
    getDailySummaryWhatsAppMessage
};
