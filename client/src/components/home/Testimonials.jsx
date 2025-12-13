import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

// Updated Ayurveda-focused testimonials
const testimonials = [
  {
    id: 1,
    name: "Sunita Verma",
    role: "Regular Customer",
    content:
      "I've been using the Joint Pain Relief Oil for two months now, and the difference is incredible. I can finally walk without stiffness. Truly authentic Ayurveda!",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Yoga Practitioner",
    content:
      "The Ashwagandha powder is of premium quality. It has significantly improved my energy levels and stress management. Highly recommended.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Anjali Mehta",
    role: "Ayurveda Doctor",
    content:
      "I often recommend Ayushaushadhi products to my patients because of their purity and adherence to traditional formulation methods.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Verified Buyer",
    content:
      "Fast delivery and excellent packaging. The Digestive Care syrup worked wonders for my acidity issues within a week.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
  },
  {
    id: 5,
    name: "Meera Reddy",
    role: "Homemaker",
    content:
      "I love their herbal hair oil. My hair fall has reduced drastically, and the texture has improved. It smells natural and earthy.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 6,
    name: "Amit Trivedi",
    role: "Fitness Enthusiast",
    content:
      "Great immunity boosters. I've been taking their Chyawanprash this winter and haven't fallen sick once. Great taste too!",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
];

// Local helper for nature-themed card backgrounds
const getNatureCardStyle = (index) => {
  const styles = [
    "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800",
    "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",
    "bg-stone-50 dark:bg-stone-900/20 border-stone-100 dark:border-stone-800",
  ];
  return styles[index % styles.length];
};

const Testimonials = () => {
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ));
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative">
      {/* Decorative background blob */}
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-100 dark:bg-emerald-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
            Testimonials
          </h2>
          <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-50 sm:text-4xl font-serif">
            Healing Stories from Our Community
          </h3>
          <div className="h-1 w-20 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${getNatureCardStyle(
                index
              )}`}
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 relative">
                  <img
                    className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                    src={testimonial.avatar}
                    alt={`${testimonial.name}'s avatar`}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-xs">
                    <FaQuoteLeft size={10} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

              <div className="relative">
                <p className="relative z-10 text-gray-700 dark:text-gray-300 italic leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
