// src/app/donation-event/AddEventPage.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDonationEvent } from "@/contexts/donationevents-context";
import { toast } from "react-toastify";
import { ChevronDown, IndianRupeeIcon } from "lucide-react";

interface EventFormValues {
  title: string;
  description: string;
  goalAmount: number;
  startDate: string;
  endDate: string;
  paymentMethod: "UPI" | "Bank" | "PayPal";
  upiId?: string;
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    accountHolder: string;
  };
}

const AddEventPage: React.FC = () => {
  const { addEvent } = useDonationEvent();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>();

  const selectedPaymentMethod = watch("paymentMethod");

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      await addEvent(data);
      toast.success("Event created successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="bg-indigo-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 sm:p-8 text-white">
            <h1 className="text-xl sm:text-2xl font-bold">
              Create Donation Event
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Fill in the details below to create your new donation event.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 space-y-6"
          >
            {/* Event Title */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                htmlFor="event-title"
              >
                Event Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                id="event-title"
                placeholder="e.g. Annual Charity Gala"
                type="text"
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm resize-none"
                id="description"
                placeholder="Describe your event..."
                rows={3}
              />

              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Goal Amount */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                htmlFor="goal-amount"
              >
                Goal Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupeeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  {...register("goalAmount", {
                    required: "Goal amount is required",
                    min: {
                      value: 1,
                      message: "Goal amount must be at least 1",
                    },
                  })}
                  className="w-full pl-9 pr-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  id="goal-amount"
                  placeholder="5000"
                  type="number"
                />
              </div>
              {errors.goalAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.goalAmount.message}
                </p>
              )}
            </div>

            {/* Date Fields -Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                  htmlFor="start-date"
                >
                  Start Date
                </label>
                <input
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  id="start-date"
                  type="date"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                  htmlFor="end-date"
                >
                  End Date
                </label>
                <input
                  {...register("endDate", {
                    required: "End date is required",
                  })}
                  className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  id="end-date"
                  type="date"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                htmlFor="payment-method"
              >
                Payment Method
              </label>
              <div className="relative">
                <select
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                  className="w-full appearance-none px-3 py-2.5 pr-9 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  id="payment-method"
                >
                  <option value="">Select method</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* UPI Fields */}
            {selectedPaymentMethod === "UPI" && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  UPI ID
                </label>
                <input
                  {...register("upiId", { required: "UPI ID is required" })}
                  type="text"
                  placeholder="e.g., yourname@upi"
                  className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                />

                {errors.upiId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.upiId.message}
                  </p>
                )}
              </div>
            )}

            {/* Bank Fields */}
            {selectedPaymentMethod === "Bank" && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Account Number
                    </label>
                    <input
                      {...register("bankAccount.accountNumber", {
                        required: "Account number is required",
                      })}
                      type="text"
                      placeholder="Enter account number"
                      className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                    />

                    {errors.bankAccount?.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bankAccount.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      IFSC Code
                    </label>
                    <input
                      {...register("bankAccount.ifsc", {
                        required: "IFSC code is required",
                      })}
                      type="text"
                      placeholder="Enter IFSC code"
                      className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                    />

                    {errors.bankAccount?.ifsc && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bankAccount.ifsc.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    {...register("bankAccount.accountHolder", {
                      required: "Account holder name is required",
                    })}
                    type="text"
                    placeholder="Enter account holder name"
                    className="w-full px-3 py-2.5 bg-indigo-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  />

                  {errors.bankAccount?.accountHolder && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bankAccount.accountHolder.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;
