import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from "../model/course.model.js"; 
import { validationResult } from 'express-validator';
import { generateCoursePdf } from '../utils/pdfGenerator.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to clean array fields
const cleanArrayField = (field, defaultVal = []) => {
    if (!field) return defaultVal;
    if (Array.isArray(field)) {
        const cleaned = field.filter(item => item && item.toString().trim() !== '');
        return cleaned.length > 0 ? cleaned : defaultVal;
    }
    if (typeof field === 'string') {
        const items = field.split('\n')
            .map(item => item.trim())
            .filter(item => item !== '');
        return items.length > 0 ? items : defaultVal;
    }
    return defaultVal;
};

// Helper function to clean and format product data
const prepareProductData = (data) => {
    console.log('Raw data received in prepareProductData:', JSON.stringify(data, null, 2));

    // Clean array fields - mapping Ayurveda context
    // benefits -> General Benefits
    // skills -> Tags/Keywords
    // curriculum -> Usage Guide
    // prerequisites -> Ingredients
    // whatYouWillLearn -> Health Benefits
    // requirements -> Storage Instructions/Precautions

    const arrayFields = [
        'benefits', 'skills', 'curriculum', 'faqs',
        'whatYouWillLearn', 'requirements', 'whoIsThisFor', 'tags', 'prerequisites'
    ];

    // Create a clean copy of the data
    const cleanData = { ...data };

    // Process array fields
    arrayFields.forEach(field => {
        if (data[field] === undefined || data[field] === null) {
            cleanData[field] = [];
            return;
        }

        if (field === 'benefits') {
            cleanData[field] = cleanArrayField(data[field], []);
        } else if (['skills', 'prerequisites', 'whatYouWillLearn', 'requirements', 'whoIsThisFor', 'tags'].includes(field)) {
            // Handle string arrays
            if (Array.isArray(data[field])) {
                cleanData[field] = data[field]
                    .filter(item => item !== null && item !== undefined)
                    .map(item => item.toString().trim())
                    .filter(item => item !== '');
            } else if (typeof data[field] === 'string') {
                cleanData[field] = data[field]
                    .split('\n')
                    .map(item => item.trim())
                    .filter(item => item !== '');
            } else {
                cleanData[field] = [];
            }
        } else if (Array.isArray(data[field])) {
            cleanData[field] = data[field].filter(item =>
                item !== null && item !== undefined && item.toString().trim() !== ''
            );
        } else {
            cleanData[field] = [];
        }
    });

    // Handle totalHours (Net Quantity) specifically
    cleanData.totalHours = Math.max(0, Number(data.totalHours) || 0);

    console.log('Cleaned data before return:', JSON.stringify(cleanData, null, 2));

    // Process curriculum (Usage Guide)
    if (Array.isArray(data.curriculum)) {
        cleanData.curriculum = data.curriculum
            .filter(step => step && (step.title || step.week))
            .map((step, index) => ({
                week: Number(step.week) || index + 1,
                title: step.title?.toString().trim() || `Step ${index + 1}`,
                description: step.description?.toString().trim() || '',
                duration: step.duration?.toString().trim() || '5 mins',
                topics: cleanArrayField(step.topics, [])
            }));
    } else {
        cleanData.curriculum = [{
            week: 1,
            title: 'Usage Instructions',
            description: 'Standard dosage',
            duration: '0 min',
            topics: ['Follow physician instructions']
        }];
    }

    // Process Pricing
    const price = Math.max(0, Number(data.price) || 0);
    const isFree = data.isFree !== undefined ? Boolean(data.isFree) : price === 0;

    const result = {
        title: data.title?.toString().trim() || 'Untitled Product',
        shortDescription: data.shortDescription?.toString().trim() || '',
        description: data.description?.toString().trim() || '',
        category: data.category?.toString().trim() || null,
        instructor: data.instructor?.toString().trim() || 'Ayushaushadhi', // Default Brand
        price: isFree ? 0 : price,
        originalPrice: isFree ? 0 : Math.max(0, Number(data.originalPrice) || price),
        isFree: isFree,
        totalHours: cleanData.totalHours,  // Net Quantity
        image: data.image?.toString().trim() || '',
        thumbnail: data.thumbnail?.toString().trim() || data.image?.toString().trim() || '',
        previewVideo: data.previewVideo?.toString().trim() || '',
        duration: data.duration?.toString().trim() || '24 Months', // Shelf Life

        // Product Form (Tablet, Oil, etc.)
        level: ['Tablet', 'Syrup', 'Oil', 'Powder', 'Capsule', 'Raw Herb', 'Beginner', 'Intermediate', 'Advanced'].includes(data.level)
            ? data.level
            : 'Tablet',

        language: data.language?.toString().trim() || 'Ayurveda',
        metaTitle: data.metaTitle?.toString().trim() || data.title?.toString().trim() || '',
        metaDescription: data.metaDescription?.toString().trim() || data.shortDescription?.toString().trim() || '',
        slug: data.slug?.toString().trim() || '',

        certificateIncluded: data.certificateIncluded !== false, // Prescription Required?
        isFeatured: Boolean(data.isFeatured),
        isPublished: Boolean(data.isPublished),

        status: ['draft', 'published', 'archived'].includes(data.status)
            ? data.status
            : 'draft',

        // Arrays
        benefits: cleanData.benefits || [],
        skills: cleanData.skills || [], // Tags
        curriculum: cleanData.curriculum || [], // Usage Guide
        faqs: cleanData.faqs || [],
        whatYouWillLearn: cleanData.whatYouWillLearn || [], // Benefits
        requirements: cleanData.requirements || [], // Precautions
        whoIsThisFor: cleanData.whoIsThisFor || [], // Target Audience
        tags: cleanData.tags || [],
        warnings: cleanData.warnings || [], // Safety Warnings
        prerequisites: cleanData.prerequisites || [], // Ingredients
        ingredients: cleanData.ingredients || cleanData.prerequisites || [], // Alias for prerequisites
        storage: data.storage?.toString().trim() || '' // Storage Instructions
    };

    console.log('Final prepared product data:', JSON.stringify(result, null, 2));
    return result;
};

