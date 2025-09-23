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
  Image,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-full mr-3">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create New Event</h2>
                <p className="text-blue-100 text-sm">
                  Fill in the details to organize a new volunteer event
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-5 mt-5">
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-5 mt-5">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Title */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("title", {
                      required: "Event title is required",
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter event title"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description should be at least 10 characters",
                      },
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                    placeholder="Describe the event, its purpose, and what volunteers will be doing..."
                  />
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </motion.div>

              {/* Location */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter event location"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location.message}
                  </p>
                )}
              </motion.div>

              {/* Date of Event */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Event
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.date.message}
                  </p>
                )}
              </motion.div>

              {/* Time of Event */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Event
                </label>
                <div className="relative">
                  <input
                    type="time"
                    {...register("time", { required: "Time is required" })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.time.message}
                  </p>
                )}
              </motion.div>

              {/* Duration */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("duration", {
                      required: "Duration is required",
                      min: {
                        value: 1,
                        message: "Duration must be at least 1 hour",
                      },
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Duration in hours"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.duration && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </motion.div>

              {/* Category */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </motion.div>

              {/* Event Status */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Status
                </label>
                <div className="relative">
                  <select
                    {...register("eventStatus", {
                      required: "Event status is required",
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                  >
                    {eventStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.eventStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.eventStatus.message}
                  </p>
                )}
              </motion.div>

              {/* Max Participants */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Maximum number of participants"
                  />
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.maxParticipants && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.maxParticipants.message}
                  </p>
                )}
              </motion.div>

              {/* Points Offered */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Offered
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("pointsOffered", {
                      required: "Points offered is required",
                      min: { value: 0, message: "Points cannot be negative" },
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Points offered to volunteers"
                  />
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.pointsOffered && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pointsOffered.message}
                  </p>
                )}
              </motion.div>

              {/* Single Image Upload */}
              {/* Event Image */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("imageFile" as any)} // temporary type hack for react-hook-form
                  className="w-full border rounded-lg p-2"
                />
              </motion.div>
            </div>

            {/* Requirements */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
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
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter a requirement (e.g., Gloves, Trash Bags)"
                      />
                      <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {requirementInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirementInput(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirementInput}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                >
                  <PlusCircle className="w-3 h-3 mr-1" /> Add Requirement
                </button>
              </div>
            </motion.div>

            {/* Sponsorship Required */}
            <motion.div variants={itemVariants} className="pt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("sponsorshipRequired")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
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
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsorship Amount ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("sponsorshipAmount", {
                      min: { value: 0, message: "Amount cannot be negative" },
                    })}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter sponsorship amount"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {errors.sponsorshipAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sponsorshipAmount.message}
                  </p>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-3"
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Event..." : "Create Event"}
              </button>
            </motion.div>
          </motion.form>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-center text-gray-600 text-xs"
        >
          <p>Your event will be reviewed and published within 24 hours</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateEventPage;
