import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaLeaf, FaHome } from "react-icons/fa";
import SEO from "../components/SEO";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  // Track Google Ads conversion
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16986190204/pOYXCKjcwfwaEPzi0qM_",
        transaction_id: state?.conversionData?.transaction_id || "",
        value: state?.conversionData?.value || 1.0,
        currency: state?.conversionData?.currency || "INR",
        event_callback: function () {
          console.log("Conversion tracked on thank you page");
        },
      });
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-emerald-50/50 dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* SEO */}
      <SEO
        title="Thank You | Ayushaushadhi"
        description="Thank you for reaching out to Ayushaushadhi. We have received your request and our wellness team will get back to you shortly."
        keywords="thank you ayushaushadhi, request received, contact success, ayurveda support, herbal wellness"
        og={{
          title: "Thank You - Ayushaushadhi",
          description:
            "Your message has been successfully submitted. Our team will contact you soon to support your wellness journey.",
          type: "website",
        }}
      />

      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-10 left-10 text-emerald-200 dark:text-emerald-900/20 text-9xl transform -rotate-45 pointer-events-none opacity-50" />
      <FaLeaf className="absolute bottom-10 right-10 text-amber-200 dark:text-amber-900/20 text-8xl transform rotate-12 pointer-events-none opacity-50" />

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-gray-700 p-8 text-center relative z-10">
        {/* Success Icon Animation */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6 animate-bounce">
          <FaCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h2 className="text-3xl font-bold text-emerald-900 dark:text-white font-serif mb-2">
          Namaste!
        </h2>

        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">
          Thank You
        </h3>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          {state?.message ||
            "Your request has been received successfully. We appreciate you choosing the natural path to wellness."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-1"
          >
            <FaHome /> Return to Home
          </button>

          <button
            onClick={() => navigate("/collections")}
            className="w-full py-3 px-6 rounded-full border border-emerald-200 dark:border-gray-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors"
          >
            Browse More Products
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          A confirmation email has been sent to you.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
