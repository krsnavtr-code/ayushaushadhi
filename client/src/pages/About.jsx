import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaLeaf, FaFlask, FaUserMd, FaGlobeAsia } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Ayushaushadhi | Authentic Ayurvedic Medicine & Holistic Wellness"
        description="Ayushaushadhi is dedicated to authentic Ayurvedic medicine, offering doctor-formulated herbal remedies for natural healing, balance, and long-term holistic wellness."
        keywords="about ayushaushadhi, ayurveda story, herbal wellness, natural medicine, indian heritage, holistic health mission"
        og={{
          title: "About Ayushaushadhi - Purity & Tradition",
          description:
            "From ancient texts to your doorstep. Discover how Ayushaushadhi creates authentic herbal remedies for a balanced life.",
          type: "website",
        }}
      />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-emerald-900 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <FaLeaf className="absolute top-0 left-0 text-9xl text-white transform -rotate-45 -translate-x-1/2 -translate-y-1/2" />
          <FaLeaf className="absolute bottom-0 right-0 text-9xl text-white transform rotate-12 translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Our Roots
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mb-8 rounded-full"></div>
          <h1 className="text-xl md:text-2xl text-emerald-100 leading-relaxed font-light">
            "About Ayushaushadhi – Trusted Ayurvedic Medicine for Natural
            Wellness"
          </h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">
              Our Mission
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 mb-6 font-serif">
              Healing with Nature, Backed by Science
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe that true wellness comes from balance. Ayushaushadhi
              was born from a desire to make authentic, chemical-free Ayurvedic
              remedies accessible to everyone. In a world full of synthetic
              supplements, we return to the roots—using potent herbs,
              traditional formulation methods (Bhavana), and rigorous quality
              testing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
                Who We Are
              </h3>
              <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our journey began with a simple observation: the modern
                lifestyle has disconnected us from nature. Backed by a
                passionate team of Ayurvedic Vaidyas, botanists, and wellness
                experts, we are committed to delivering a holistic health
                experience.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We work directly with organic farmers to source the purest
                Ashwagandha, Tulsi, Giloy, and other vital herbs, ensuring that
                every product you receive carries the pristine energy of the
                earth.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-900 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1600609842388-3e4b7c8d9e2a?q=80&w=2070&auto=format&fit=crop"
                alt="Herbal Preparation"
                className="relative rounded-2xl shadow-xl w-full object-cover h-80"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              {
                icon: (
                  <FaLeaf className="text-4xl text-emerald-600 dark:text-emerald-400 mb-4" />
                ),
                title: "100% Natural",
                description:
                  "No parabens, sulfates, or synthetic fillers. Just pure herbs.",
              },
              {
                icon: (
                  <FaUserMd className="text-4xl text-emerald-600 dark:text-emerald-400 mb-4" />
                ),
                title: "Vaidya Approved",
                description:
                  "Formulations crafted by experienced Ayurvedic doctors.",
              },
              {
                icon: (
                  <FaFlask className="text-4xl text-emerald-600 dark:text-emerald-400 mb-4" />
                ),
                title: "Lab Tested",
                description:
                  "Rigorous quality checks for safety, purity, and potency.",
              },
              {
                icon: (
                  <FaGlobeAsia className="text-4xl text-emerald-600 dark:text-emerald-400 mb-4" />
                ),
                title: "Sustainable",
                description:
                  "Eco-friendly packaging and ethical sourcing practices.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-serif">
              The People Behind the Purity
            </h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto mb-12 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Rajesh Sharma",
                  role: "Chief Ayurveda Consultant",
                  bio: "30+ years of clinical experience in Nadi Pariksha and Panchakarma therapies.",
                  image: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                {
                  name: "Priya Singh",
                  role: "Head of Formulation",
                  bio: "Botanist specializing in preserving herbal potency through traditional extraction methods.",
                  image: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  name: "Amit Verma",
                  role: "Supply Chain Manager",
                  bio: "Ensures ethical sourcing from certified organic farms across the Himalayas.",
                  image: "https://randomuser.me/api/portraits/men/45.jpg",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  {/* <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  /> */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-500 font-medium text-sm mb-4 uppercase tracking-wide">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Decorative Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif relative z-10">
              Ready to Embrace a Healthier Life?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
              Join thousands of others who have found relief and vitality
              through our natural remedies.
            </p>
            <Link
              to="/collections"
              className="inline-block bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:-translate-y-1 relative z-10"
            >
              Shop Herbal Collection
            </Link>
          </div>

          <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-12 font-serif italic">
            "Health is not just the absence of disease, but the harmony of mind,
            body, and spirit."
          </p>
        </div>
      </section>
    </div>
  );
}
