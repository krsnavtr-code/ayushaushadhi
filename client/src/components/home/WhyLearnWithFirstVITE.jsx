import React, { useState, useEffect, useRef } from "react";
import {
  FaLeaf,
  FaFlask,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaShippingFast,
  FaUserMd,
} from "react-icons/fa";
// Ensure typography.css exists or remove this import
import "../../styles/typography.css";

// Updated Data for Ayurveda Brand
const reasons = [
  {
    icon: <FaLeaf />,
    title: "100% Natural Ingredients",
    description:
      "Sourced directly from organic farms, our herbs are free from chemicals and preservatives.",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: <FaFlask />,
    title: "Lab Tested & Certified",
    description:
      "Every batch undergoes rigorous testing for purity, potency, and safety standards (GMP/ISO).",
    color:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: <FaUserMd />,
    title: "Doctor Formulated",
    description:
      "Blends crafted by experienced Vaidyas to ensure maximum efficacy and holistic healing.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Holistic Wellness",
    description:
      "We focus on treating the root cause, not just symptoms, balancing your body's doshas.",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted by Thousands",
    description:
      "Join our community of happy customers who have reclaimed their health naturally.",
    color:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    icon: <FaShippingFast />,
    title: "Fast & Safe Delivery",
    description:
      "Secure packaging and reliable shipping partners ensure your remedies arrive fresh.",
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
];

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={componentRef}
      className={`py-20 bg-gradient-to-b from-white to-stone-50 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-1000 ${
        isVisible ? "opacity-100 visible" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
            The Ayushaushadhi Difference
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 font-serif mb-4">
            Why Trust Nature With Us?
          </h3>
          <div className="h-1 w-20 bg-amber-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            We combine ancient Vedic wisdom with modern quality standards to
            bring you authentic Ayurveda that actually works.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Decorative Circle Background */}
              <div
                className={`absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${
                  item.color.split(" ")[0]
                }`}
              ></div>

              {/* Icon */}
              <div
                className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>

              {/* Content */}
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>

              {/* Bottom Border Accent */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
