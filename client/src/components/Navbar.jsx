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
  FaLeaf, // Added for Ayurveda vibe
  FaCreditCard,
  FaCopy,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
// NOTE: You might want to rename this component to ProductMenu or CategoryMenu later
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
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const dropdownRef = useRef(null);

  // Logo path - Ensure the image is in your public folder
  const LOGO_URL = "/assets/Ayush-Aushadhi-Logo-Fit.png";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("[data-payment-button]")
      ) {
        setShowPaymentDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handlePaymentClick = () => {
    setShowPaymentForm(true);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById("user-menu");
      const profileButton = document.querySelector('[aria-label="User menu"]');

      if (
        profileMenu &&
        profileButton &&
        !profileMenu.contains(event.target) &&
        !profileButton.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      const mobileMenu = document.querySelector(".mobile-menu-container");
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');

      if (
        mobileMenu &&
        menuButton &&
        isMobileMenuOpen &&
        !mobileMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleModalClick = (event) => {
      const modals = document.querySelectorAll("dialog[open]");
      modals.forEach((modal) => {
        if (!modal.contains(event.target) && event.target !== modal) {
          modal.close();
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleModalClick);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleModalClick);
    };
  }, [isMobileMenuOpen]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    courses: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const element = document.documentElement;

  useEffect(() => {
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

  // Handle search input change with debounce
  const handleSearch = debounce(async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchResults({ courses: [], categories: [] });
      return;
    }

    try {
      setIsSearching(true);
      // NOTE: Assuming API still uses '/courses' endpoint, even if we display "Products"
      const response = await api.get("/courses", {
        params: {
          search: trimmedQuery,
          limit: 10,
        },
      });

      const courses = response?.data?.data || response?.data || [];

      setSearchResults({
        courses: Array.isArray(courses) ? courses : [],
        categories: [],
      });
    } catch (error) {
      console.error("Search error:", error);
      if (error.response?.status !== 404 && error.response?.status !== 500) {
        toast.error("Error fetching results. Using local search.");
      }
      handleClientSideSearch(trimmedQuery);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const handleClientSideSearch = async (query) => {
    try {
      const response = await api.get("/courses", { params: { limit: 50 } });
      const allCourses = Array.isArray(response?.data)
        ? response?.data
        : response?.data?.data || [];

      if (!allCourses?.length) {
        setSearchResults({ courses: [], categories: [] });
        return;
      }

      const searchLower = query.toLowerCase();
      const filtered = allCourses.filter((course) => {
        if (!course) return false;
        return (
          (course?.title && course.title.toLowerCase().includes(searchLower)) ||
          (course?.description &&
            course.description.toLowerCase().includes(searchLower)) ||
          (course?.category?.name &&
            course.category.name.toLowerCase().includes(searchLower))
        );
      });

      setSearchResults({
        courses: filtered,
        categories: [],
      });
    } catch (error) {
      console.error("Client-side search error:", error);
      if (error.response?.status !== 404) {
        toast.error("Error fetching products. Please try again later.");
      }
      setSearchResults({ courses: [], categories: [] });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      handleSearch(query);
    } else {
      setSearchResults({ courses: [], categories: [] });
    }
  };

  const handleResultClick = (type, item) => {
    if (!item) return;

    if (type === "course") {
      const courseId = item.slug || item._id;
      if (courseId) {
        const path = `/course/${courseId}`; // You might want to change this to /product/ later
        navigate(path);
        resetSearch();
      }
    } else if (type === "category" && item._id) {
      navigate(`/courses/category/${item._id}`);
      resetSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults({ courses: [], categories: [] });
    setShowResults(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      if (searchResults.courses.length > 0) {
        handleResultClick("course", searchResults.courses[0]);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        resetSearch();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        if (!event.target.closest(".search-icon-container")) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleScroll = useCallback(() => {
    const navbar = document.getElementById("main-navbar");
    if (!navbar) return;

    if (window.scrollY > 10) {
      navbar.classList.add(
        "shadow-md",
        "bg-white/90",
        "dark:bg-gray-900/90",
        "backdrop-blur-md",
        "border-b",
        "border-emerald-100",
        "dark:border-emerald-900"
      );
      navbar.classList.remove("bg-white", "dark:bg-gray-900");
    } else {
      navbar.classList.remove(
        "shadow-md",
        "bg-white/90",
        "dark:bg-gray-900/90",
        "backdrop-blur-md",
        "border-b",
        "border-emerald-100",
        "dark:border-emerald-900"
      );
      navbar.classList.add("bg-white", "dark:bg-gray-900");
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Updated Navigation Items for Ayurveda Store
  const navItems = [
    { to: "/herbal-store", label: "Herbal Store" }, // Renamed from Free Courses
    ...(isAdmin ? [{ to: "/admin", label: "Admin Panel" }] : []),
  ];

  const renderNavItems = (className = "") => (
    <div className="flex items-center gap-1">
      {/* Home */}
      <Link
        to="/"
        className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
          false
            ? "text-emerald-900 dark:text-emerald-50 bg-emerald-100 dark:bg-emerald-900/30"
            : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-emerald-900/20"
        } ${className}`}
      >
        Home
      </Link>

      {/* Course/Product Menu */}
      <CourseMenu className={className} />

      {/* Other navigation items */}
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap flex items-center ${
            "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-emerald-900/20"
          } ${className}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Navbar */}
      <div
        className="z-50 transition-all duration-300 bg-white dark:bg-gray-900 h-20 sticky top-0 left-0 right-0 border-b border-transparent"
        id="main-navbar"
      >
        {/* Desktop Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button */}
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-emerald-800 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <span className="sr-only">Open main menu</span>
                <FaBars
                  className={`block h-6 w-6 ${
                    isMobileMenuOpen ? "hidden" : "block"
                  }`}
                  aria-hidden="true"
                />
                <FaTimes
                  className={`h-6 w-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
                  aria-hidden="true"
                />
              </button>

              {/* BRAND LOGO SECTION */}
              <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                <Link to="/" className="flex items-center gap-2 group">
                  {/* Image Logo */}
                  <img
                    src={LOGO_URL}
                    alt="Ayush Aushadhi Logo"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  {/* Text Fallback (Hidden by default if image loads) */}
                  <div className="hidden flex-col items-start leading-tight">
                    <span className="text-xl font-bold text-emerald-900 dark:text-emerald-400 font-serif tracking-wide">
                      Ayush
                    </span>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-500 tracking-wider">
                      AUSHADHI
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex md:items-center xl:ml-8 lg:ml-6">
                <div className="flex-shrink-0">{renderNavItems()}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(!isSearchOpen);
                      if (!isSearchOpen) {
                        setTimeout(() => {
                          searchInputRef.current?.focus();
                        }, 0);
                      }
                    }}
                    className="p-2 rounded-full text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:text-white dark:hover:bg-emerald-900/30 focus:outline-none transition-colors duration-200 search-icon-container"
                    aria-label="Search"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Dropdown */}
                <div
                  className={`absolute right-0 mt-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-emerald-100 dark:border-gray-700 transition-all duration-200 ease-in-out transform ${
                    isSearchOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  style={{ zIndex: 50 }}
                >
                  <form onSubmit={handleSearchSubmit} className="relative p-2">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setShowResults(false);
                            setIsSearchOpen(false);
                          }
                        }}
                        className="w-full px-4 py-2.5 pl-10 pr-8 rounded-lg border border-emerald-200 dark:border-gray-600 bg-emerald-50/50 dark:bg-gray-700/50 text-emerald-900 dark:text-gray-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        placeholder="Search herbal products..."
                        aria-label="Search courses"
                        autoComplete="off"
                      />
                      <FaSearch className="absolute left-3 top-3.5 text-emerald-400" />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setSearchResults({ courses: [], categories: [] });
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-2 top-3 text-emerald-400 hover:text-emerald-600"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Search Results */}
                    {showResults && searchQuery.trim() && (
                      <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg max-h-80 overflow-y-auto custom-scrollbar">
                        {isSearching ? (
                          <div className="p-4 text-center text-emerald-500 text-sm">
                            Looking for remedies...
                          </div>
                        ) : searchResults.courses.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No products found matching "{searchQuery}"
                          </div>
                        ) : (
                          <>
                            {searchResults.courses.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider bg-amber-50 dark:bg-amber-900/10">
                                  Products
                                </div>
                                {searchResults.courses.map((course) => (
                                  <button
                                    key={course._id}
                                    onClick={() => {
                                      handleResultClick("course", course);
                                      setIsSearchOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150 flex items-center group"
                                  >
                                    <FaLeaf className="text-emerald-300 mr-3 group-hover:text-emerald-500 transition-colors" />
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-900 dark:group-hover:text-emerald-100">
                                      {course.title}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-white p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors duration-200"
              >
                {theme === "dark" ? (
                  <FaSun className="w-5 h-5" />
                ) : (
                  <FaMoon className="w-5 h-5" />
                )}
              </button>

              {/* Payment Dropdown */}
              {/* <div className="relative hidden lg:block md:block">
                <button
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 shadow-md transition-all"
                  onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                  data-payment-button="true"
                >
                  Quick Pay
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      showPaymentDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showPaymentDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="p-2">
                      <button
                        onClick={handlePaymentClick}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        role="menuitem"
                      >
                        <span>
                          Pay via{" "}
                          <span className="text-blue-600 font-bold">
                            Razorpay
                          </span>
                        </span>
                        <FaCreditCard className="text-emerald-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative ml-2">
                  <button
                    type="button"
                    className="flex items-center focus:outline-none"
                    onClick={toggleProfileMenu}
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-200 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                      <FaUser />
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      id="user-menu"
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-emerald-100 dark:border-gray-700"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                          Hello,
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {authUser?.email || "User"}
                        </p>
                      </div>

                      <Link
                        to="/my-learning"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-emerald-900/30"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Orders / Learning
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-emerald-900/30"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>

                      {!isApproved && (
                        <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 mx-2 rounded-md my-1">
                          <FaExclamationCircle />
                          Verification Pending
                        </div>
                      )}
                      {isApproved && (
                        <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 mx-2 rounded-md my-1">
                          <FaCheck />
                          Account Verified
                        </div>
                      )}

                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                            navigate("/");
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center ml-2">
                  <Link
                    to="/login"
                    state={{ from: location }}
                    className="flex items-center px-4 py-2 text-sm font-bold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors duration-200 shadow-md"
                  >
                    <FaSignInAlt className="mr-1.5" />
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mobile-menu-container md:hidden fixed inset-0 top-20 bg-white dark:bg-gray-900 shadow-lg z-40 overflow-y-auto transition-all duration-300 ease-in-out transform ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100 visible"
              : "-translate-x-full opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 px-4 py-3 space-y-2">
              <Link
                to="/"
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors duration-200 ${
                  location.pathname === "/"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>

              {/* Course Menu - Mobile Version */}
              <div className="mobile-course-menu mt-4">
                <CourseMenu isMobile={true} onItemClick={toggleMobileMenu} />
              </div>

              {/* Other Navigation Items */}
              {navItems.map(
                (item) =>
                  !item.lmscolors && (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors duration-200 ${
                        location.pathname === item.to
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "text-gray-700 hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {item.label}
                    </Link>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-emerald-900/80 backdrop-blur-sm">
            <PaymentForm onClose={() => setShowPaymentForm(false)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
