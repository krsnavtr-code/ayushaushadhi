import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaCheck,
  FaLeaf,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Wellness Query submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: (
        <FaMapMarkerAlt className="text-2xl text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Our Location",
      description:
        "H-161 BSI Sector-63, Noida, Gautam Budh Nagar, Uttar Pradesh 201301",
      link: "https://maps.google.com/?q=H-161+BSI+Sector-63+Noida",
      linkText: "View on map",
    },
    {
      icon: <FaPhone className="text-2xl text-amber-600 dark:text-amber-400" />,
      title: "Phone Number",
      description: "+91 9990056799",
      link: "tel:+919990056799",
      linkText: "Call us",
    },
    {
      icon: (
        <FaEnvelope className="text-2xl text-teal-600 dark:text-teal-400" />
      ),
      title: "Email Address",
      description: "info@ayushaushadhi.com",
      link: "mailto:info@ayushaushadhi.com",
      linkText: "Send email",
    },
  ];

  return (
    <section className="py-20 bg-emerald-50/30 dark:bg-gray-900 relative">
      {/* Decorative Leaf Background */}
      <FaLeaf className="absolute top-10 right-10 text-emerald-100 dark:text-emerald-900/20 text-9xl transform rotate-45 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
            Get In Touch
          </h2>
          <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-50 sm:text-4xl font-serif">
            We'd Love to Hear From You
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you have a question about our herbs, need help with an
            order, or want a personalized consultation, our team is here to
            help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 p-3 bg-emerald-50 dark:bg-gray-700 rounded-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      className="inline-flex items-center text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.linkText}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-lg shadow-emerald-900/5 border border-emerald-50 dark:border-gray-700">
              {isSubmitted ? (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-6"
                  >
                    <FaCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">
                    Message Received!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                    Thank you for reaching out. One of our wellness experts will
                    respond to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Product inquiry, Order status, Consultation..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full shadow-lg shadow-emerald-600/20 text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
