import "../Banner.css";
// Ensure typography.css exists or remove this import
import "../../styles/typography.css";
import React, { useState, useEffect } from "react";
import { getCategories as getCategoriesFromApi } from "../../api/categoryApi";
import { getCoursesByCategory } from "../../api/courseApi";
import { FaLeaf, FaArrowRight, FaMortarPestle } from "react-icons/fa";
import { Link } from "react-router-dom";

// Helper function to get the full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${imagePath}`;
};

// Local helper for Ayurveda-themed card backgrounds
const getNatureCardStyle = (index) => {
  const styles = [
    "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800",
    "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800",
    "bg-gradient-to-br from-lime-50 to-green-50 border-lime-100 dark:from-lime-900/20 dark:to-green-900/20 dark:border-lime-800",
  ];
  return styles[index % styles.length];
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Fetch only categories marked to show on home page
        const response = await getCategoriesFromApi({
          showOnHome: true,
          limit: 6,
          sort: "-courseCount",
          fields: "_id,name,slug,courseCount,image,description,showOnHome",
        });

        const categoriesData = Array.isArray(response)
          ? response
          : response.data || [];

        // Remove duplicates
        const uniqueCategoriesMap = new Map();
        categoriesData.forEach((cat) => {
          if (cat && cat._id && !uniqueCategoriesMap.has(cat._id)) {
            uniqueCategoriesMap.set(cat._id, cat);
          }
        });

        const uniqueCategories = Array.from(uniqueCategoriesMap.values());

        // Fetch product counts (mapped from courseCount)
        const categoriesWithCount = await Promise.all(
          uniqueCategories.map(async (category) => {
            if (
              category.courseCount === undefined ||
              category.courseCount === null
            ) {
              try {
                // NOTE: Using getCoursesByCategory to fetch products
                const courses = await getCoursesByCategory(category._id);
                return {
                  ...category,
                  courseCount: Array.isArray(courses) ? courses.length : 0,
                };
              } catch (err) {
                console.error(
                  `Error fetching products for category ${category.name}:`,
                  err
                );
                return { ...category, courseCount: 0 };
              }
            }
            return category;
          })
        );

        const sortedCategories = categoriesWithCount
          .sort((a, b) => (b.courseCount || 0) - (a.courseCount || 0))
          .slice(0, 6);

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load wellness categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const CategoryImage = React.memo(({ category }) => {
    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      setImageError(false);
      if (category?.image) {
        const url = getImageUrl(category.image);
        const img = new Image();
        img.onload = () => setImageUrl(url);
        img.onerror = () => setImageError(true);
        img.src = url;

        return () => {
          img.onload = null;
          img.onerror = null;
        };
      } else {
        setImageError(true);
      }
    }, [category?.image]);

    return (
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border-2 border-emerald-100 flex items-center justify-center flex-shrink-0">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={category?.name || "Category"}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-emerald-300">
            <FaLeaf className="text-2xl" />
          </div>
        )}
      </div>
    );
  });

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white font-serif">
              Shop by Health Concern
            </h2>
            <div className="h-1 w-20 bg-amber-400 mx-auto mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse flex items-center space-x-4"
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-amber-600 mb-4 bg-amber-50 inline-block px-4 py-2 rounded-lg border border-amber-200">
            {error}
          </div>
          <br />
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            Refresh Page
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 font-serif">
            Wellness Collections
          </h2>
          <div className="h-1.5 w-24 bg-amber-400 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover 100% natural Ayurvedic formulations categorized by your
            health needs. From immunity to digestion, find your balance.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/collections/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className={`group block p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getNatureCardStyle(
                  index
                )}`}
              >
                <div className="flex items-center space-x-5">
                  <CategoryImage category={category} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <FaMortarPestle className="mr-1.5 text-emerald-500 text-xs" />
                      <span>{category.courseCount || 0} Products</span>
                    </div>
                  </div>
                  <div className="text-emerald-300 group-hover:text-emerald-600 dark:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <FaLeaf className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No product categories found at the moment.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40"
          >
            View All Collections
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
