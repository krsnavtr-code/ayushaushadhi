import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { FaLeaf, FaArrowLeft } from "react-icons/fa";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [message, setMessage] = useState(location.state?.message || "");
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (error === "not_approved") {
      setMessage(
        "Your account is pending verification. Please wait for approval."
      );
    } else if (error === "account_suspended") {
      setMessage("Your account has been deactivated. Please contact support.");
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const loginResponse = await login(formData.email, formData.password);
      if (loginResponse) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-800 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <FaLeaf className="absolute top-10 left-10 text-emerald-800/50 text-[10rem] transform -rotate-45 pointer-events-none" />
      <div className="absolute bottom-[-5rem] right-[-5rem] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative z-10">
        {/* Left Side - Brand Welcome */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white flex flex-col justify-center p-10 relative overflow-hidden">
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
              Welcome to <br />
              <span className="text-amber-300">Ayushaushadhi</span>
            </h1>

            <p className="text-emerald-100 text-sm md:text-base leading-relaxed opacity-90 max-w-xs">
              Your gateway to authentic Ayurvedic wellness. Log in to manage
              your orders, consult Vaidyas, and track your health journey.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-serif">
            Sign In
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Access your personalized wellness dashboard.
          </p>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm font-medium border-l-4 ${
                error
                  ? "bg-red-50 text-red-700 border-red-500"
                  : "bg-amber-50 text-amber-800 border-amber-500"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-gray-500 uppercase"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer accent-emerald-600"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none"
              >
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Signing In...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New to Ayushaushadhi?{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
