require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running smoothly',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/home-content', require('./routes/homeContentRoutes'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Rich Club eCommerce API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            health: '/api/health',
            products: '/api/products',
            coupons: '/api/coupons',
            orders: '/api/orders',
            payments: '/api/payments'
        },
        documentation: {
            auth: {
                login: 'POST /api/auth/login',
                getMe: 'GET /api/auth/me (Protected)'
            },
            products: {
                create: 'POST /api/products (Protected)',
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                update: 'PUT /api/products/:id (Protected)',
                delete: 'DELETE /api/products/:id (Protected)',
                checkStock: 'GET /api/products/:id/stock/:size'
            },
            coupons: {
                create: 'POST /api/coupons (Protected)',
                getAll: 'GET /api/coupons (Protected)',
                validate: 'POST /api/coupons/validate',
                update: 'PUT /api/coupons/:id (Protected)',
                delete: 'DELETE /api/coupons/:id (Protected)'
            },
            orders: {
                create: 'POST /api/orders',
                getAll: 'GET /api/orders (Protected)',
                getById: 'GET /api/orders/:id (Protected)',
                getByInvoice: 'GET /api/orders/invoice/:invoiceNumber',
                updateStatus: 'PUT /api/orders/:id/status (Protected)',
                cancel: 'PUT /api/orders/:id/cancel (Protected)'
            },
            payments: {
                createOrder: 'POST /api/payments/create-order',
                verify: 'POST /api/payments/verify',
                getKey: 'GET /api/payments/razorpay-key'
            }
        }
    });
});

// 404 Handler - Must be after all other routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server RESTARTED in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`✅ CMS ROUTES LOADED`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
