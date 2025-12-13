import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaShoppingCart, FaHeart, FaMobileAlt } from "react-icons/fa";

// Local helper for gradient backgrounds
const getWellnessCardBg = () => {
  return "bg-gradient-to-br from-emerald-50 to-stone-50 dark:from-emerald-900/10 dark:to-stone-900/10 border border-emerald-100 dark:border-emerald-800";
};

const Content = () => {
  const cardStyle = getWellnessCardBg();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Intro Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl font-serif">
          Welcome to Ayushaushadhi – Your Holistic Wellness Partner
        </h2>
        <div className="h-1.5 w-24 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Ayushaushadhi is a trusted platform dedicated to bringing the ancient
          wisdom of Ayurveda to the modern world. Our mission is to provide
          authentic, high-quality herbal remedies that promote natural healing
          and balance for your mind, body, and soul.
        </p>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Whether you are looking to boost immunity, improve digestion, enhance
          skin health, or manage stress, we offer a curated selection of
          doctor-formulated products tailored to your lifestyle needs.
        </p>
      </div>

      {/* Why Choose Ayushaushadhi */}
      <div className="mb-20">
        <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 text-center font-serif">
          Why Choose Ayushaushadhi?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className={`${cardStyle} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
          >
            <h4 className="flex items-center gap-2 text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">
              <FaLeaf /> 100% Authentic Herbs
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              We source raw materials directly from organic farms, ensuring
              every product is free from harmful chemicals and rich in natural
              potency.
            </p>
          </div>
          <div
            className={`${cardStyle} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
          >
            <h4 className="flex items-center gap-2 text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">
              <FaHeart /> Personalized Care
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Get recommendations based on your unique body constitution (Dosha)
              and health goals from our panel of expert Vaidyas.
            </p>
          </div>
          <div
            className={`${cardStyle} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
          >
            <h4 className="flex items-center gap-2 text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">
              <FaShoppingCart /> Easy Online Shopping
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Browse our catalog, read detailed usage guides, and order your
              remedies securely from the comfort of your home.
            </p>
          </div>
          <div
            className={`${cardStyle} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
          >
            <h4 className="flex items-center gap-2 text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">
              <FaMobileAlt /> Lifetime Support
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Our customer support team is always available to guide you on
              product usage, dietary tips, and holistic lifestyle changes.
            </p>
          </div>
        </div>
      </div>

      {/* Start Healing in 3 Steps */}
      <div className={`${cardStyle} mb-20 p-8 md:p-10 rounded-2xl shadow-sm`}>
        <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 text-center font-serif">
          Start Your Wellness Journey in 3 Easy Steps
        </h3>
        <ol className="space-y-6 max-w-4xl mx-auto text-lg text-gray-700 dark:text-gray-300 list-none">
          <li className="flex gap-4">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
              1
            </span>
            <div>
              <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                Browse Remedies:
              </strong>
              Explore our wide range of herbal supplements, oils, and powders
              categorized by health concerns like Immunity, Hair Care, and
              Digestion.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
              2
            </span>
            <div>
              <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                Secure Checkout:
              </strong>
              Add your chosen products to the cart and pay securely via UPI,
              Credit/Debit Card, or Cash on Delivery.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold">
              3
            </span>
            <div>
              <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                Experience Healing:
              </strong>
              Receive your package at your doorstep, follow the dosage
              instructions, and embrace the natural path to better health.
            </div>
          </li>
        </ol>
      </div>

      {/* Community Section */}
      <div className="text-center mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
          Join 50,000+ Happy Customers Across India
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Thousands of families have switched to a chemical-free lifestyle with
          our products. Whether you want to detoxify your body or find a natural
          cure for chronic ailments, Ayushaushadhi is your companion in
          sustainable living.
        </p>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-10 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
            Embrace the Power of Nature Today!
          </h3>
          <p className="text-lg text-emerald-50 max-w-2xl mx-auto mb-8">
            Take the first step towards a healthier, balanced life. Pure
            ingredients, ancient recipes, delivered to you.
          </p>
          <Link
            to="/collections"
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-bold rounded-full hover:bg-amber-50 transition-colors shadow-lg"
          >
            Shop Now
          </Link>
        </div>
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-400 opacity-20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default Content;
