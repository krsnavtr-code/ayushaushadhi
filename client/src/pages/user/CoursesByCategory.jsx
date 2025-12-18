import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { getCoursesByCategory } from "../../api/courseApi"; // Treating courses as products
import { getCategories } from "../../api/categoryApi";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";
import {
  FaStar,
  FaLeaf,
  FaShoppingCart,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";
import { formatPrice } from "../../utils/format";

const ProductsByCategory = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all categories to populate sidebar
        const response = await getCategories({ limit: 100 });

        const categoriesData = response.data || [];
        setAllCategories(categoriesData);

        setCategory(null);

        if (categoryName) {
          // Logic to find category object based on URL slug/name
          let categoryData = categoriesData.find(
            (cat) => cat?.slug?.toLowerCase() === categoryName.toLowerCase()
          );

          if (!categoryData) {
            categoryData = categoriesData.find(
              (cat) =>
                cat?.name?.toLowerCase().replace(/\s+/g, "-") ===
                categoryName.toLowerCase()
            );
          }

          if (!categoryData) {
            const decodedCategoryName = decodeURIComponent(
              categoryName.replace(/-/g, " ")
            );
            categoryData = categoriesData.find(
              (cat) =>
                cat?.name?.trim().toLowerCase() ===
                decodedCategoryName.trim().toLowerCase()
            );
          }

          if (categoryData) {
            setCategory(categoryData);
            // Fetch products for this specific category
            const productsResponse = await getCoursesByCategory(
              categoryData._id
            );
            const productsData = Array.isArray(productsResponse)
              ? productsResponse
              : productsResponse.data || [];
            setProducts(productsData);
            return;
          }
        }

        // Fallback: If no specific category found, show all products
        const allProductsResponse = await getCoursesByCategory();
        const allProducts = Array.isArray(allProductsResponse)
          ? allProductsResponse
          : allProductsResponse.data || [];
        setProducts(allProducts);
        setCategory(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50/30 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Format category name for display
  const formattedCategoryName = categoryName
    ? categoryName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "All Products";

  // SEO Metadata
  const seoTitle = `${formattedCategoryName} | Ayushaushadhi Herbal Store`;
  const seoDescription = `Shop authentic ${formattedCategoryName} ayurvedic remedies. 100% natural, doctor-formulated products for your wellness.`;
  const canonicalUrl = `https://ayushaushadhi.com/store/category/${categoryName}`;

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`ayurveda ${formattedCategoryName}, herbal medicine, buy ${formattedCategoryName}, natural remedies`}
        canonical={canonicalUrl}
        og={{
          title: seoTitle,
          description: seoDescription,
          type: "website",
          url: canonicalUrl,
        }}
      />

      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/"
                className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/collections"
                className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
              >
                Store
              </Link>
            </li>
            {category && (
              <>
                <li className="text-gray-400">/</li>
                <li
                  className="text-emerald-700 dark:text-emerald-400 font-medium font-serif"
                  aria-current="page"
                >
                  {category.name}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Wellness Collections */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4 border-b border-emerald-50 dark:border-gray-700 pb-3">
                <FaFilter className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                  Collections
                </h2>
              </div>

              <ul className="space-y-1">
                <li>
                  <Link
                    to="/collections"
                    onClick={() => {
                      setCategory(null);
                      setProducts([]);
                    }}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categoryName
                        ? "bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "text-gray-600 hover:bg-emerald-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    View All Remedies
                  </Link>
                </li>
                {allCategories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((cat) => (
                    <li key={cat._id}>
                      <Link
                        to={`/collections/category/${cat.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          category?._id === cat._id
                            ? "bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "text-gray-600 hover:bg-emerald-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-50 font-serif">
                  {category ? category.name : "All Herbal Remedies"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Showing {products.length} authentic products
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <FaLeaf className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  No products found in this collection currently.
                </p>
                <Link
                  to="/collections"
                  className="mt-6 inline-flex items-center px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Product Card Component
const ProductCard = ({ product }) => {
  const [imageState, setImageState] = useState({
    url: "",
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!product.thumbnail) {
        if (isMounted)
          setImageState({ url: "", isLoading: false, hasError: true });
        return;
      }

      try {
        const url = getImageUrl(product.thumbnail);
        if (isMounted)
          setImageState({ url: url, isLoading: true, hasError: false });

        const img = new Image();
        img.onload = () => {
          if (isMounted)
            setImageState({ url: url, isLoading: false, hasError: false });
        };
        img.onerror = () => {
          if (isMounted)
            setImageState({ url: "", isLoading: false, hasError: true });
        };
        img.src = url;
      } catch (error) {
        if (isMounted)
          setImageState({ url: "", isLoading: false, hasError: true });
      }
    };

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [product.thumbnail]);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-emerald-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link
        to={`/collections/${product.slug || product._id}`}
        className="flex flex-col h-full"
      >
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {imageState.isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
          ) : imageState.hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-gray-700 text-emerald-200">
              <FaLeaf className="text-4xl" />
            </div>
          ) : (
            <img
              src={imageState.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              Bestseller
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 font-serif group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center mb-3">
            <div className="flex text-amber-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < (product.rating || 4)
                      ? "text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({product.enrolledStudents || 45} reviews)
            </span>
          </div>

          {/* Bottom Row: Price & Action */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">
                {product.originalPrice > product.price
                  ? formatPrice(product.originalPrice)
                  : null}
              </span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {product.price > 0 ? formatPrice(product.price) : "Free"}
              </span>
            </div>

            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
              <FaShoppingCart className="text-sm" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductsByCategory;
