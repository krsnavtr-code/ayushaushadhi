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
  FaExclamationTriangle,
  FaInfoCircle,
  FaPills,
  FaClock,
} from "react-icons/fa";
import { formatPrice } from "../../utils/format";
import { getImageUrl } from "../../utils/imageUtils";
import PaymentForm from "../../components/PaymentForm";
import axios from "axios";
import { AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const downloadBrochure = async () => {
    if (!product?.brochureUrl) {
      toast.error("Brochure not available");
      return;
    }
    const toastId = toast.loading("Downloading brochure...");
    try {
      const response = await axios.get(
        `/api/collections/${product._id}/download-brochure`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${product.slug}-brochure.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Download complete", { id: toastId });
    } catch (error) {
      toast.error("Download failed", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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

  const specs = product.additionalInfo || {};
  const ingredients =
    product.ingredients && product.ingredients.length > 0
      ? product.ingredients
      : product.prerequisites || [];
  const warnings = product.warnings || [];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <SEO
        title={`${product.title} - Authentic Ayurveda | Ayushaushadhi`}
        description={product.shortDescription}
        image={getImageUrl(product.thumbnail)}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500 dark:text-gray-400">
          <Link
            to="/"
            className="hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            Home
          </Link>{" "}
          /
          <Link
            to="/collections"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 ml-1"
          >
            Store
          </Link>{" "}
          /
          <span className="ml-1 text-gray-800 dark:text-gray-200 font-medium">
            {product.title}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT COLUMN: IMAGES (Sticky) */}
          <div className="lg:w-1/2">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 group">
                <img
                  src={getImageUrl(product.thumbnail)}
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

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                <div className="flex flex-col items-center text-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-emerald-50 dark:border-gray-700">
                  <FaLeaf className="text-emerald-600 dark:text-emerald-400 text-xl" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    100% Herbal
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-emerald-50 dark:border-gray-700">
                  <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    Quality Assured
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-emerald-50 dark:border-gray-700">
                  <FaTruck className="text-amber-600 dark:text-amber-400 text-xl" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-emerald-50 dark:border-gray-700">
                  <FaBoxOpen className="text-purple-600 dark:text-purple-400 text-xl" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS & CONTENT */}
          <div className="lg:w-1/2 flex flex-col gap-10">
            {/* 1. Header & Purchase Info */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wide uppercase bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                  {product.category?.name || "Herbal Supplement"}
                </span>
                {specs.form && (
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-xs tracking-wide uppercase bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded flex items-center gap-1">
                    <FaPills className="text-[10px]" /> {specs.form}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif mb-2 leading-tight">
                {product.title}
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                By{" "}
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {product.instructor || "Ayushaushadhi"}
                </span>
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < (product.rating || 4)
                          ? "text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4">
                  {product.reviews?.length || 45} Reviews
                </span>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              {/* Price Block */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-emerald-100 dark:border-gray-700 shadow-sm mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">
                    {product.price > 0 ? formatPrice(product.price) : "Free"}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through mb-1">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-1 rounded mb-4">
                  <FaCheckCircle /> Inclusive of all taxes
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 w-max">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold w-12 text-center text-gray-900 dark:text-white">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-emerald-800 dark:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-900 dark:hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>

                  <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <FaHeart size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Specs */}
              {specs.shelfLife && (
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6 bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/50">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-600 dark:text-amber-500" />
                    <span className="font-semibold">Shelf Life:</span>{" "}
                    {specs.shelfLife}
                  </div>
                  {specs.packagingSize && (
                    <div className="flex items-center gap-2">
                      <FaBoxOpen className="text-amber-600 dark:text-amber-500" />
                      <span className="font-semibold">Pack:</span>{" "}
                      {specs.packagingSize}
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* 2. Description & Benefits */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-4">
                Product Overview
              </h3>
              <div
                // Added: dark:[&_*]:!text-gray-300
                // This forces ALL children elements (*) in dark mode to use gray-300, overriding inline styles
                className="dark:[&_*]:!text-white [&_*]:!bg-transparent"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description ||
                    "<p>No detailed description available.</p>",
                }}
              />

              {product.benefits?.length > 0 && (
                <div className="bg-stone-50 dark:bg-gray-800 p-6 rounded-xl border border-stone-100 dark:border-gray-700">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Key Health Benefits
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {product.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* 3. Ingredients */}
            {ingredients.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-6">
                  Natural Ingredients
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 border border-emerald-50 dark:border-gray-700 bg-emerald-50/20 dark:bg-gray-800 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-sm shrink-0">
                        <FaLeaf />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* 4. Dosage & Usage */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif mb-6">
                Dosage & Direction of Use
              </h3>

              {specs.directionOfUse && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                  <p className="font-bold text-amber-900 dark:text-amber-400 text-sm uppercase tracking-wide mb-1">
                    Recommended Dosage
                  </p>
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    {specs.directionOfUse}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {product.curriculum?.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {step.description}
                        </p>
                      )}
                      {step.topics?.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1 ml-1">
                          {step.topics.map((topic, tIdx) => (
                            <li key={tIdx}>{topic}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* 5. Safety & Specs */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Safety */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500" /> Safety
                  Information
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-5">
                  <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200 space-y-2">
                    {warnings.length > 0 ? (
                      warnings.map((warn, i) => <li key={i}>{warn}</li>)
                    ) : (
                      <li>
                        No specific warnings. Consult physician if unsure.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Storage & More Specs */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-500" /> Additional Info
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 space-y-3">
                  {product.storage && (
                    <div>
                      <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase block mb-1">
                        Storage
                      </span>
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        {product.storage}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-800 dark:text-blue-300 font-semibold">
                          Country:
                        </span>{" "}
                        <span className="text-blue-900 dark:text-blue-200">
                          {specs.countryOfOrigin}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-800 dark:text-blue-300 font-semibold">
                          Type:
                        </span>{" "}
                        <span className="text-blue-900 dark:text-blue-200">
                          {specs.typeOfSupplement || "Dietary Supplement"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brochure Download */}
            {product.brochureUrl && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={downloadBrochure}
                  className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold hover:underline bg-emerald-50 dark:bg-emerald-900/30 px-6 py-3 rounded-full transition-colors"
                >
                  <FaFilePdf /> Download Product Leaflet
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
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
