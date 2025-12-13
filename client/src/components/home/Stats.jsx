import React from "react";
import { FaLeaf, FaUserCheck, FaMapMarkerAlt, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";

// Ayurveda-specific stats data
const stats = [
  {
    id: 1,
    name: "Herbal Products",
    value: "100+",
    icon: FaLeaf,
    color: "emerald", // Used for custom gradient logic below
  },
  {
    id: 2,
    name: "Happy Customers",
    value: "50,000+",
    icon: FaUserCheck,
    color: "amber",
  },
  {
    id: 3,
    name: "Pincodes Served",
    value: "15,000+",
    icon: FaMapMarkerAlt,
    color: "teal",
  },
  {
    id: 4,
    name: "Quality Certifications",
    value: "GMP/ISO",
    icon: FaAward,
    color: "rose",
  },
];

// Local helper to generate nature-themed backgrounds based on index/id
const getNatureStatStyle = (index) => {
  const styles = [
    // Emerald
    "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
    // Amber
    "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800 text-amber-600 dark:text-amber-400",
    // Teal
    "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 dark:from-teal-900/20 dark:to-cyan-900/20 dark:border-teal-800 text-teal-600 dark:text-teal-400",
    // Rose/Clay
    "bg-gradient-to-br from-rose-50 to-red-50 border-rose-100 dark:from-rose-900/20 dark:to-red-900/20 dark:border-rose-800 text-rose-600 dark:text-rose-400",
  ];
  return styles[index % styles.length];
};

const Stats = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const styleClass = getNatureStatStyle(index);

            return (
              <motion.div
                key={stat.id}
                className={`p-6 rounded-2xl shadow-sm border ${styleClass}`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: index * 0.1,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
                    <stat.icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white font-serif mb-1">
                    {stat.value}
                  </h3>

                  <p className="text-sm font-medium uppercase tracking-wide opacity-80 text-gray-700 dark:text-gray-300">
                    {stat.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
