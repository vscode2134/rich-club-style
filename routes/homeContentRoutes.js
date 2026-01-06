const express = require('express');
const router = express.Router();
const {
    getHomeContent,
    getHomeContentAdmin,
    updateHomeContent,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    addLookbookItem,
    updateLookbookItem,
    deleteLookbookItem,
    reorderItems
} = require('../controllers/homeContentController');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Home Content Routes
 * Public and Admin routes for managing home page content
 */

// @route   GET /api/home-content
// @desc    Get home page content (public)
// @access  Public
router.get('/', getHomeContent);

// @route   GET /api/admin/home-content
// @desc    Get full home content for admin editing
// @access  Admin
router.get('/admin', verifyJWT, isAdmin, getHomeContentAdmin);

// @route   PUT /api/admin/home-content
// @desc    Update home content
// @access  Admin
router.put('/admin', verifyJWT, isAdmin, updateHomeContent);

// Hero Slides Management
// @route   POST /api/admin/home-content/hero
// @desc    Add hero slide
// @access  Admin
router.post('/admin/hero', verifyJWT, isAdmin, addHeroSlide);

// @route   PUT /api/admin/home-content/hero/:id
// @desc    Update hero slide
// @access  Admin
router.put('/admin/hero/:id', verifyJWT, isAdmin, updateHeroSlide);

// @route   DELETE /api/admin/home-content/hero/:id
// @desc    Delete hero slide
// @access  Admin
router.delete('/admin/hero/:id', verifyJWT, isAdmin, deleteHeroSlide);

// Lookbook Items Management
// @route   POST /api/admin/home-content/lookbook
// @desc    Add lookbook item
// @access  Admin
router.post('/admin/lookbook', verifyJWT, isAdmin, addLookbookItem);

// @route   PUT /api/admin/home-content/lookbook/:id
// @desc    Update lookbook item
// @access  Admin
router.put('/admin/lookbook/:id', verifyJWT, isAdmin, updateLookbookItem);

// @route   DELETE /api/admin/home-content/lookbook/:id
// @desc    Delete lookbook item
// @access  Admin
router.delete('/admin/lookbook/:id', verifyJWT, isAdmin, deleteLookbookItem);

// Reorder Items
// @route   PUT /api/admin/home-content/reorder
// @desc    Reorder hero slides or lookbook items
// @access  Admin
router.put('/admin/reorder', verifyJWT, isAdmin, reorderItems);

module.exports = router;
