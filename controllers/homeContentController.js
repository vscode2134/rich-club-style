const HomeContent = require('../models/HomeContent');
const Product = require('../models/Product');

/**
 * Home Content Controller
 * Manages CMS content for the Home page
 */

/**
 * @desc    Get home page content (public)
 * @route   GET /api/home-content
 * @access  Public
 */
const getHomeContent = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();

        // Populate featured products if they exist
        await content.populate('featuredSection.productIds', 'name price images category isActive sizes');

        // Filter only active products
        const activeProducts = content.featuredSection.productIds.filter(p => p && p.isActive);

        // Get active hero slides and lookbook items
        const activeHeroSlides = content.getActiveHeroSlides();
        const activeLookbookItems = content.getActiveLookbookItems();

        // Prepare response
        const response = {
            heroSlides: activeHeroSlides,
            lookbookItems: activeLookbookItems,
            featuredSection: {
                ...content.featuredSection.toObject(),
                products: activeProducts.slice(0, content.featuredSection.maxProducts)
            },
            newArrivalsSection: content.newArrivalsSection,
            uspSection: content.uspSection
        };

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get full home content for admin editing
 * @route   GET /api/admin/home-content
 * @access  Admin
 */
const getHomeContentAdmin = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        await content.populate('featuredSection.productIds', 'name price images category isActive');
        await content.populate('lastUpdatedBy', 'name email');

        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update home content
 * @route   PUT /api/admin/home-content
 * @access  Admin
 */
const updateHomeContent = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();

        const {
            heroSlides,
            lookbookItems,
            featuredSection,
            newArrivalsSection,
            uspSection
        } = req.body;

        // Update hero slides if provided
        if (heroSlides) {
            content.heroSlides = heroSlides;
        }

        // Update lookbook items if provided
        if (lookbookItems) {
            content.lookbookItems = lookbookItems;
        }

        // Update featured section if provided
        if (featuredSection) {
            content.featuredSection = {
                ...content.featuredSection,
                ...featuredSection
            };
        }

        // Update new arrivals section if provided
        if (newArrivalsSection) {
            content.newArrivalsSection = {
                ...content.newArrivalsSection,
                ...newArrivalsSection
            };
        }

        // Update USP section if provided
        if (uspSection !== undefined) {
            content.uspSection = uspSection;
        }

        // Track who updated
        content.lastUpdatedBy = req.user._id;

        await content.save();
        await content.populate('featuredSection.productIds', 'name price images category');
        await content.populate('lastUpdatedBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Home content updated successfully',
            data: content
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add hero slide
 * @route   POST /api/admin/home-content/hero
 * @access  Admin
 */
const addHeroSlide = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const { badge, headline, description, image, ctaText, ctaLink, order } = req.body;

        content.heroSlides.push({
            badge,
            headline,
            description,
            image,
            ctaText,
            ctaLink,
            order: order !== undefined ? order : content.heroSlides.length,
            isActive: true
        });

        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(201).json({
            success: true,
            message: 'Hero slide added successfully',
            data: content.heroSlides[content.heroSlides.length - 1]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update hero slide
 * @route   PUT /api/admin/home-content/hero/:id
 * @access  Admin
 */
const updateHeroSlide = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const slideId = req.params.id;

        const slide = content.heroSlides.id(slideId);
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Hero slide not found'
            });
        }

        // Only update fields that are not empty strings for required fields
        const updates = { ...req.body };
        const requiredFields = ['badge', 'headline', 'description', 'image', 'ctaText', 'ctaLink'];

        requiredFields.forEach(field => {
            if (updates[field] === '') {
                delete updates[field];
            }
        });

        Object.assign(slide, updates);
        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Hero slide updated successfully',
            data: slide
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete hero slide
 * @route   DELETE /api/admin/home-content/hero/:id
 * @access  Admin
 */
const deleteHeroSlide = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const slideId = req.params.id;

        const slide = content.heroSlides.id(slideId);
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Hero slide not found'
            });
        }

        // Ensure at least one slide remains
        if (content.heroSlides.length <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last hero slide. At least one slide is required.'
            });
        }

        slide.deleteOne();
        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Hero slide deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add lookbook item
 * @route   POST /api/admin/home-content/lookbook
 * @access  Admin
 */
const addLookbookItem = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const { title, description, image, link, order } = req.body;

        content.lookbookItems.push({
            title,
            description,
            image,
            link,
            order: order !== undefined ? order : content.lookbookItems.length,
            isActive: true
        });

        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(201).json({
            success: true,
            message: 'Lookbook item added successfully',
            data: content.lookbookItems[content.lookbookItems.length - 1]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update lookbook item
 * @route   PUT /api/admin/home-content/lookbook/:id
 * @access  Admin
 */
const updateLookbookItem = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const itemId = req.params.id;

        const item = content.lookbookItems.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Lookbook item not found'
            });
        }

        // Only update fields that are not empty strings for required fields
        const updates = { ...req.body };
        const requiredFields = ['title', 'description', 'image', 'link'];

        requiredFields.forEach(field => {
            if (updates[field] === '') {
                delete updates[field];
            }
        });

        Object.assign(item, updates);
        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Lookbook item updated successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete lookbook item
 * @route   DELETE /api/admin/home-content/lookbook/:id
 * @access  Admin
 */
const deleteLookbookItem = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const itemId = req.params.id;

        const item = content.lookbookItems.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Lookbook item not found'
            });
        }

        // Ensure at least one item remains
        if (content.lookbookItems.length <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last lookbook item. At least one item is required.'
            });
        }

        item.deleteOne();
        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Lookbook item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reorder items (hero slides or lookbook)
 * @route   PUT /api/admin/home-content/reorder
 * @access  Admin
 */
const reorderItems = async (req, res, next) => {
    try {
        const content = await HomeContent.getOrCreate();
        const { type, items } = req.body; // type: 'hero' or 'lookbook', items: array of {id, order}

        if (type === 'hero') {
            items.forEach(({ id, order }) => {
                const slide = content.heroSlides.id(id);
                if (slide) slide.order = order;
            });
        } else if (type === 'lookbook') {
            items.forEach(({ id, order }) => {
                const item = content.lookbookItems.id(id);
                if (item) item.order = order;
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid type. Must be "hero" or "lookbook"'
            });
        }

        content.lastUpdatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: `${type === 'hero' ? 'Hero slides' : 'Lookbook items'} reordered successfully`,
            data: content
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
