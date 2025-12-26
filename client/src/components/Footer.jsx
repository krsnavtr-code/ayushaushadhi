import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaLeaf,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-stone-100 dark:bg-gray-900 pt-16 pb-8 overflow-hidden transition-colors duration-300 border-t-4 border-amber-500">
      {/* Decorative Background Leaves (Subtle Overlay) */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 dark:opacity-10 pointer-events-none">
        <FaLeaf className="text-9xl text-emerald-800 dark:text-emerald-400 transform rotate-45" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 opacity-5 dark:opacity-10 pointer-events-none">
        <FaLeaf className="text-9xl text-emerald-800 dark:text-emerald-400 transform -rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex flex-col">
              {/* Logo Area */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 font-serif tracking-tight">
                  Ayush
                  <span className="text-amber-600 dark:text-amber-500">
                    Aushadhi
                  </span>
                </span>
              </Link>
              <span className="text-xs tracking-[0.2em] text-emerald-800/60 dark:text-emerald-400/60 font-semibold mt-1">
                PREMIUM HERBAL CARE
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Rooted in the ancient wisdom of Ayurveda, we bring you 100%
              natural, lab-tested, and doctor-formulated remedies to restore
              balance to your life.
            </p>

            {/* Social Media Pills */}
            <div className="flex space-x-3">
              {[
                { icon: FaWhatsapp, link: "https://wa.me/919891030303" },
                { icon: FaFacebook, link: "https://facebook.com" },
                { icon: FaTwitter, link: "https://twitter.com" },
                { icon: FaLinkedin, link: "https://linkedin.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections Links */}
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 font-serif mb-6">
              Shop Collections
            </h3>
            <ul className="space-y-3">
              {[
                "Immunity Boosters",
                "Digestive Care",
                "Skin & Hair",
                "Pain Relief",
                "Weight Management",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/collections"
                    className="group flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 group-hover:bg-amber-500 mr-2 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 font-serif mb-6">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {[
                { name: "My Account", link: "/profile" },
                { name: "Track Order", link: "/orders" },
                { name: "Shipping Policy", link: "/terms-of-service" },
                { name: "Returns & Refunds", link: "/payment-t-and-c" },
                { name: "Privacy Policy", link: "/privacy-policy" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.link}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 font-serif mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-amber-600 text-xs" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  H-161, BSI Business Park, Sector-63, Noida, UP - 201301
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-amber-600 text-xs" />
                </div>
                <a
                  href="tel:+919891030303"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-700 font-medium"
                >
                  +91 9891030303
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-amber-600 text-xs" />
                </div>
                <a
                  href="mailto:info@ayushaushadhi.com"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-700 font-medium"
                >
                  info@ayushaushadhi.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            &copy; {currentYear} Ayush Aushadhi. Made with{" "}
            <FaHeart className="inline text-red-500 mx-1" /> in India.
          </p>

          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center"
              title="UPI"
            >
              <span className="text-[10px] font-bold text-gray-500">UPI</span>
            </div>
            <div
              className="h-6 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center"
              title="Visa"
            >
              <span className="text-[10px] font-bold text-blue-700 italic">
                VISA
              </span>
            </div>
            <div
              className="h-6 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center"
              title="Mastercard"
            >
              <div className="flex -space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
