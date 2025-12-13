import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { getFAQs } from "../api/faqApi";
import {
  FaChevronDown,
  FaChevronUp,
  FaLeaf,
  FaQuestionCircle,
} from "react-icons/fa";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        console.log("Fetching FAQs...");
        // Ideally, this API should return product-related FAQs
        const data = await getFAQs();

        if (!Array.isArray(data)) {
          setError("Invalid data format received from server");
          setFaqs([]);
          return;
        }

        setFaqs(data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <SEO
        title="Help Center & FAQs | Ayushaushadhi"
        description="Find answers about our herbal products, dosage, shipping, and returns. Ayushaushadhi support."
        keywords="ayurveda faq, herbal medicine questions, shipping help, return policy, product usage"
        og={{
          title: "Frequently Asked Questions | Ayushaushadhi",
          description:
            "Get answers to your questions about our natural remedies and wellness products.",
          type: "website",
        }}
      />

      {/* Decorative Background */}
      <FaLeaf className="absolute top-0 left-0 text-[15rem] text-emerald-100/50 dark:text-emerald-900/10 transform -rotate-45 -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
              Help Center
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 font-serif mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about our products, ingredients, and
              ordering process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div
                  key={faq._id || faq.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                    activeIndex === index
                      ? "shadow-md ring-1 ring-emerald-200 dark:ring-emerald-800"
                      : ""
                  }`}
                >
                  <button
                    className={`w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none transition-colors ${
                      activeIndex === index
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 pr-8">
                      {faq.question}
                    </span>
                    {activeIndex === index ? (
                      <FaChevronUp className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {activeIndex === index && (
                    <div className="px-6 py-5 border-t border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-800">
                      <div
                        className="prose prose-emerald dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <FaQuestionCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No FAQs found at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center bg-amber-50 dark:bg-amber-900/10 p-8 rounded-2xl border border-amber-100 dark:border-amber-800/30">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Still have questions regarding your health?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our Ayurvedic experts are here to guide you towards the right
              remedy.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-1"
            >
              Consult an Expert
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
