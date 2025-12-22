import React, { useState, useEffect } from "react";
import {
  FaLeaf,
  FaUserMd,
  FaCertificate,
  FaArrowRight,
  FaTimes,
  FaQuoteLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

// Placeholder images - You should replace these with your actual assets
const BANNER_IMG =
  "http://ayushaushadhi.com/api/upload/file/img-1766382164512-610533787.png";
const SECONDARY_IMG =
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?q=80&w=2070&auto=format&fit=crop";

// --- Certificate Modal (Kept mostly same, just styled) ---
const CertificateModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleContextMenu = (e) => isOpen && e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#fffbf0] dark:bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full relative border border-amber-200 dark:border-stone-700 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors z-20"
        >
          <FaTimes className="text-2xl" />
        </button>

        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <FaCertificate className="text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 font-serif mb-2">
            Certified Purity
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm mb-8">
            Our manufacturing processes adhere to the strictest AYUSH Ministry
            guidelines.
          </p>

          {/* Certificate Mockup */}
          <div className="relative border-8 border-double border-amber-100 p-6 bg-white shadow-inner mx-auto max-w-xs rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-2 left-2 opacity-10">
              <FaLeaf className="text-6xl text-emerald-800" />
            </div>
            <h4 className="text-lg font-bold text-stone-800 uppercase tracking-widest border-b-2 border-stone-200 pb-2 mb-2">
              GMP Certified
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed font-serif italic">
              "This certifies that Ayush Aushadhi products are manufactured in a
              Good Manufacturing Practice (GMP) compliant facility."
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                100%
                <br />
                PURE
              </div>
              <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                ISO
                <br />
                9001
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Banner Component ---
function Banner() {
  const [productCount, setProductCount] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    // Simulating API or fetching real count
    setProductCount(150);
  }, []);

  return (
    <div className="relative bg-[#fcfbf7] dark:bg-[#111827] overflow-hidden transition-colors duration-300">
      {/* 1. Background Pattern (Subtle Mandala/Texture) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* 2. Organic Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 dark:bg-amber-900/10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 dark:bg-emerald-900/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pt-8 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* --- Left Content --- */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            {/* Brand Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
              <FaLeaf className="text-emerald-500" />
              <span>Est. 2025 • Pure Ayurveda</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-stone-50 font-serif leading-[1.1]">
              Heal naturally with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-200 italic">
                ancient wisdom
              </span>
              .
            </h1>

            {/* Subtext */}
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover {productCount}+ authentic herbal remedies crafted by
              Vaidyas. We bridge the gap between traditional formulation and
              modern lifestyle needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/collections"
                className="group relative px-8 py-4 bg-emerald-800 text-white rounded-full font-semibold shadow-xl hover:bg-emerald-900 transition-all hover:shadow-emerald-900/20 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Remedies{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm rounded-full"></div>
              </Link>

              <button
                onClick={() => setShowCertificate(true)}
                className="px-8 py-4 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-full font-semibold hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCertificate className="text-amber-500" /> View Certifications
              </button>
            </div>

            {/* Mini Trust Signals */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <FaUserMd className="text-emerald-600 text-lg" />
                <span>Doctor Recommended</span>
              </div>
              <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">★</span>
                <span>4.9/5 Ratings</span>
              </div>
            </div>
          </div>

          {/* --- Right Content (Composition Image) --- */}
          <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end">
            {/* Decorative Rotating Circle behind images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-emerald-200/50 dark:border-emerald-700/30 rounded-full animate-[spin_60s_linear_infinite]"></div>

            {/* Main Tall Image with Organic Shape */}
            <div className="relative z-10 w-72 sm:w-80 h-96 sm:h-[500px] rounded-tl-[100px] rounded-br-[100px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src={BANNER_IMG}
                alt="Ayurvedic Lifestyle"
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Secondary Image (Product Closeup) */}
            <div className="absolute bottom-10 left-4 sm:left-10 z-20 w-48 h-48 bg-white dark:bg-stone-800 rounded-full p-2 shadow-xl animate-[bounce_3s_infinite]">
              <img
                src={SECONDARY_IMG}
                alt="Herbal Ingredients"
                className="w-full h-full object-cover rounded-full border-2 border-amber-100 dark:border-stone-600"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                100% Organic
              </div>
            </div>

            {/* Floating Quote Card */}
            <div className="absolute top-10 right-0 sm:-right-6 z-20 bg-white/90 dark:bg-stone-800/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px] border border-stone-100 dark:border-stone-700 hidden sm:block">
              <FaQuoteLeft className="text-emerald-200 text-xl mb-2" />
              <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic">
                "Ayurveda is the science of life, a knowledge passed down from
                the gods."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Glass Bar (Features) --- */}
      <div className="relative z-20 -mt-12 mx-4">
        <div className="max-w-5xl mx-auto bg-white/70 dark:bg-stone-800/70 backdrop-blur-md border border-white/50 dark:border-stone-700 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-wrap justify-between items-center gap-6">
          {[
            { icon: FaLeaf, title: "100% Natural", sub: "No Chemicals" },
            {
              icon: FaUserMd,
              title: "Expert Support",
              sub: "Free Consultation",
            },
            { icon: FaCertificate, title: "Lab Tested", sub: "Safety Assured" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 min-w-[200px] mx-auto sm:mx-0"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <item.icon className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
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
