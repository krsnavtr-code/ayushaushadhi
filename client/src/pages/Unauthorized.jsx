import React from "react";
import { Link } from "react-router-dom";
import { FaLock, FaLeaf, FaHome } from "react-icons/fa";
import SEO from "../components/SEO";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 dark:bg-gray-900 relative overflow-hidden">
      {/* SEO */}
      <SEO
        title="Unauthorized Access | Ayushaushadhi"
        description="You do not have permission to access this page. Please log in with authorized credentials or contact Ayushaushadhi support for assistance."
        keywords="unauthorized access, access denied, ayushaushadhi login, permission error, restricted page"
        og={{
          title: "Unauthorized Access - Ayushaushadhi",
          description:
            "This page is restricted. Please ensure you have the correct permissions or log in to continue.",
          type: "website",
        }}
      />

      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-0 left-0 text-[10rem] text-emerald-100 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <FaLeaf className="absolute bottom-0 right-0 text-[10rem] text-amber-100 dark:text-amber-900/10 transform rotate-12 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="text-center p-8 max-w-md w-full relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white dark:border-gray-700">
        {/* Icon Circle */}
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 shadow-inner">
          <FaLock className="text-3xl text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 font-serif">
          Access Restricted
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
          You do not have the necessary permissions to view this page. Please
          contact the administrator if you believe this is a mistake.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaHome />
          Return Home
        </Link>
      </div>
    </div>
  );
}
