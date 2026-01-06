const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Authentication Middleware
 * Verifies JWT token and protects routes
 */

/**
 * Verify JWT token from Authorization header
 * Attaches user to req.user if valid
 */
const verifyJWT = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Find user by ID from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive.'
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token'
        });
    }
};

/**
 * Check if authenticated user is an admin
 * Must be used after verifyJWT middleware
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = {
    verifyJWT,
    isAdmin
};
