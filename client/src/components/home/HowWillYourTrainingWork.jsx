import React from "react";
import {
  FaLeaf,
  FaMortarPestle,
  FaFlask,
  FaClipboardCheck,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";

const steps = [
  {
    icon: (
      <FaLeaf className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Ethical Sourcing",
    desc: "We select the finest herbs from certified organic farms, ensuring 100% purity and sustainability.",
  },
  {
    icon: (
      <FaMortarPestle className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Traditional Extraction",
    desc: "Herbs are processed using ancient Ayurvedic methods (Bhavana) to preserve their natural potency.",
  },
  {
    icon: (
      <FaFlask className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Scientific Formulation",
    desc: "Our expert Vaidyas blend traditional wisdom with modern science to create effective remedies.",
  },
  {
    icon: (
      <FaClipboardCheck className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Rigorous Testing",
    desc: "Every batch undergoes strict quality control and lab testing (GMP/ISO) to ensure safety.",
  },
  {
    icon: (
      <FaBoxOpen className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Hygienic Packaging",
    desc: "Products are sealed in eco-friendly, tamper-proof packaging to maintain freshness.",
  },
  {
    icon: (
      <FaTruck className="text-3xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Doorstep Delivery",
    desc: "Fast, secure, and contact-less shipping directly to your home across the country.",
  },
];

const QualityProcess = () => {
  return (
    <section className="bg-emerald-50/50 dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
            Our Process
          </h2>
          <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-50 sm:text-4xl font-serif">
            From Nature to You
          </h3>
          <div className="h-1 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.desc}
              </p>

              {/* Optional: Step Number Background */}
              <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 dark:text-gray-700 opacity-20 -z-10 select-none">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityProcess;
