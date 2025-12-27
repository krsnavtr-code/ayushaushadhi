import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSun,
  FaMoon,
  FaSearch,
  FaUser,
  FaTimes,
  FaBars,
  FaSignInAlt,
  FaShoppingBag,
} from "react-icons/fa";
import CourseMenu from "./CourseMenu";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";
import api from "../api/axios";
import PaymentForm from "./PaymentForm";

function Navbar() {
  const { authUser, isAuthenticated, isAdmin, isApproved, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const LOGO_URL = "/assets/Ayush-Aushadhi-Logo-Fit.png";
  const navigate = useNavigate();
  const location = useLocation();

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    courses: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);

  // --- Theme Effect ---
  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  // --- Click Outside Listeners ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest("#user-menu-container")) {
        setIsProfileMenuOpen(false);
      }
      if (
        showResults &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
      if (
        isCategoryMenuOpen &&
        !event.target.closest("#category-menu-container")
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen, showResults, isCategoryMenuOpen]);

  // --- Search Logic (Debounced) ---
  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults({ courses: [], categories: [] });
        return;
      }
      try {
        setIsSearching(true);
        const response = await api.get("/collections", {
          params: { search: query, limit: 10 },
        });
        const courses = response?.data?.data || response?.data || [];
        setSearchResults({
          courses: Array.isArray(courses) ? courses : [],
          categories: [],
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setShowResults(true);
      handleSearch(query);
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = (item) => {
    navigate(`/collections/${item.slug || item._id}`);
    setShowResults(false);
    setSearchQuery("");
  };

  // --- Navigation Links Configuration ---
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Herbal Store" },
    { to: "/blog", label: "Wellness Journal" },
    { to: "/about", label: "Our Story" },
    { to: "/contact", label: "Contact" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin Panel", special: true }] : []),
  ];

  return (
    <>
      <div className="flex flex-col w-full z-50 sticky top-0 shadow-md">
        {/* =================================================================
            ROW 1: PRIMARY HEADER (Logo, Search, Actions)
            ================================================================= */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 h-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
            {/* 1. Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>

              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src={LOGO_URL}
                  alt="Ayush Logo"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden flex-col leading-tight">
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-400 font-serif">
                    Ayush
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 tracking-widest uppercase">
                    Aushadhi
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Search Bar (Centered & Wide) */}
            <div className="flex-1 max-w-2xl relative mx-4" ref={searchRef}>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for herbs, remedies..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchQuery) setShowResults(true);
                  }}
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
                {isSearching && (
                  <div className="absolute right-4 top-3.5 animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                )}
              </div>

              {/* Search Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  {searchResults.courses.length > 0 ? (
                    searchResults.courses.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => handleResultClick(item)}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-3 border-b border-gray-50 dark:border-gray-700 last:border-0 group"
                      >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden shrink-0">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            // Fallback icon if no image
                            <div className="w-full h-full flex items-center justify-center text-emerald-300">
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.category?.name || "Product"}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Right Actions (Theme, Cart, User) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <FaSun className="text-amber-400" />
                ) : (
                  <FaMoon className="text-emerald-700" />
                )}
              </button>

              {/* Cart Button (Placeholder) */}
              <button className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative hidden sm:block">
                <FaShoppingBag />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>

              {/* User Profile */}
              {isAuthenticated ? (
                <div className="relative" id="user-menu-container">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      <FaUser />
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden animate-fade-in-up z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/my-learning"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        My Orders
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white text-sm font-medium rounded-full hover:bg-emerald-900 transition-all shadow-md hover:shadow-emerald-900/20"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* =================================================================
            ROW 2: SECONDARY NAVIGATION (Bottom Nav)
            ================================================================= */}
        <div className="bg-emerald-900 text-white h-12 shadow-inner relative z-40 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            {/* 1. Shop By Category Dropdown */}
            <div className="relative h-full flex" id="category-menu-container">
              <CourseMenu />
            </div>

            {/* 2. Horizontal Nav Links */}
            <nav className="flex items-center gap-1 ml-4 h-full overflow-x-auto no-scrollbar">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`h-full flex items-center px-4 text-sm font-medium transition-colors border-b-2 ${
                    location.pathname === link.to
                      ? "border-amber-400 text-amber-400 bg-emerald-800/50"
                      : "border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800"
                  } ${
                    link.special ? "text-amber-300 hover:text-amber-200" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 3. Right Side Promo/Link */}
            <div className="ml-auto hidden xl:block text-xs font-medium text-emerald-300">
              Free Shipping on Orders Over ₹999
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          MOBILE MENU DRAWER
          ================================================================= */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Drawer Content */}
        <div
          className={`absolute top-0 left-0 w-[80%] max-w-sm h-full bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div className="p-5 bg-emerald-900 text-white flex justify-between items-center">
            <div className="font-bold text-lg flex items-center gap-2">
              <FaUser className="text-emerald-300" />
              {isAuthenticated
                ? `Hi, ${authUser?.fullname?.split(" ")[0]}`
                : "Welcome, Guest"}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-emerald-800 rounded-full"
            >
              <FaTimes />
            </button>
          </div>

          {/* Links Area */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Main Links */}
            <div className="px-4 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Menu
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg mb-1 text-sm font-medium ${
                    location.pathname === link.to
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <hr className="border-gray-100 dark:border-gray-800 my-2" />

            {/* Categories */}
            <div className="px-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Shop by Category
              </p>
              <CourseMenu
                isMobile={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>

          {/* Mobile Footer */}
          {!isAuthenticated && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-3 bg-emerald-800 text-white rounded-lg font-bold"
              >
                Log In / Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-emerald-900/80 backdrop-blur-sm">
          <PaymentForm onClose={() => setShowPaymentForm(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
