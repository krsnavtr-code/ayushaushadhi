import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories as getCategoriesFromApi } from "../../api/categoryApi";
import { getCoursesByCategory } from "../../api/courseApi"; // We treat courses as products
import { FaLeaf, FaArrowRight, FaMortarPestle } from "react-icons/fa";

// Helper function to get the full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${imagePath}`;
};

const AllCollections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        // First, fetch all categories with pagination
        const response = await getCategoriesFromApi({ limit: 100 });

        const categoriesData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!categoriesData.length) {
          setError("No collections found.");
          setLoading(false);
          return;
        }

        // Then, fetch product count for each category
        const categoriesWithCount = await Promise.all(
          categoriesData.map(async (category) => {
            if (!category || !category._id) return null;

            try {
              // Fetching "courses" but counting them as products
              const products = await getCoursesByCategory(category._id);
              return {
                ...category,
                productCount: Array.isArray(products) ? products.length : 0,
              };
            } catch (err) {
              console.error(
                `Error fetching products for category ${category.name}:`,
                err
              );
              return {
                ...category,
                productCount: 0,
              };
            }
          })
        );

        const validCategories = categoriesWithCount.filter(Boolean);
        setCategories(validCategories);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(
          "Failed to load wellness collections. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const renderCategoryImage = (category) => {
    const imageUrl = category.image ? getImageUrl(category.image) : null;

    return (
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-emerald-50 dark:bg-gray-700 flex items-center justify-center border border-emerald-100 dark:border-gray-600 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center bg-emerald-50 text-emerald-300">
          <FaLeaf className="text-2xl" />
        </div>
        {!imageUrl && <FaLeaf className="text-emerald-300 text-2xl" />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background Leaves */}
      <FaLeaf className="absolute top-0 left-0 text-[12rem] text-emerald-100 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
            Browse by Concern
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-white mb-4 font-serif">
            Wellness Collections
          </h1>
          <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find specific remedies tailored to your health needs, from immunity
            boosters to digestive care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/collections/category/${category.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`} // Maintaining route structure
              className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-600 transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {renderCategoryImage(category)}
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                    <FaArrowRight className="text-gray-400 group-hover:text-white text-sm" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300 font-serif">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    <FaMortarPestle className="mr-1.5" />
                    {category.productCount || 0} Products
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCollections;
