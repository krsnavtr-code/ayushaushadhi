import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHourglassHalf,
  FaLeaf,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import SEO from "../components/SEO";

const PendingApproval = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* SEO */}
      <SEO
        title="Approval Pending | Ayushaushadhi"
        description="Your request is currently under review. The Ayushaushadhi team is verifying your details and will notify you once approval is completed."
        keywords="approval pending, ayushaushadhi verification, account under review, request pending, approval status"
        og={{
          title: "Approval Pending - Ayushaushadhi",
          description:
            "Your account or request is under review. Please wait while our team completes the approval process.",
          type: "website",
        }}
      />
      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-0 left-0 text-[10rem] text-emerald-100 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <FaLeaf className="absolute bottom-0 right-0 text-[10rem] text-amber-100 dark:text-amber-900/10 transform rotate-12 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-amber-100 dark:border-gray-700 p-8 text-center relative z-10">
        {/* Pending Icon Animation */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-amber-50 dark:bg-amber-900/20 mb-6 shadow-inner">
          <FaHourglassHalf className="h-10 w-10 text-amber-500 dark:text-amber-400 animate-pulse" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
          Verification Pending
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm">
          Your account is currently under review by our administrators. Please
          check back later or contact support if this takes longer than 24
          hours.
        </p>

        <div className="space-y-4">
          <button
            onClick={() =>
              (window.location.href = "mailto:info@ayushaushadhi.com")
            }
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full shadow-lg text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all transform hover:-translate-y-1"
          >
            <FaEnvelope /> Contact Support
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
