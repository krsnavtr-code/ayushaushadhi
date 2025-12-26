import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaLeaf,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { submitContactForm } from "../api/contactApi";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "General Inquiry", // Replaced courseInterest with a generic subject
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Inquiry options for an e-commerce store
  const inquiryTypes = [
    "Product Inquiry",
    "Order Status",
    "Consultation with Vaidya",
    "Wholesale/Distribution",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions and privacy policy", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        subject: "General Inquiry",
        agreedToTerms: false,
      });

      toast.success("Your message has been sent successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // For demo purposes, we can simulate success if API fails (optional)
      // setIsSuccess(true);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Contact Us | Ayushaushadhi - Wellness Support"
        description="Have questions about our herbal products? Contact the Ayushaushadhi team for consultations, order support, or general inquiries."
        keywords="contact ayushaushadhi, ayurveda support, herbal consultation, customer service, email, phone"
        og={{
          title: "Contact Ayushaushadhi - We're Here to Help",
          description:
            "Get in touch with our wellness experts for any questions about our products or your health journey.",
          type: "website",
        }}
      />

      {/* Header Banner */}
      <div className="relative bg-emerald-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <FaLeaf className="text-9xl text-white absolute -top-10 -left-10 transform -rotate-45" />
          <FaLeaf className="text-9xl text-white absolute -bottom-10 -right-10 transform rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">
            Contact Us
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Whether you need guidance on choosing the right herb or have a
            question about your order, our dedicated team is here to assist you
            on your path to wellness.
          </p>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information & Socials */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 font-serif">
                  Get in Touch
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                      <FaMapMarkerAlt className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Headquarters
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300 leading-relaxed">
                        H-161 BSI Business Park, Sector-63
                        <br />
                        Noida, Gautam Budh Nagar, UP - 201301
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                      <FaPhone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Phone Support
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        <a
                          href="tel:+919891030303"
                          className="hover:text-emerald-600 transition-colors"
                        >
                          +91 9891030303
                        </a>
                        <br />
                        <span className="text-sm text-gray-500">
                          Mon - Sat, 9:00 AM - 6:00 PM
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                      <FaEnvelope className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Email Us
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        <a
                          href="mailto:info@ayushaushadhi.com"
                          className="hover:text-emerald-600 transition-colors"
                        >
                          info@ayushaushadhi.com
                        </a>
                        <br />
                        <span className="text-sm text-gray-500">
                          We respond within 24 hours
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Follow Our Journey
                </h2>
                <div className="flex space-x-4">
                  {[
                    {
                      name: "Facebook",
                      icon: FaFacebook,
                      color: "text-blue-600",
                    },
                    {
                      name: "Twitter",
                      icon: FaTwitter,
                      color: "text-blue-400",
                    },
                    {
                      name: "Instagram",
                      icon: FaInstagram,
                      color: "text-pink-600",
                    },
                    {
                      name: "LinkedIn",
                      icon: FaLinkedin,
                      color: "text-blue-700",
                    },
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={`#${social.name.toLowerCase()}`}
                        className={`p-3 rounded-full bg-gray-50 dark:bg-gray-700 ${social.color} hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:-translate-y-1`}
                        aria-label={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-4 border-emerald-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                Fill out the form below and we will get back to you shortly.
              </p>

              {isSuccess ? (
                <div className="text-center py-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <FaCheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 px-4">
                    Thank you for contacting us. Our team will review your
                    inquiry and respond soon.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full shadow-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white outline-none transition-all"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreedToTerms"
                        name="agreedToTerms"
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            agreedToTerms: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer accent-emerald-600"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="agreedToTerms"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms-of-service"
                          className="text-emerald-600 hover:text-emerald-500 underline"
                        >
                          Terms
                        </Link>{" "}
                        &{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-emerald-600 hover:text-emerald-500 underline"
                        >
                          Privacy Policy
                        </Link>
                        .<span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-1 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
