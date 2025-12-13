import React from "react";
import SEO from "../components/SEO";

const PaymentTAndC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Payment Policy | Ayushaushadhi"
        description="Review our payment terms, refund policies, and shipping conditions for Ayushaushadhi products."
        keywords="payment terms, refund policy, ayurveda shipping, return policy, secure payment, ayush aushadhi terms"
        og={{
          title: "Payment Terms & Conditions | Ayushaushadhi",
          description:
            "Understand our policies on payments, shipping, and returns for your herbal wellness products.",
          type: "article",
        }}
      />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 font-serif border-b border-emerald-100 dark:border-gray-700 pb-4">
            Payment Terms & Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 italic">
            Last Updated: {lastUpdated}
          </p>

          <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-6 leading-relaxed">
              By proceeding with a purchase on{" "}
              <strong>Ayushaushadhi.com</strong>, you acknowledge that you have
              read, understood, and agreed to the following payment terms and
              conditions.
            </p>

            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              1. Payment Authorization
            </h3>
            <p className="mb-4">
              By making this payment, I hereby confirm that the funds used for
              this transaction belong solely to me and have been lawfully earned
              through legitimate means. I am making this payment voluntarily,
              without any coercion or pressure.
            </p>
            <p className="mb-4">
              I fully understand that I am responsible for the source of these
              funds. Ayushaushadhi reserves the right to cancel any order if
              suspicious activity is detected during the transaction process.
            </p>

            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              2. Pricing & Taxes
            </h3>
            <p className="mb-4">
              All prices listed on the website are in Indian Rupees (INR) and
              are inclusive of GST, unless stated otherwise. Shipping charges
              may be calculated separately at checkout based on your delivery
              location.
            </p>

            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              3. Refund & Cancellation Policy
            </h3>
            <ul className="list-disc pl-6 space-y-2 marker:text-amber-500">
              <li>
                <strong>Order Cancellation:</strong> You can cancel your order
                within 24 hours of placing it, provided it has not been shipped.
                Once shipped, orders cannot be cancelled.
              </li>
              <li>
                <strong>Non-Refundable Items:</strong> Due to hygiene and health
                safety standards, opened bottles, used supplements, and oils are
                strictly non-refundable.
              </li>
              <li>
                <strong>Damaged/Defective Items:</strong> If you receive a
                damaged product, please email us at{" "}
                <span className="text-emerald-600">info@ayushaushadhi.com</span>{" "}
                with unboxing photos/videos within 48 hours of delivery. We will
                initiate a replacement or refund after verification.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              4. Shipping & Delivery
            </h3>
            <p className="mb-4">
              We strive to deliver products within 5-7 business days. However,
              delays due to unforeseen circumstances (logistics issues, natural
              calamities) are beyond our control. Ayushaushadhi is not liable
              for delayed deliveries once the package has been handed over to
              the courier partner.
            </p>

            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              5. Legal Disclaimer
            </h3>
            <p className="mb-4">
              Our products are Ayurvedic supplements and are not intended to
              diagnose, treat, cure, or prevent any disease. Results may vary
              from person to person. Please consult your physician before
              starting any new herbal regimen.
            </p>

            <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                <strong>Declaration:</strong> By completing this transaction, I
                certify that this payment does not violate any local, national,
                or international laws related to digital payments and financial
                transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTAndC;
