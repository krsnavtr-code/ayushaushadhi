import React from "react";
import SEO from "../components/SEO";
import Banner from "../components/Banner";
import Categories from "../components/home/Categories";
// Renaming imports conceptually to match E-commerce context
import FeaturedProducts from "../components/home/PopularCourses";
// import FeaturedBooks from '../components/home/FeaturedBooks'; // Likely not needed unless selling books
import Stats from "../components/home/Stats";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import ContactSection from "../components/home/ContactSection";
import WhyChooseUs from "../components/home/WhyLearnWithFirstVITE"; // Reusing this component structure for "Why Choose Ayushaushadhi"
import QualityProcess from "../components/home/HowWillYourTrainingWork"; // Reusing for "Our Quality Process"
import Content from "../components/home/Content";

function Home() {
  return (
    <>
      <SEO
        title="Ayushaushadhi - Authentic Ayurvedic Medicines & Herbal Store"
        description="Ayushaushadhi offers premium Ayurvedic medicines and herbal products. Shop online for immunity boosters, skin care, digestion aids, and holistic wellness remedies."
        keywords="ayurveda, herbal medicine, online ayurveda store, natural remedies, ayush aushadhi, immunity, organic health, herbal supplements"
        og={{
          title: "Ayushaushadhi - Rediscover Nature's Healing Power",
          description:
            "Explore our range of 100% natural and authentic Ayurvedic products. From ancient formulations to modern wellness solutions.",
          type: "website",
          image: "/assets/Ayush-Aushadhi-Logo-Fit.png", // Updated to point to your logo or a banner image
        }}
      />
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Banner - Main Slider */}
        <Banner />

        {/* Categories Section - e.g., Immunity, Skin, Hair, Digestion */}
        <Categories />

        {/* Popular Products Section (Previously PopularCourses) */}
        <FeaturedProducts />

        {/* Why Choose Ayushaushadhi? (Previously WhyLearnWithFirstVITE) */}
        <WhyChooseUs />

        {/* Our Process / Quality Assurance (Previously HowWillYourTrainingWork) */}
        <QualityProcess />

        {/* Stats Section - e.g., "100% Natural", "5000+ Customers" */}
        <Stats />

        {/* Content - General Info or About Snippet */}
        <Content />

        {/* Testimonials - Customer Reviews */}
        <Testimonials />

        {/* Newsletter - Subscribe for Health Tips */}
        <Newsletter />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </>
  );
}

export default Home;
