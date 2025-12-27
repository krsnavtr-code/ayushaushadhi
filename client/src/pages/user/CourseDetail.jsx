import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import { getCourseById } from "../../api/courseApi"; 
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  FaStar,
  FaLeaf,
  FaFilePdf,
  FaShareAlt,
  FaShoppingCart,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaBoxOpen,
  FaHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../utils/format";
import { getImageUrl } from "../../utils/imageUtils";
import PaymentForm from "../../components/PaymentForm";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [qty, setQty] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getCourseById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          throw new Error(response.message || "Failed to load product");
        }
      } catch (error) {
        toast.error("Product not found");
        navigate("/collections");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, qty });
    toast.success(`${product.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <SEO
        title={`${product.title} - Product Details | Authentic Ayurveda | Ayushaushadhi`}
        description={product.shortDescription}
        image={getImageUrl(product.thumbnail)}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-emerald-600">
            Home
          </Link>{" "}
          /
          <Link to="/collections" className="hover:text-emerald-600 ml-1">
            Store
          </Link>{" "}
          /
          <span className="ml-1 text-gray-800 font-medium">
            {product.title}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Images */}
          <div className="lg:w-1/2">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white group">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                    Bestseller
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails / Gallery Placeholder */}
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                <div className="w-20 h-20 rounded-lg border-2 border-emerald-500 overflow-hidden cursor-pointer">
                  <img
                    src={product.thumbnail}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Map other images here if available */}
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:w-1/2">
            <div className="mb-2">
              <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase bg-emerald-50 px-2 py-1 rounded">
                {product.category?.name || "Herbal Remedy"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-3 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
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
              <span className="text-sm text-gray-500">
                ({product.reviews?.length || 45} Reviews)
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FaCheckCircle className="text-emerald-500" /> In Stock
              </span>
            </div>

            {/* Price Block */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-8">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-emerald-800">
                  {product.price > 0 ? formatPrice(product.price) : "Free"}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Inclusive of all taxes. Free shipping on orders above ₹999.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.shortDescription ||
                "Experience the healing power of nature with this authentic Ayurvedic formulation. Crafted with care to restore balance and vitality."}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white w-max">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 font-bold w-12 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                onClick={() => {
                  /* Wishlist Logic */
                }}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-red-500 transition-colors"
              >
                <FaHeart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <FaLeaf />
                </div>
                <span className="text-xs font-bold text-gray-600">
                  100% Natural
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <FaShieldAlt />
                </div>
                <span className="text-xs font-bold text-gray-600">
                  Quality Assured
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <FaTruck />
                </div>
                <span className="text-xs font-bold text-gray-600">
                  Fast Delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <FaBoxOpen />
                </div>
                <span className="text-xs font-bold text-gray-600">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {["overview", "ingredients", "usage", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                    ${
                      activeTab === tab
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab === "usage" ? "Usage Guide" : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8 animate-fade-in">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="prose prose-emerald max-w-none text-gray-600">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description ||
                      "<p>No detailed description available.</p>",
                  }}
                />

                {product.whatYouWillLearn?.length > 0 && (
                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <h3 className="text-xl font-bold text-gray-900 col-span-full font-serif mb-2">
                      Key Health Benefits
                    </h3>
                    {product.whatYouWillLearn.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                      >
                        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-emerald-900">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ingredients Tab (Formerly Prerequisites/Skills) */}
            {activeTab === "ingredients" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">
                  Key Ingredients
                </h3>
                {product.prerequisites?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {product.prerequisites.map((ing, idx) => (
                      <div
                        key={idx}
                        className="text-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400">
                          <FaLeaf /> {/* Placeholder for ingredient image */}
                        </div>
                        <p className="font-bold text-gray-800">{ing}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Ingredients list coming soon.
                  </p>
                )}
              </div>
            )}

            {/* Usage Guide Tab (Formerly Curriculum) */}
            {activeTab === "usage" && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">
                  How to Use
                </h3>
                <div className="space-y-6">
                  {product.curriculum?.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {step.description}
                        </p>
                        {step.topics?.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                            {step.topics.map((topic, tIdx) => (
                              <li key={tIdx}>{topic}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500">
                      Usage instructions will be updated soon.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab (Placeholder) */}
            {activeTab === "reviews" && (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <FaStar className="text-amber-400 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Customer Reviews
                </h3>
                <p className="text-gray-500 mb-6">
                  Be the first to review this product!
                </p>
                <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showPaymentForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <PaymentForm
              onClose={() => setShowPaymentForm(false)}
              courseId={product._id}
              courseName={product.title}
              price={product.price}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
