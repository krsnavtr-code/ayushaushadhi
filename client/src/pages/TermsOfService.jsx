import React from "react";
import SEO from "../components/SEO";

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Terms of Service | Ayushaushadhi"
        description="Review the Terms of Service for using Ayushaushadhi's online store. Understand your rights, our policies on herbal products, and medical disclaimers."
        keywords="terms of service, user agreement, ayurveda disclaimer, e-commerce terms, herbal product policy"
        og={{
          title: "Terms of Service | Ayushaushadhi",
          description: `Last updated ${lastUpdated}. By using our store, you agree to these terms.`,
          type: "article",
        }}
      />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 font-serif border-b border-emerald-100 dark:border-gray-700 pb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 italic">
            Last updated: {lastUpdated}
          </p>

          <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-6">
              Welcome to <strong>Ayushaushadhi</strong>. By accessing our
              website and purchasing our herbal products, you agree to be bound
              by the following Terms of Service. Please read them carefully
              before using our services.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              1. Online Store Terms
            </h2>
            <p className="mb-4">
              By agreeing to these Terms of Service, you represent that you are
              at least the age of majority in your state or province of
              residence. You may not use our products for any illegal or
              unauthorized purpose nor may you, in the use of the Service,
              violate any laws in your jurisdiction.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              2. Medical Disclaimer (Crucial)
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500 mb-4">
              <p className="font-medium text-amber-900 dark:text-amber-100">
                The content on this website is for informational purposes only
                and is not intended to substitute for professional medical
                advice, diagnosis, or treatment.
              </p>
            </div>
            <p className="mb-4">
              Our Ayurvedic products are nutritional supplements and traditional
              remedies. They are not intended to diagnose, treat, cure, or
              prevent any specific disease. Always consult with a qualified
              healthcare provider before starting any new herbal regimen,
              especially if you are pregnant, nursing, or taking medication.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              3. Products and Services
            </h2>
            <p className="mb-4">
              We have made every effort to display as accurately as possible the
              colors and images of our products. We cannot guarantee that your
              computer monitor's display of any color will be accurate. All
              descriptions of products or product pricing are subject to change
              at any time without notice. We reserve the right to discontinue
              any product at any time.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              4. Billing and Account Accuracy
            </h2>
            <p className="mb-4">
              You agree to provide current, complete, and accurate purchase and
              account information for all purchases made at our store. You agree
              to promptly update your account and other information, including
              your email address and credit card numbers and expiration dates,
              so that we can complete your transactions and contact you as
              needed.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              5. Shipping and Returns
            </h2>
            <p className="mb-4">
              Our shipping and return policies are part of these Terms of
              Service. We are not liable for delays caused by logistics
              partners. Returns are accepted only for damaged or defective
              products reported within 48 hours of delivery.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              6. Intellectual Property
            </h2>
            <p className="mb-4">
              All content on this site, including text, graphics, logos, button
              icons, images, and software, is the property of Ayushaushadhi and
              is protected by Indian and international copyright laws.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="mb-4">
              In no case shall Ayushaushadhi, our directors, officers,
              employees, affiliates, agents, contractors, or licensors be liable
              for any injury, loss, claim, or any direct, indirect, incidental,
              punitive, special, or consequential damages of any kind arising
              from your use of any of the service or any products procured using
              the service.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              8. Governing Law
            </h2>
            <p className="mb-6">
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising out of these terms shall
              be subject to the exclusive jurisdiction of the courts in Noida,
              Uttar Pradesh.
            </p>

            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-8 mb-4">
              9. Contact Information
            </h2>
            <p className="mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
              <address className="not-italic text-gray-700 dark:text-gray-300">
                <strong>Ayushaushadhi</strong>
                <br />
                H-161 BSI Business Park, Sector-63
                <br />
                Noida, Gautam Budh Nagar
                <br />
                Uttar Pradesh 201301
                <br />
                <br />
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@ayushaushadhi.com"
                  className="text-emerald-600 hover:underline"
                >
                  info@ayushaushadhi.com
                </a>
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
