const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { verifyJWT, isAdmin } = require('../middlewares/auth');

/**
 * Professional Image Optimization Logic
 * - Memory storage (process before saving)
 * - 25MB Limit
 * - Sharp optimization (WebP, resizing, compression)
 */

// Memory storage for Sharp processing
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: fileFilter
});

/**
 * @route   POST /api/upload/cms
 * @desc    Upload & Optimize CMS images (Hero, Lookbook)
 * @access  Admin
 */
router.post('/cms', verifyJWT, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const { section } = req.body; // 'hero' or 'lookbook'
        const uploadDir = 'uploads/cms/';

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = `${section || 'cms'}-${uniqueSuffix}.webp`;
        const filePath = path.join(uploadDir, fileName);

        // Professional Optimization with Sharp
        let transformer = sharp(req.file.buffer)
            .webp({ quality: 85 }) // Convert to WebP with good quality
            .rotate(); // Auto-rotate based on EXIF

        // Conditional Resizing based on section
        if (section === 'hero') {
            transformer = transformer.resize(1920, 1080, {
                fit: 'cover',
                withoutEnlargement: true
            });
        } else if (section === 'lookbook') {
            transformer = transformer.resize(1200, 1500, {
                fit: 'cover',
                withoutEnlargement: true
            });
        }

        await transformer.toFile(filePath);

        // Construct full URL
        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/cms/${fileName}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded and optimized successfully',
            imageUrl: imageUrl,
            size: fs.statSync(filePath).size
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing image'
        });
    }
});

/**
 * @route   POST /api/upload/product-image
 * @desc    Upload product image (legacy/existing for backward compatibility or simple uploads)
 */
const legacyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/products/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const legacyUpload = multer({
    storage: legacyStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB
    fileFilter: fileFilter
});

router.post('/product-image', verifyJWT, isAdmin, legacyUpload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/products/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
});

module.exports = router;

