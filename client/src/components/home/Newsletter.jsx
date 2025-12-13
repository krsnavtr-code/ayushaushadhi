import React, { useState } from 'react';
import { FaPaperPlane, FaLeaf } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribed with email:', email);
    setIsSubscribed(true);
    setEmail('');
    
    // Reset the subscription message after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };

  return (
    <section className="relative py-20 bg-emerald-900 dark:bg-gray-900 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <FaLeaf className="absolute top-10 left-10 text-9xl text-white transform -rotate-45" />
        <FaLeaf className="absolute bottom-10 right-10 text-9xl text-white transform rotate-12" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4 font-serif">
            Join Our Wellness Community
          </h2>
          <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
            Subscribe to receive exclusive Ayurvedic health tips, early access to new herbal remedies, 
            and special discounts delivered straight to your inbox.
          </p>
          
          {isSubscribed ? (
            <div className="bg-emerald-800/50 border border-emerald-400 text-emerald-100 px-6 py-4 rounded-xl relative backdrop-blur-sm" role="alert">
              <strong className="font-bold block mb-1">Welcome to the family!</strong>
              <span className="block sm:inline"> You have successfully subscribed to Ayushaushadhi updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 sm:flex justify-center gap-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="w-full sm:max-w-md">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 border border-emerald-700 bg-emerald-800/50 text-white placeholder-emerald-300/70 focus:ring-2 focus:ring-amber-400 focus:border-transparent rounded-full shadow-inner outline-none transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-emerald-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-900 focus:ring-amber-400 shadow-lg hover:shadow-amber-400/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FaPaperPlane className="mr-2" />
                  Subscribe
                </button>
              </div>
            </form>
          )}
          
          <p className="mt-6 text-sm text-emerald-300/80">
            We respect your privacy. No spam, just pure wellness. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;