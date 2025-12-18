import express from 'express';
import { body } from 'express-validator';
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    uploadCourseImage,
    generatePdf,
    deletePdf
} from '../controller/course.controller.js'; // Keeping filename for compatibility
import { isAdmin } from '../middleware/admin.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- File Upload Configuration (Multer) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/; // Added webp support
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
});

const router = express.Router();

// --- Product Validation Middleware ---
const validateProduct = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('Product Name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters'),

    body('category')
        .isMongoId()
        .withMessage('Invalid Category ID'),

    body('instructor') // Mapped to Brand/Formulator
        .trim()
        .isLength({ min: 2 })
        .withMessage('Brand or Vaidya name is required'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('duration') // Mapped to Shelf Life
        .trim()
        .notEmpty()
        .withMessage('Shelf Life (Duration) is required'),

    body('level') // Mapped to Product Form
        .optional()
        .isIn([
            'Tablet', 'Syrup', 'Oil', 'Powder', 'Capsule', 'Raw Herb',
            'Beginner', 'Intermediate', 'Advanced' // Kept for backward compatibility
        ])
        .withMessage('Invalid Product Form (Must be Tablet, Syrup, Oil, etc.)'),

    body('showOnHome')
        .optional()
        .isBoolean()
        .withMessage('Show on Home must be a boolean value'),

    body('totalHours') // Mapped to Net Quantity
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Net Quantity must be a positive number')
];

// --- Admin Routes ---
// Manage Products
router.post('/', isAdmin, validateProduct, createCourse);
router.put('/:id', isAdmin, validateProduct, updateCourse);
router.delete('/:id', isAdmin, deleteCourse);

// Manage Assets
router.post('/:id/upload-image', isAdmin, upload.single('image'), uploadCourseImage);
router.post('/:id/generate-pdf', isAdmin, generatePdf); // Brochure Generation
router.delete('/:id/pdf', isAdmin, deletePdf); // Delete Brochure

// --- Public Routes ---
router.get('/', getAllCourses); // Shop Page
router.get('/:id', getCourseById); // Product Detail Page

export default router;