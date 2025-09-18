"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Heart, User, Building2, Shield } from "lucide-react";

type FormValues = {
  role: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(tab === "login" ? "Login Data:" : "Signup Data:", data);
    localStorage.setItem("role", data.role); // mock role
    router.push(`/dashboard/${data.role}-dashboard`);
  };

  const roleOptions = [
    { value: "user", label: "User", icon: User },
    { value: "volunteer", label: "Volunteer", icon: Heart },
    { value: "ngo", label: "NGO", icon: Building2 },
    { value: "corporate", label: "Corporate", icon: Shield },
  ];

  const selectedRole = watch("role");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-800">Impact Rewards</h1>
          <p className="text-gray-600">
            {tab === "login"
              ? "Welcome back! Please login to continue."
              : "Join us today and start making an impact."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-200">
          <button
            onClick={() => setTab("login")}
            className={`px-6 py-2 font-medium ${
              tab === "login"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`px-6 py-2 font-medium ${
              tab === "signup"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Header */}
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            {tab === "login" ? "Login to Your Account" : "Create a New Account"}
          </h2>

          {/* Role Selection as Radio Cards */}
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              I am a: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("role", { required: "Role is required" })}
                      className="hidden"
                    />
                    <Icon className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-800">{opt.label}</span>
                  </label>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password (only for SignUp) */}
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}





