"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, FileText, PlusCircle } from "lucide-react";

type EventFormData = {
  eventName: string;
  date: string;
  location: string;
  volunteersRequired: number;
  description: string;
};

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>();

  const onSubmit = (data: EventFormData) => {
    console.log("Event Data:", data);
    // Here you would typically send data to your API
    reset(); // clear form after submit
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen   bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <PlusCircle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center">Create New Event</h2>
            <p className="text-blue-100 text-center mt-2">Fill in the details to organize a new volunteer event</p>
          </div>

          {/* Form */}
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)} 
            className="p-6 space-y-5"
          >
            {/* Event Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("eventName", { required: "Event name is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter event name"
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>
              )}
            </motion.div>

            {/* Date of Event */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Event</label>
              <div className="relative">
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </motion.div>

            {/* Location */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("location", { required: "Location is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter event location"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </motion.div>

            {/* Volunteers Required */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Required</label>
              <div className="relative">
                <input
                  type="number"
                  {...register("volunteersRequired", {
                    required: "Number of volunteers is required",
                    min: { value: 1, message: "At least 1 volunteer is required" },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter number of volunteers needed"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.volunteersRequired && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.volunteersRequired.message}
                </p>
              )}
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="relative">
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description should be at least 10 characters",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
                  placeholder="Describe the event, its purpose, and what volunteers will be doing..."
                />
                <FileText className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-md"
              >
                Create Event
              </button>
            </motion.div>
          </motion.form>
        </div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center text-gray-600 text-sm"
        >
          <p>Your event will be reviewed and published within 24 hours</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default page;