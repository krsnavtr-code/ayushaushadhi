import React from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import { FaLeaf, FaArrowLeft } from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login", {
      state: {
        message: "Registration successful! LogIn Now",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-800 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-10 right-10 text-emerald-800/50 text-[12rem] transform rotate-12 pointer-events-none" />
      <div className="absolute bottom-[-5rem] left-[-5rem] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">
        {/* Left Side - Brand Welcome */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white flex flex-col justify-center p-10 relative overflow-hidden order-2 md:order-1">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <Link
            to="/"
            className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium z-10"
          >
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <FaLeaf className="text-3xl text-amber-300" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4 leading-tight">
              Begin Your <br />
              <span className="text-amber-300">Wellness Journey</span>
            </h1>

            <p className="text-emerald-100 text-sm md:text-base leading-relaxed opacity-90">
              Join the Ayushaushadhi family today. Unlock access to exclusive
              herbal remedies, expert consultations, and personalized health
              tracking.
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2 bg-white dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
              Create Account
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Fill in your details to get started.
            </p>
          </div>

          {/* Form Component */}
          <RegisterForm onSuccess={handleSuccess} />

          <div className="mt-6 text-center pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
