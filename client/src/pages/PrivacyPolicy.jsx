import React from "react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Privacy Policy | Ayushaushadhi"
        description="Read our Privacy Policy to understand how Ayushaushadhi collects, uses, and protects your personal information. Last updated on your visit."
        keywords="privacy policy, data protection, personal information, ayurveda privacy, health data, secure shopping"
        og={{
          title: "Privacy Policy | Ayushaushadhi",
          description: `Last updated ${lastUpdated}. Learn how we protect your privacy.`,
          type: "article",
        }}
      />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 font-serif border-b border-emerald-100 dark:border-gray-700 pb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 italic">
            Last updated: {lastUpdated}
          </p>

          <div className="prose prose-emerald dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              At <strong>Ayushaushadhi</strong>, we deeply respect your trust.
              As a wellness brand, we are committed to protecting your privacy
              and ensuring the security of your personal and health-related
              information when you shop with us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information to provide better services to all our
              customers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6 space-y-2 marker:text-emerald-500">
              <li>
                <strong>Personal Information:</strong> Name, address, phone
                number, and email for order processing.
              </li>
              <li>
                <strong>Health Information (Optional):</strong> Data provided
                during consultations (e.g., Dosha type) to recommend products.
              </li>
              <li>
                <strong>Transaction Data:</strong> Details about payments and
                orders (we do not store sensitive card details).
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with our website
                to improve user experience.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6 space-y-2 marker:text-emerald-500">
              <li>Processing and delivering your herbal products.</li>
              <li>
                Sending order confirmations, invoices, and shipping updates.
              </li>
              <li>Providing customer support and wellness advice.</li>
              <li>Sending promotional offers (only if you opt-in).</li>
              <li>Complying with legal obligations and fraud prevention.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              3. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We implement industry-standard security measures (SSL encryption)
              to protect your data during transmission and storage. Access to
              your personal information is restricted to authorized personnel
              only.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              4. Cookies & Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We use cookies to enhance your shopping experience, remember your
              cart items, and analyze site traffic. You can choose to disable
              cookies in your browser settings, though some features of the
              store may not function properly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              5. Third-Party Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We do not sell your data. We share necessary information only with
              trusted partners:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6 space-y-2 marker:text-emerald-500">
              <li>
                <strong>Logistics Partners:</strong> To deliver your orders.
              </li>
              <li>
                <strong>Payment Gateways:</strong> To process secure
                transactions.
              </li>
              <li>
                <strong>Communication Tools:</strong> To send SMS/Email updates
                (e.g., WhatsApp, SendGrid).
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to access, correct, or delete your personal
              data stored with us. To exercise these rights, please contact our
              support team.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you have any questions regarding this Privacy Policy, please
              contact our Grievance Officer:
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg border-l-4 border-emerald-500">
              <address className="not-italic text-gray-700 dark:text-gray-300">
                <strong>Ayushaushadhi</strong>
                <br />
                H-161 BSI Business Park, Sector-63
                <br />
                Noida, Gautam Budh Nagar, UP - 201301
                <br />
                <br />
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@ayushaushadhi.com"
                  className="text-emerald-600 hover:underline"
                >
                  info@ayushaushadhi.com
                </a>
                <br />
                <strong>Phone:</strong> +91 9891030303
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;