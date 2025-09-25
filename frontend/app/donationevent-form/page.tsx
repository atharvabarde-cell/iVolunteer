// src/app/donation-event/AddEventPage.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDonationEvent } from "@/contexts/donationevents-context";
import { toast } from "react-toastify";

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
    <div className="max-w-lg mx-auto p-6 border rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Donation Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <input
            {...register("goalAmount", {
              required: "Goal amount is required",
              min: { value: 1, message: "Goal amount must be at least 1" },
            })}
            type="number"
            placeholder="Goal Amount"
            className="w-full p-2 border rounded"
          />
          {errors.goalAmount && <p className="text-red-500 text-sm">{errors.goalAmount.message}</p>}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
              className="w-full p-2 border rounded"
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              {...register("endDate", { required: "End date is required" })}
              type="date"
              className="w-full p-2 border rounded"
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            {...register("paymentMethod", { required: "Payment method is required" })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select method</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank</option>
            <option value="PayPal">PayPal</option>
          </select>
          {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
        </div>

        {/* UPI */}
        {selectedPaymentMethod === "UPI" && (
          <div>
            <input
              {...register("upiId", { required: "UPI ID is required" })}
              type="text"
              placeholder="UPI ID (e.g., abc@upi)"
              className="w-full p-2 border rounded"
            />
            {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId.message}</p>}
          </div>
        )}

        {/* Bank */}
        {selectedPaymentMethod === "Bank" && (
          <div className="space-y-2">
            <input
              {...register("bankAccount.accountNumber", { required: "Account number is required" })}
              type="text"
              placeholder="Account Number"
              className="w-full p-2 border rounded"
            />
            <input
              {...register("bankAccount.ifsc", { required: "IFSC code is required" })}
              type="text"
              placeholder="IFSC Code"
              className="w-full p-2 border rounded"
            />
            <input
              {...register("bankAccount.accountHolder", { required: "Account holder name is required" })}
              type="text"
              placeholder="Account Holder Name"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
