"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  PlusCircle,
  DollarSign,
  Tag,
  AlertCircle,
  Clock,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { useNGO } from "@/contexts/ngo-context";

type EventFormData = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  category: string;
  maxParticipants: number;
  pointsOffered: number;
  requirements: string;
  sponsorshipRequired: boolean;
  sponsorshipAmount: number;
  imageUrl: string;
  imageCaption: string;
  eventStatus: string;
};

const CreateEventPage = () => {
  const { createEvent, loading, error } = useNGO();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EventFormData>({
    defaultValues: {
      pointsOffered: 50,
      sponsorshipRequired: true,
      sponsorshipAmount: 0,
      duration: 3,
      maxParticipants: 50,
      eventStatus: "upcoming",
    },
  });

  const sponsorshipRequired = watch("sponsorshipRequired");
  const [requirementInputs, setRequirementInputs] = useState([""]);
  const [successMessage, setSuccessMessage] = useState("");

  const addRequirementInput = () => {
    setRequirementInputs([...requirementInputs, ""]);
  };

  const removeRequirementInput = (index: number) => {
    if (requirementInputs.length > 1) {
      setRequirementInputs(requirementInputs.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      // Format the data to match the API structure
      const formattedData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(`${data.date}T${data.time}`).toISOString(),
        time: data.time,
        duration: Number(data.duration),
        category: data.category,
        maxParticipants: Number(data.maxParticipants),
        pointsOffered: Number(data.pointsOffered),
        requirements: requirementInputs.filter((req) => req.trim() !== ""),
        sponsorshipRequired: data.sponsorshipRequired,
        participants: [],
        sponsorshipAmount: data.sponsorshipRequired
          ? Number(data.sponsorshipAmount)
          : 0,
        image: {
          url: data.imageUrl,
          caption: data.imageCaption || "Event Image",
        },
        eventStatus: data.eventStatus,
      };

      await createEvent(formattedData);
      setSuccessMessage("Event created successfully!");
      reset(); // clear form after successful submission
      setRequirementInputs([""]); // reset requirements
    } catch (err) {
      // Error is already handled in the context
      console.error("Error in form submission:", err);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const categories = [
    "environmental",
    "education",
    "healthcare",
    "community",
    "animals",
    "eldercare",
    "disability",
    "arts",
    "other",
  ];

  const eventStatuses = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" },
  ];

  return (
    <div className="min-h-screen bg-[conic-gradient(at_20%_10%,#eef2ff_10%,#e0e7ff_30%,#eef2ff_60%)] py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-full">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Create New Event
                </h2>
                <p className="text-blue-100 text-sm">
                  Fill in the details to organize a new volunteer event
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 text-red-700 p-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mx-6 mt-6 rounded-lg border border-green-200 bg-green-50 text-green-700 p-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-7 space-y-8"
          >
            {/* Basic Info */}
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Basic information
                </h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </header>

              <div className="grid grid-cols-1 gap-5">
                {/* Title */}
                <motion.div variants={itemVariants} className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Event Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("title", {
                        required: "Event title is required",
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none px-10 py-2.5 shadow-sm placeholder:text-gray-400"
                      placeholder="Enter event title"
                    />

                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants} className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message:
                            "Description should be at least 10 characters",
                        },
                      })}
                      className="w-full min-h-[110px] rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none px-10 py-2.5 shadow-sm placeholder:text-gray-400"
                      placeholder="Describe the event, its purpose, and what volunteers will be doing..."
                    />

                    <FileText className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants} className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("location", {
                        required: "Location is required",
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none px-10 py-2.5 shadow-sm placeholder:text-gray-400"
                      placeholder="Enter event location"
                    />

                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Schedule */}
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Schedule
                </h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Date of the Event */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Date of Event
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                    />

                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </motion.div>

                {/* Time of the Event */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Time of Event
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      {...register("time", { required: "Time is required" })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                    />

                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </motion.div>

                {/* Duration */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Duration (hours)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        // blocks the minus, plus and exponent
                        if (["-", "+", "e", "E"].includes(e.key))
                          e.preventDefault();
                      }}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        if (el.value && Number(el.value) < 1) el.value = "1";
                      }}
                      {...register("duration", {
                        required: "Duration is required",
                        min: {
                          value: 1,
                          message: "Duration must be at least 1 hour",
                        },
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                      placeholder="Duration in hours"
                    />

                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.duration.message}
                    </p>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Event Details */}
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Event details
                </h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-10 py-2.5 shadow-sm appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><path fill=%22%236b7280%22 d=%22M5.5 7.5L10 12l4.5-4.5%22/></svg>')] bg-no-repeat bg-[length:16px] bg-[right_0.75rem_center]"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </motion.div>

                {/* Event Status */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Event Status
                  </label>
                  <div className="relative">
                    <select
                      {...register("eventStatus", {
                        required: "Event status is required",
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-10 py-2.5 shadow-sm appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><path fill=%22%236b7280%22 d=%22M5.5 7.5L10 12l4.5-4.5%22/></svg>')] bg-no-repeat bg-[length:16px] bg-[right_0.75rem_center]"
                    >
                      {eventStatuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.eventStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.eventStatus.message}
                    </p>
                  )}
                </motion.div>

                {/* Max Participants */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Max Participants
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("maxParticipants", {
                        required: "Number of participants is required",
                        min: {
                          value: 1,
                          message: "At least 1 participant is required",
                        },
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                      placeholder="Maximum number of participants"
                    />
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.maxParticipants && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.maxParticipants.message}
                    </p>
                  )}
                </motion.div>

                {/* Points Offered */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Points Offered
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("pointsOffered", {
                        required: "Points offered is required",
                        min: { value: 0, message: "Points cannot be negative" },
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                      placeholder="Points offered to volunteers"
                    />
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.pointsOffered && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pointsOffered.message}
                    </p>
                  )}
                </motion.div>

                {/* Image */}
                {/* Single Image Upload */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("imageFile" as any)}
                    className="w-full rounded-xl border border-dashed border-gray-300 p-3 hover:border-gray-400 transition"
                  />
                </motion.div>
              </div>
            </section>

            {/* Requirements */}
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Requirements
                </h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </header>

              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  {requirementInputs.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={requirementInputs[index]}
                          onChange={(e) => {
                            const newRequirements = [...requirementInputs];
                            newRequirements[index] = e.target.value;
                            setRequirementInputs(newRequirements);
                          }}
                          className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm placeholder:text-gray-400"
                          placeholder="Enter a requirement (e.g., Gloves, Trash Bags)"
                        />
                        <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      {requirementInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirementInput(index)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirementInput}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" /> Add Requirement
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Sponsorship */}
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Sponsorship
                </h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </header>

              <motion.div variants={itemVariants} className="pt-1">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("sponsorshipRequired")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Sponsorship Required
                  </span>
                </label>
              </motion.div>

              {/* Sponsorship Amount - only show if sponsorship is required */}
              {sponsorshipRequired && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Sponsorship Amount ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("sponsorshipAmount", {
                        min: { value: 0, message: "Amount cannot be negative" },
                      })}
                      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none pl-10 pr-4 py-2.5 shadow-sm"
                      placeholder="Enter sponsorship amount"
                    />
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.sponsorshipAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.sponsorshipAmount.message}
                    </p>
                  )}
                </motion.div>
              )}
            </section>

            {/* Submit */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-medium shadow-md hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Event..." : "Create Event"}
              </button>
            </motion.div>
          </motion.form>
        </div>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-center text-gray-600 text-sm"
        >
          <p>Your event will be reviewed and published within 24 hours</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateEventPage;
