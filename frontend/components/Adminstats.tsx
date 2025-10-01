"use client";

import React, { useEffect } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { Users, Calendar, Clock, Gift } from "lucide-react"; // icons

const Adminstats = () => {
  const {
    pendingEvents,
    pendingDonationEvents,
    fetchPendingEvents,
    fetchPendingDonationEvents,
  } = useAdmin();

  // Fetch latest data on mount
  useEffect(() => {
    fetchPendingEvents();
    fetchPendingDonationEvents();
  }, []);

  // Dashboard metrics
  const metrics = [
    {
      title: "Pending Events",
      value: pendingEvents.length,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Donation Events",
      value: pendingDonationEvents.length,
      icon: <Gift className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Events",
      value: pendingEvents.length + pendingDonationEvents.length,
      icon: <Clock className="w-6 h-6 text-green-600" />,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${metric.color}`}
            >
              {metric.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </h3>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Adminstats;
