import axios from './axios';

// --- Assets ---

// Upload product image (formerly uploadCourseImage)
export const uploadCourseImage = async (formData) => {
    try {
        const uploadAxios = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        // Keeping route as /collections/upload-image for compatibility
        const response = await uploadAxios.post('/collections/upload-image', formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading product image:', error);
        throw error;
    }
};

// --- Product Management (formerly Course Management) ---

// Get all products (courses)
export const getCourses = async (queryParams = '', isAdmin = false) => {
    try {
        const params = typeof queryParams === 'string'
            ? new URLSearchParams(queryParams)
            : new URLSearchParams();

        if (isAdmin) {
            params.set('admin', 'true');
        }

        // Updated fields list to match Product Schema
        // Mapped: instructor -> Brand, level -> Form, totalHours -> NetQty
        params.set('fields', 'title,description,image,category,instructor,price,originalPrice,showOnHome,isPublished,level,totalHours,duration');

        console.log('Fetching products with params:', Object.fromEntries(params));
        const response = await axios.get(`/collections?${params.toString()}`);

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else if (response.data && typeof response.data === 'object') {
            return Object.values(response.data);
        }

        return [];
    } catch (error) {
        console.error('Error in getProducts:', error.message);
        throw error;
    }
};

// Get single product by ID
export const getCourseById = async (id) => {
    try {
        console.log(`Fetching product with ID: ${id}`);
        const response = await axios.get(`/collections/${id}`, {
            params: {
                fields: [
                    'title', 'description', 'shortDescription', 'category',
                    'instructor', // Brand
                    'price', 'originalPrice', 'discount',
                    'totalHours', // Net Qty
                    'thumbnail', 'image',
                    'rating', 'enrolledStudents', // Sales Count
                    'duration', // Shelf Life
                    'whatYouWillLearn', // Health Benefits
                    'requirements', // Storage Info
                    'whoIsThisFor', // Target Audience
                    'curriculum', // Usage Guide
                    'reviews', 'isFeatured', 'showOnHome', 'slug', 'status',
                    'metaTitle', 'metaDescription', 'tags',
                    'prerequisites', // Ingredients
                    'skills', // Tags
                    'certificateIncluded', // Prescription Req
                    'isPublished', 'language',
                    'level', // Product Form
                    'mentors', 'faqs',
                    'brochureUrl', 'brochureGeneratedAt'
                ].join(',')
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

// Get products by category
export const getCoursesByCategory = async (categoryId = '') => {
    try {
        const params = {
            fields: 'title,description,price,originalPrice,thumbnail,duration,level,instructor,rating,isFeatured,category,slug,status'
        };

        if (categoryId) {
            params.category = categoryId;
        }

        const response = await axios.get('/collections', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching category products:', error);
        throw error;
    }
};

// Download product brochure
export const downloadBrochure = async (productId) => {
    try {
        const response = await axios.get(`/collections/${productId}/download-brochure`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'product-brochure.pdf';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch != null && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Error downloading brochure:', error);
        throw error;
    }
};

// Get categories for forms (dropdowns)
export const getCategoriesForForm = async () => {
    try {
        const response = await axios.get('/categories');

        // Handle various response structures
        let data = [];
        if (response.data && Array.isArray(response.data)) {
            data = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
            data = response.data.data;
        } else if (response.data?.results && Array.isArray(response.data.results)) {
            data = response.data.results;
        }

        return data.map(cat => ({
            value: cat._id,
            label: cat.title || cat.name || 'Unnamed Collection'
        }));

    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// --- Admin Actions ---

export const deleteCourse = async (id) => {
    return axios.delete(`/collections/${id}`);
};

export const createCourse = async (data) => {
    return axios.post('/collections', data);
};

export const updateCourse = async (id, data) => {
    return axios.put(`/collections/${id}`, data);
};