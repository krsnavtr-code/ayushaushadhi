import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import axios from "axios";
import {
  FaSearch,
  FaStar,
  FaLeaf,
  FaShoppingCart,
  FaTag,
} from "react-icons/fa";

const HerbalStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual "Herbal Products" category ID from your database
        // Or remove the category filter to show all products
        const categoryId = "68887f978b23a2d739ac5be4";
        console.log(`Fetching products for category: ${categoryId}`);

        // Fetch published products (using the existing /collections endpoint structure)
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/collections?category=${categoryId}&isPublished=true`
        );

        const productsData = Array.isArray(response.data) ? response.data : [];

        // Sort products alphabetically by title
        const sortedProducts = [...productsData].sort((a, b) =>
          a.title.localeCompare(b.title)
        );

        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching store products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProducts();
  }, []);

  // Search Filter Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category &&
            product.category.name &&
            product.category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <SEO
        title="Herbal Store | Authentic Ayurvedic Remedies | Ayushaushadhi"
        description="Shop our collection of 100% natural Ayurvedic medicines. From immunity boosters to digestive care, find holistic healing remedies delivered to your doorstep."
        keywords="ayurveda store, herbal medicine online, natural remedies, buy ayurveda products, immunity booster, organic health"
        og={{
          title: "Ayushaushadhi Herbal Store - Nature's Healing",
          description:
            "Browse our curated selection of authentic Ayurvedic products. Pure, potent, and chemical-free.",
          type: "website",
        }}
      />

      {/* Decorative Background */}
      <FaLeaf className="absolute top-0 left-0 text-[15rem] text-emerald-100 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 font-serif mb-3">
            Herbal Collection
          </h1>
          <div className="h-1 w-20 bg-amber-400 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the power of nature with our range of doctor-formulated
            remedies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-emerald-400 text-lg" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-emerald-100 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
            placeholder="Search for remedies (e.g., Immunity, Digestion)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:-translate-y-1"
              >
                <Link to={`/course/${product._id}`}>
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-200 dark:text-gray-600 bg-emerald-50 dark:bg-gray-700">
                        <FaLeaf className="text-5xl" />
                      </div>
                    )}

                    {/* Badge: Free or Discount */}
                    {(product.price === 0 || product.isFree) && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                        <FaTag /> Sample
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">
                      {product.category?.name || "Wellness"}
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2 font-serif group-hover:text-emerald-700 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10">
                      {product.shortDescription ||
                        "Natural herbal formulation for holistic health."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                        <FaStar />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.rating ? product.rating.toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 group-hover:underline">
                        View Details <FaShoppingCart className="text-xs" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <FaLeaf className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No remedies found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}".`
                : "Our herbal collection is being updated. Please check back soon!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HerbalStore;
