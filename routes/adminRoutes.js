const express = require('express');
const router = express.Router();
const { getDailySummaryWhatsAppMessage } = require('../controllers/orderController');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Admin Specialty Routes
 */

// @route   GET /api/admin/daily-summary/whatsapp
// @desc    Get daily summary formatted for WhatsApp
// @access  Admin
router.get('/daily-summary/whatsapp', verifyJWT, isAdmin, getDailySummaryWhatsAppMessage);

module.exports = router;
