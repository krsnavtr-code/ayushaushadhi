import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaTag,
  FaLeaf,
} from "react-icons/fa";
import axios from "../../api/axios";

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// ProductCard Component (Formerly CourseCard)
const ProductCard = ({ course: product }) => {
  const [imageState, setImageState] = useState({
    url: "",
    error: false,
    loading: true,
  });

  // Image Loading Logic (Kept robust from original code)
  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!product?.thumbnail) {
        if (isMounted) {
          setImageState({
            url: "/images/product-placeholder.jpg", // Changed placeholder name
            error: false,
            loading: false,
          });
        }
        return;
      }

      let url = product.thumbnail;

      // URL Construction logic
      if (
        !url.startsWith("http") &&
        !url.startsWith("https") &&
        !url.startsWith("//")
      ) {
        const cleanPath = url.replace(/^\/+/, "");
        const baseUrl = API_BASE_URL || "";
        url = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
      }

      if (isMounted) {
        setImageState({ url: url, error: false, loading: true });
      }

      const img = new Image();
      img.onload = () => {
        if (isMounted)
          setImageState({ url: url, error: false, loading: false });
      };
      img.onerror = () => {
        if (isMounted)
          setImageState({
            url: "/images/product-placeholder.jpg",
            error: true,
            loading: false,
          });
      };
      img.src = url;
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [product?._id, product?.thumbnail]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-amber-400" />); // Can use FaStarHalfAlt if imported
      } else {
        stars.push(<FaRegStar key={i} className="text-amber-200" />);
      }
    }
    return stars;
  };

  // Pricing formatting (Assuming product.price exists, defaulting to dummy if not)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 499); // Default fallback price
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/collections/${product.slug || product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {imageState.loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <img
              src={
                imageState.error
                  ? "/assets/placeholder-herb.jpg"
                  : imageState.url
              }
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300?text=Ayush+Product";
              }}
            />
          )}

          {/* Badges */}
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          <span className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <FaLeaf size={10} /> 100% Natural
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Tag */}
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide">
            {product.category?.name || product.level || "Wellness"}
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 h-14 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3 space-x-1">
            <div className="flex text-sm">
              {renderStars(product.rating || 4.5)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({product.enrollmentCount || 120} reviews)
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">
                {formatPrice((product.price || 499) * 1.5)}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price || 499)}
              </span>
            </div>
            <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PopularCourses = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Fetching "Courses" but treating them as Products
        const response = await axios.get("/collections", {
          params: {
            showOnHome: "true",
            limit: 8,
            sort: "-createdAt",
            isPublished: "true",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (response.data && response.data.courses) {
          data = response.data.courses;
        }

        // Filter valid products
        const featuredProducts = data.filter(
          (item) => item.showOnHome !== false
        );

        setProducts(featuredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 font-serif">
            Best Selling Remedies
          </h2>
          <div className="h-1.5 w-24 bg-amber-400 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our most loved Ayurvedic formulations, crafted to restore
            balance and vitality naturally.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-700 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} course={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 transition-all duration-300"
          >
            <FaTag className="mr-2" /> View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
