import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaExclamationCircle,
} from "react-icons/fa";

const RegisterForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictMsg, setConflictMsg] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setConflictMsg("");

      const userData = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: "student", // Default role for customers
        phone: data.phone,
        // Removed department as it's not relevant for e-commerce customers
      };

      const response = await api.post("/auth/register", userData);

      toast.success("Account created successfully! Please verify your email.");

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      if (status === 409) {
        setConflictMsg(
          errorMessage || "Email already registered. Please login."
        );
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {conflictMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 flex items-start gap-3">
          <FaExclamationCircle className="mt-1 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-medium">{conflictMsg}</p>
            <Link
              to="/login"
              className="mt-2 inline-block font-bold underline hover:text-red-800"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="fullname"
          className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
        >
          Full Name
        </label>
        <div className="relative">
          <FaUser className="absolute left-3 top-3.5 text-gray-400" />
          <input
            id="fullname"
            type="text"
            placeholder="Full Name"
            {...register("fullname", { required: "Full name is required" })}
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.fullname
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.fullname && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.fullname.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
        >
          Email Address
        </label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.email
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
        >
          Phone Number
        </label>
        <div className="relative">
          <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Valid phone number required (10-15 digits)",
              },
            })}
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.phone
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
            } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
          >
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Required",
                minLength: {
                  value: 6,
                  message: "Min 6 chars",
                },
              })}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
              } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1"
          >
            Confirm
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
              } rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
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
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
