import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBan, FaLeaf, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const SuspendedAccount = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-0 left-0 text-[10rem] text-emerald-100 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <FaLeaf className="absolute bottom-0 right-0 text-[10rem] text-amber-100 dark:text-amber-900/10 transform rotate-12 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-gray-700 p-8 text-center relative z-10">
        {/* Suspended Icon Animation */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 shadow-inner">
          <FaBan className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
          Account Suspended
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm">
          Your account has been deactivated due to policy violations or security
          reasons. Please contact our support team for assistance.
        </p>

        <div className="space-y-4">
          <button
            onClick={() =>
              (window.location.href = "mailto:info@ayushaushadhi.com")
            }
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-1"
          >
            <FaEnvelope /> Contact Support
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt /> Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccount;