// Create a new product
export const createCourse = async (req, res) => {
    try {
        console.log('Received create product request with data:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const productData = prepareProductData(req.body);
        console.log('Creating product with data:', productData);

        const product = new Product({
            ...productData,
            enrollmentCount: 0, // Sales Count
            totalStudents: 0, // Customer Count
            averageRating: 0,
            totalReviews: 0
        });

        try {
            const savedProduct = await product.save();
            const populatedProduct = await savedProduct.populate('category', 'name _id');

            return res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: populatedProduct.toObject()
            });
        } catch (error) {
            console.error('Error saving product:', error);

            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    success: false,
                    message: `A product with this ${field} already exists`
                });
            }

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: messages
                });
            }

            throw error;
        }
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all products with filters
export const getAllCourses = async (req, res) => {
    try {
        const { category, status, fields, all, search, showOnHome, limit, sort, isPublished, price } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (price !== undefined) {
            query.price = Number(price);
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { instructor: { $regex: searchRegex } }, // Search by Brand
                { 'category.name': { $regex: searchRegex } }
            ];
        }

        const isAdmin = req.user && req.user.role === 'admin';

        if (isPublished === 'true') {
            query.isPublished = true;
        } else if (isPublished === 'false') {
            query.isPublished = false;
        } else if (all !== 'true' && !isAdmin) {
            query.isPublished = true;
        }

        if (showOnHome === 'true') {
            query.showOnHome = true;
        } else if (showOnHome === 'false') {
            query.showOnHome = false;
        }

        let selection = fields ? fields.split(',').join(' ') : '';

        let sortObj = { createdAt: -1 };
        if (sort) {
            sortObj = {};
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                const sortOrder = field.startsWith('-') ? -1 : 1;
                const fieldName = field.replace(/^-/, '');
                sortObj[fieldName] = sortOrder;
            });
        }

        let productsQuery = Product.find(query)
            .populate('category', 'name')
            .sort(sortObj);

        if (selection) {
            productsQuery = productsQuery.select(selection);
        }

        if (limit && !isNaN(parseInt(limit))) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery.exec();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single product
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;

        const condition = /^[0-9a-fA-F]{24}$/.test(id)
            ? { $or: [{ _id: id }, { slug: id }] }
            : { slug: id };

        let query = Product.findOne(condition);

        if (fields) {
            const fieldsArray = fields.split(',').map(field => field.trim());
            if (!fieldsArray.includes('_id')) {
                fieldsArray.push('_id');
            }
            query = query.select(fieldsArray.join(' '));
        }

        const requiredFields = [
            'title', 'description', 'shortDescription', 'category',
            'instructor', 'price', 'originalPrice', 'thumbnail',
            'duration', 'level', 'benefits', 'whatYouWillLearn',
            'requirements', 'whoIsThisFor', 'curriculum', 'isFeatured',
            'isPublished', 'slug', 'tags', 'faqs', 'certificateIncluded',
            'metaTitle', 'metaDescription', 'previewVideo', 'image',
            'brochureUrl', 'brochureGeneratedAt', 'totalHours', 'prerequisites',
            'warnings', 'storage', 'ingredients'
        ];

        if (fields) {
            const includedFields = fields.split(',').map(f => f.trim());
            const missingFields = requiredFields.filter(f => !includedFields.includes(f) && f !== '_id');
            if (missingFields.length > 0) {
                query = query.select(missingFields.join(' '));
            }
        }

        query = query.populate('category', 'name _id');

        const product = await query.lean().exec();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const ensureArray = (arr) => Array.isArray(arr) && arr.length > 0 ? arr : [''];

        const processedProduct = {
            ...product,
            benefits: ensureArray(product.benefits),
            whatYouWillLearn: ensureArray(product.whatYouWillLearn),
            requirements: ensureArray(product.requirements),
            whoIsThisFor: ensureArray(product.whoIsThisFor),
            warnings: ensureArray(product.warnings || []),
            ingredients: ensureArray(product.ingredients || product.prerequisites || []),
            storage: product.storage || '',
            tags: product.tags || [],
            faqs: product.faqs || [],
            curriculum: product.curriculum?.length ? product.curriculum : [{
                week: 1,
                title: "Usage Guide",
                description: "",
                duration: "5 min",
                topics: [""]
            }]
        };

        res.json({
            success: true,
            data: processedProduct
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update product
export const updateCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const productId = req.params.id;
        console.log(`Updating product ${productId} with data:`, req.body);

        const cleanArrayField = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) {
                return field.filter(item => item && item.toString().trim() !== '');
            }
            if (typeof field === 'string') {
                return field.split('\n').map(item => item.trim()).filter(item => item !== '');
            }
            return [];
        };

        const {
            title, shortDescription = '', description = '', category,
            instructor, price = 0, originalPrice = 0, isFree = false,
            totalHours = 0, duration = '', level = 'Tablet',
            benefits, skills, curriculum, faqs = [], language = 'Ayurveda',
            whatYouWillLearn, prerequisites, requirements, whoIsThisFor,
            certificateIncluded = true, isFeatured = false, isPublished = false,
            showOnHome = false, status = 'draft', image = '', thumbnail = '',
            previewVideo = '', metaTitle = '', metaDescription = '', slug = '',
            tags = [], warnings = [], storage = '', ingredients = []
        } = req.body;

        const updateData = {
            title: title?.toString()?.trim() || 'Untitled Product',
            shortDescription: shortDescription?.toString()?.trim() || '',
            description: description?.toString()?.trim() || '',
            category: category?.toString()?.trim() || null,
            instructor: instructor?.toString()?.trim() || null,
            price: isFree ? 0 : Math.max(0, Number(price) || 0),
            originalPrice: isFree ? 0 : Math.max(0, Number(originalPrice) || 0),
            isFree: Boolean(isFree),
            totalHours: Math.max(0, Number(totalHours) || 0),
            duration: duration?.toString()?.trim() || '12 Months',
            level: level,
            benefits: cleanArrayField(benefits),
            skills: cleanArrayField(skills),
            requirements: cleanArrayField(requirements),
            whoIsThisFor: cleanArrayField(whoIsThisFor),
            whatYouWillLearn: cleanArrayField(whatYouWillLearn),
            warnings: cleanArrayField(warnings),
            ingredients: cleanArrayField(ingredients),
            prerequisites: cleanArrayField(prerequisites),
            storage: storage?.toString()?.trim() || '',
            certificateIncluded: certificateIncluded !== false,
            isFeatured: Boolean(isFeatured),
            isPublished: Boolean(isPublished),
            showOnHome: Boolean(showOnHome),
            status: ['draft', 'published', 'archived'].includes(status) ? status : 'draft',
            image: image?.toString()?.trim() || '',
            thumbnail: thumbnail?.toString()?.trim() || '',
            previewVideo: previewVideo?.toString()?.trim() || '',
            metaTitle: metaTitle?.toString()?.trim() || '',
            metaDescription: metaDescription?.toString()?.trim() || '',
            slug: slug?.toString()?.trim() || '',
            tags: Array.isArray(tags) ? tags.map(tag => tag?.toString()?.trim()).filter(Boolean) : [],
            faqs: Array.isArray(faqs) ? faqs.map(faq => ({
                question: faq.question.toString().trim(),
                answer: faq.answer.toString().trim()
            })) : [],
            curriculum: Array.isArray(curriculum) ? curriculum.map((step, index) => ({
                week: Math.max(1, Number(step.week) || index + 1),
                title: step.title?.toString()?.trim() || `Step ${index + 1}`,
                description: step.description?.toString()?.trim() || '',
                duration: step.duration?.toString().trim() || '5 min',
                topics: Array.isArray(step.topics)
                    ? step.topics.map(topic => topic?.toString()?.trim()).filter(Boolean)
                    : []
            })) : []
        };

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        Object.keys(updateData).forEach(key => {
            product[key] = updateData[key];
        });

        const updatedProduct = await product.save();
        await updatedProduct.populate('category', 'name _id');

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct.toObject()
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload product image
export const uploadCourseImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file was uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            location: fileUrl,
            fullUrl: fullUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing image upload',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete product
export const deleteCourse = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate Brochure (PDF)
export const generatePdf = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Generate the PDF Brochure
        const pdfInfo = await generateCoursePdf(product);

        product.brochureUrl = pdfInfo.fileUrl;
        product.brochureGeneratedAt = new Date();
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Brochure generated successfully',
            fileUrl: pdfInfo.fileUrl,
            filename: pdfInfo.filename,
            brochureUrl: pdfInfo.fileUrl
        });
    } catch (error) {
        console.error('Error in generatePdf:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate brochure',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete Brochure
export const deletePdf = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!req.body.fileUrl) {
            return res.status(400).json({ success: false, message: 'Brochure URL is required' });
        }

        const filename = path.basename(req.body.fileUrl);
        const filePath = path.join(__dirname, '..', 'public', 'pdfs', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({ success: true, message: 'Brochure deleted successfully' });
        }

        return res.status(404).json({ success: false, message: 'Brochure file not found' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete brochure' });
    }
};