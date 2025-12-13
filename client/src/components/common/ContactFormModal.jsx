import React, { useState } from "react";
import { FaTimes, FaCheck, FaLeaf } from "react-icons/fa";
import { toast } from "react-toastify";
import { submitContactForm } from "../../api/contactApi";
import { Link, useNavigate } from "react-router-dom";

const ContactFormModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "Product Inquiry", // Changed from courseInterest
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Static options for E-commerce context
  const inquiryOptions = [
    "Product Inquiry",
    "Ayurvedic Doctor Consultation",
    "Order Status / Delivery",
    "Distributorship Query",
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

    // Prevent rapid submissions (5 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      toast.warning("Please wait a few seconds before submitting again");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions and privacy policy");
      return;
    }

    setLastSubmitTime(now);
    setIsSubmitting(true);

    try {
      // Prepare the data to match backend expectations
      // We map 'inquiryType' to 'subject' or a custom field depending on your API
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || "No specific message provided",
        subject: formData.inquiryType, // Mapping inquiry type to subject
        // courseId: null, // Removing course specific fields
        // courseTitle: null,
      };

      console.log("Submitting form data:", submissionData);

      const result = await submitContactForm(submissionData);

      if (result.success) {
        // Reset form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          inquiryType: "Product Inquiry",
          agreedToTerms: false,
        });

        setIsSuccess(true);

        // Optional: Redirect after delay or just show success state in modal
        // setTimeout(() => {
        //   onClose();
        //   navigate('/thank-you');
        // }, 2000);
      } else {
        // Handle API validation errors
        if (result.errors) {
          Object.values(result.errors).forEach((error) => {
            toast.error(error);
          });
        } else {
          toast.error(
            result.message || "Failed to send message. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Fallback for demo purposes if API fails
      // setIsSuccess(true);
      toast.error(
        error.message ||
          error.response?.data?.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center Trick */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-emerald-100 dark:border-gray-700">
          {/* Header */}
          <div className="bg-emerald-50 dark:bg-gray-700/50 px-4 py-4 sm:px-6 flex justify-between items-center border-b border-emerald-100 dark:border-gray-600">
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <FaLeaf className="text-emerald-500" />
              Request Consultation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-6 sm:px-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4 animate-bounce">
                  <FaCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Request Received!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 max-w-xs mx-auto">
                  Thank you for reaching out. Our wellness experts will contact
                  you shortly.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1"
                  >
                    Nature of Inquiry
                  </label>
                  <div className="relative">
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      {inquiryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="2"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-all outline-none resize-none"
                    placeholder="Tell us more about your health concern..."
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="agreedToTerms"
                      name="agreedToTerms"
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer accent-emerald-600"
                      required
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <label htmlFor="agreedToTerms" className="font-medium">
                      I agree to receive updates via WhatsApp/SMS & accept the{" "}
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-0.5 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                      </span>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;
