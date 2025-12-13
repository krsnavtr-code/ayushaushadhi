import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaBoxOpen,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaBlog,
  FaQuestionCircle,
  FaImages,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaHandHoldingMedical,
  FaPaperPlane,
} from "react-icons/fa";

const AdminLayout = () => {
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      console.log("AdminLayout - Logging out");
      if (logout) await logout(); // Ensure logout exists in context
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Admin Protection Check
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in with administrator privileges.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center px-6 py-3.5 transition-all duration-200 group ${
        isActive(to)
          ? "bg-emerald-800 text-white border-r-4 border-amber-400"
          : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
      }`}
    >
      <Icon
        className={`h-5 w-5 mr-3 ${
          isActive(to)
            ? "text-amber-400"
            : "text-emerald-300 group-hover:text-white"
        }`}
      />
      <span className="font-medium tracking-wide text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-emerald-900 text-white w-64 flex-shrink-0 flex flex-col h-screen shadow-2xl z-20">
        {/* Admin Header */}
        <div className="p-6 border-b border-emerald-800 bg-emerald-950">
          <h1 className="text-xl font-bold text-white font-serif tracking-wider">
            Ayush <span className="text-amber-400">Admin</span>
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center text-amber-300 font-bold border border-emerald-600">
              {currentUser?.fullname?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.fullname || "Administrator"}
              </p>
              <p className="text-xs text-emerald-400 uppercase tracking-widest">
                Super Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
          <div className="mb-2 px-6 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Overview
          </div>
          <NavItem to="/admin/dashboard" icon={FaHome} label="Dashboard" />

          <div className="mt-6 mb-2 px-6 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Store Management
          </div>
          {/* Note: Mapping '/collections' to Products as per your API structure */}
          <NavItem
            to="/admin/collections"
            icon={FaBoxOpen}
            label="Products (Courses)"
          />
          <NavItem to="/admin/categories" icon={FaList} label="Collections" />
          <NavItem
            to="/admin/enrollments"
            icon={FaShoppingCart}
            label="Orders"
          />
          <NavItem
            to="/admin/payments"
            icon={FaFileInvoiceDollar}
            label="Transactions"
          />

          <div className="mt-6 mb-2 px-6 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Users & Support
          </div>
          <NavItem to="/admin/users" icon={FaUsers} label="Customers" />
          <NavItem
            to="/admin/contacts"
            icon={FaHandHoldingMedical}
            label="Consultations"
          />
          <NavItem to="/admin/candidates" icon={FaUsers} label="Distributors" />

          <div className="mt-6 mb-2 px-6 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Content
          </div>
          <NavItem to="/admin/blog" icon={FaBlog} label="Wellness Blog" />
          <NavItem to="/admin/faqs" icon={FaQuestionCircle} label="FAQs" />
          <NavItem
            to="/admin/image-gallery"
            icon={FaImages}
            label="Media Gallery"
          />
          <NavItem
            to="/admin/send-brochure"
            icon={FaPaperPlane}
            label="Send Newsletter"
          />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-emerald-800 bg-emerald-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-emerald-800 hover:bg-red-600 text-emerald-100 hover:text-white rounded-lg transition-colors duration-200 gap-2 text-sm font-medium"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Optional - good for mobile toggles or breadcrumbs) */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            {location.pathname.split("/")[2]?.charAt(0).toUpperCase() +
              location.pathname.split("/")[2]?.slice(1) || "Dashboard"}
          </h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
