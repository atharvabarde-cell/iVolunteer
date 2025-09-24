"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Building2,
  HeartHandshake,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: string;
};

export default function AuthPage() {
  const { signup, login } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const roleOptions = [
    { value: "admin", label: "Admin", icon: Shield },
    { value: "user", label: "Volunteer", icon: HeartHandshake },
    { value: "ngo", label: "NGO", icon: Building2 },
    { value: "corporate", label: "Corporate", icon: Users },
  ];

  const selectedRole = watch("role");

  const onSubmit = async (data: FormValues) => {
    if (tab === "signup") {
      const success = await signup(
        data.name!,
        data.email,
        data.password,
        data.role as any
      );
      if (success) {
        toast.success("Account created successfully!");
        router.push("/");
      } else {
        toast.error("Signup failed");
      }
    } else {
      const success = await login(data.email, data.password, data.role as any);
      if (success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.info("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 font-['Manrope'] text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex bg-gray-50 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-md transition-all duration-300 ${
                tab === "login"
                  ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-md transition-all duration-300 ${
                tab === "signup"
                  ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {tab === "login"
                ? "Login to Your Account"
                : "Create a New Account"}
            </h2>
            <p className="text-gray-500 mt-2">
              {tab === "login"
                ? "Sign in to continue your volunteering journey"
                : "Join our community of volunteers and organizations"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 font-['Manrope'] tracking-wide">
                I am a: <span className="text-red-500">*</span>
              </label>

              {tab === "login" ? (
                // roles for Login
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedRole === opt.value;

                    return (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("role", {
                            required: "Role is required",
                          })}
                          className="hidden"
                        />
                        <div
                          className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 border ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {opt.label}
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // roles for Signup
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedRole === opt.value;

                    return (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("role", {
                            required: "Role is required",
                          })}
                          className="hidden"
                        />
                        <div
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all border ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-500"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm">{opt.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {errors.role && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Full Name Field for signup only */}
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      errors.name
        ? "border border-red-500 focus:!border-red-500 focus:!ring-red-500"
        : "border border-gray-300 dark:border-gray-600 focus:!border-blue-500 focus:!ring-blue-500"
    } 
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    ![&]:border-green-500 ![&]:focus:border-green-500 ![&]:focus:ring-green-500
    ![&:focus]:border-green-500 ![&:focus]:ring-green-500`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200 peer-focus:text-blue-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      errors.email
        ? "border border-red-500 focus:!border-red-500 focus:!ring-red-500"
        : "border border-gray-300 dark:border-gray-600 focus:!border-blue-500 focus:!ring-blue-500"
    } 
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    ![&]:border-green-500 ![&]:focus:border-green-500 ![&]:focus:ring-green-500
    ![&:focus]:border-green-500 ![&:focus]:ring-green-500`}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      errors.password
        ? "border border-red-500 focus:!border-red-500 focus:!ring-red-500"
        : "border border-gray-300 dark:border-gray-600 focus:!border-blue-500 focus:!ring-blue-500"
    } 
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    ![&]:border-green-500 ![&]:focus:border-green-500 ![&]:focus:ring-green-500
    ![&:focus]:border-green-500 ![&:focus]:ring-green-500`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password for signup  */}
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (val) =>
                        val === watch("password") || "Passwords do not match",
                    })}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${
      errors.password
        ? "border border-red-500 focus:!border-red-500 focus:!ring-red-500"
        : "border border-gray-300 dark:border-gray-600 focus:!border-blue-500 focus:!ring-blue-500"
    } 
    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    ![&]:border-green-500 ![&]:focus:border-green-500 ![&]:focus:ring-green-500
    ![&:focus]:border-green-500 ![&:focus]:ring-green-500`}
                  />

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {!errors.confirmPassword && watch("confirmPassword") && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {tab === "login" && (
              <div className="flex items-center justify-end">
                <a
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-800"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {tab === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : tab === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Link */}
          {tab === "signup" && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setTab("login")}
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
