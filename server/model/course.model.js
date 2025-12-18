import mongoose from "mongoose";

// Reuse the curriculum structure for "Usage Guide" or "Dosage Steps"
const usageGuideSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }, // e.g., "Morning Routine"
    description: String,
    topics: [String], // e.g., ["Take with warm water", "Avoid coffee"]
    duration: String  // e.g., "5 mins" (Time required for the routine)
}, { _id: false });

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }, // Product Name
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    // --- Basic Info ---
    shortDescription: {
        type: String,
        required: false,
        trim: true,
        maxlength: 300,
        default: ''
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    // --- Brand / Origin ---
    instructor: {
        type: String,
        required: true,
        trim: true
    }, // Brand Name or Vaidya Name (e.g., "Dabur", "Patanjali", "Dr. Sharma")

    // --- Pricing & Inventory ---
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    originalPrice: {
        type: Number,
        min: 0,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false,
        index: true
    }, // Can be used for "Sample" products

    // --- Physical Attributes (Mapped from Course fields) ---
    totalHours: {
        type: Number,
        min: 0,
        default: 0
    }, // Mapped to: Net Quantity (e.g., 100 for 100g)

    duration: {
        type: String,
        required: true
    }, // Mapped to: Shelf Life (e.g., "24 Months")

    level: {
        type: String,
        enum: ['Tablet', 'Syrup', 'Oil', 'Powder', 'Capsule', 'Raw Herb', 'Beginner', 'Intermediate', 'Advanced'],
        // Added Ayurveda forms, kept old ones to prevent crash on migration
        default: 'Tablet'
    },

    // --- Media ---
    image: {
        type: String,
        default: ''
    },
    thumbnail: String,
    previewVideo: String, // Can be used for "How to use" video

    // --- Content Details ---
    curriculum: [usageGuideSchema], // Usage Instructions

    skills: [{
        type: String,
        trim: true
    }], // Mapped to: Tags / Keywords (e.g., "Immunity", "Digestion")

    prerequisites: [{
        type: String,
        trim: true
    }], // Mapped to: Key Ingredients (e.g., "Ashwagandha", "Tulsi")

    whatYouWillLearn: [{
        type: String,
        trim: true
    }], // Mapped to: Health Benefits (e.g., "Reduces Stress", "Better Sleep")

    benefits: [{
        type: String,
        required: false // Made optional as we use whatYouWillLearn for benefits mostly
    }],

    faqs: [faqSchema],

    // --- Settings ---
    isPublished: {
        type: Boolean,
        default: false
    },
    showOnHome: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    certificateIncluded: {
        type: Boolean,
        default: false
    }, // Mapped to: Prescription Required? (True/False)

    // --- Stats / Sales ---
    enrollmentCount: {
        type: Number,
        default: 0
    }, // Sales Count

    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // --- SEO ---
    metaTitle: String,
    metaDescription: String,
    tags: [String],

    language: {
        type: String,
        default: 'English'
    }, // Origin of Medicine (e.g., "Ayurveda", "Unani", "Siddha")

    brochureUrl: {
        type: String,
        default: ''
    }, // Product Leaflet/PDF

    brochureGeneratedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

// Create slug from title before saving
productSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// We name the model 'Collection' to match your API endpoint "/collections"
// or you can name it 'Product' if you change your controller.
const Product = mongoose.model('Collection', productSchema);

export default Product;