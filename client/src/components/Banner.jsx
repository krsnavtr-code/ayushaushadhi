import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaLeaf, // Changed from Book
  FaUserMd, // Changed from Users
  FaCertificate,
  FaArrowRight,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Banner.css";
// Ensure typography.css exists or remove this import
import "../styles/typography.css";

// Placeholder for a Hero Banner Image (e.g., herbs, bottles, lifestyle)
// You should upload a banner image to your public/assets folder
const BANNER_IMG =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2084&auto=format&fit=crop";
// Using the logo path you shared earlier
const LOGO_IMG = "/assets/Ayush-Aushadhi-Logo-Fit.png";

const CertificateModal = ({ isOpen, onClose }) => {
  // Prevent right-click context menu to protect certificate image
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (isOpen) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[550px] w-full max-h-[550px] overflow-auto relative border border-emerald-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 z-20 transition-colors"
        >
          <FaTimes className="text-2xl" />
        </button>
        <div className="p-8 relative">
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-50 mb-2 font-serif">
            Quality Assurance
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Our products are GMP certified and lab tested for purity.
          </p>

          {/* Certificate Image Container */}
          <div className="relative rounded-lg overflow-hidden border-4 border-double border-amber-200 dark:border-amber-700 bg-amber-50">
            {/* Watermark Overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(217, 119, 6, 0.05) 10px, rgba(217, 119, 6, 0.05) 20px)",
              }}
            >
              <div className="text-3xl font-bold text-amber-900 opacity-10 transform -rotate-45 select-none border-4 border-amber-900/10 p-4 rounded">
                AYUSH CERTIFIED
              </div>
            </div>

            {/* Placeholder for Certificate Image */}
            <div className="w-full aspect-[4/3] bg-white flex flex-col items-center justify-center text-center p-4">
              <FaCertificate className="text-6xl text-amber-500 mb-4" />
              <h4 className="text-xl font-bold text-gray-800 font-serif">
                Certificate of Authenticity
              </h4>
              <p className="text-gray-500 text-sm mt-2">
                100% Herbal Formulation
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                  GMP Certified
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">
                  ISO 9001:2015
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Banner() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchProductCount = async () => {
      // NOTE: Adjust endpoint to your actual product endpoint
      const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:4002/api";
      try {
        // Keeping '/courses' for now as per your backend, but conceptually these are products
        const response = await axios.get(`${API_URL}/courses?fields=_id`);
        setProductCount(response.data.length + 50); // Adding base number for display
      } catch (error) {
        console.error("Error fetching count:", error);
        setProductCount(100); // Fallback number
      }
    };

    fetchProductCount();
  }, []);

  const [showCertificate, setShowCertificate] = useState(false);

  const features = [
    {
      icon: (
        <FaLeaf className="text-2xl text-emerald-600 dark:text-emerald-400" />
      ),
      title: `${productCount}+ Herbal Products`,
      desc: "100% Natural Ingredients",
    },
    {
      icon: (
        <FaUserMd className="text-2xl text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Ayurvedic Experts",
      desc: "Formulated by Doctors",
    },
    {
      icon: (
        <FaCertificate className="text-2xl text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Certified Quality",
      desc: "GMP & ISO Certified",
      onClick: () => setShowCertificate(true),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-12 lg:py-20 transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl dark:bg-emerald-900/20"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl dark:bg-amber-900/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-4 w-full">
              {/* Logo & Brand Name */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <img
                  src={LOGO_IMG}
                  alt="Ayush Aushadhi Logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span className="text-lg font-bold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
                  Ayush Aushadhi
                </span>
              </div>

              {/* Headlines */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight font-serif">
                <span className="block">Rediscover</span>
                <span className="block text-emerald-700 dark:text-emerald-400">
                  Nature's Healing
                </span>
                <span className="block text-amber-600 dark:text-amber-500 text-3xl sm:text-4xl mt-2">
                  Power
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the ancient wisdom of Ayurveda with our authentic,
              hand-crafted herbal remedies. Holistic wellness for a balanced
              life.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={feature.onClick}
                  className={`flex items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-emerald-300 ${
                    feature.onClick
                      ? "cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-3">
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/courses"
                className="group bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-700/30 flex items-center w-full sm:w-auto justify-center"
              >
                <span>Shop Remedies</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/about"
                className="bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-gray-700 px-8 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 w-full sm:w-auto flex justify-center"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0 relative">
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-500">
              <img
                src={BANNER_IMG}
                alt="Ayurvedic Wellness"
                className="w-full h-auto object-cover aspect-[4/3]"
              />

              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    Trusted By
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    10,000+ Customers
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
    </div>
  );
}

export default Banner;
