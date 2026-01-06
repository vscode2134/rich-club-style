const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/healthController');

/**
 * Health Check Routes
 * Provides endpoints for monitoring server health
 */

// @route   GET /api/health
// @desc    Get server health status
// @access  Public
router.get('/', getHealthStatus);

module.exports = router;
