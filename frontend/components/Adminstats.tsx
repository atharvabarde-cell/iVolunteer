"use client";

import React from "react";
import { Users, HandHeart, Briefcase, ClipboardList, TrendingUp, AlertCircle } from "lucide-react";
import { useAdmin } from "@/contexts/admin-context";
import { motion } from "framer-motion";

const Adminstats = () => {
  const {
    totalUser,
    activeNgo,
    corporatePartner,
    pendingReq,
  } = useAdmin();

  // Calculate percentages for progress indicators (example values)
  const progressValues = {
    totalUser: 75, // 75% of goal
    activeNgo: 60, // 60% of goal
    corporatePartner: 45, // 45% of goal
    pendingReq: Math.min(100, (pendingReq / 50) * 100), // Scale based on 50 as "high"
  };

  const stats = [
    {
      title: "Total Users",
      value: totalUser,
      icon: <Users className="text-white" size={20} />,
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
      trend: "+12%",
      progress: progressValues.totalUser,
      goal: "10K",
    },
    {
      title: "Active NGOs",
      value: activeNgo,
      icon: <HandHeart className="text-white" size={20} />,
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600",
      trend: "+5%",
      progress: progressValues.activeNgo,
      goal: "200",
    },
    {
      title: "Corporate Partners",
      value: corporatePartner,
      icon: <Briefcase className="text-white" size={20} />,
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
      trend: "+8%",
      progress: progressValues.corporatePartner,
      goal: "100",
    },
    {
      title: "Pending Requests",
      value: pendingReq,
      icon: <ClipboardList className="text-white" size={20} />,
      color: "bg-orange-500",
      gradient: "from-orange-500 to-orange-600",
      trend: pendingReq > 0 ? "Needs review" : "All clear",
      progress: progressValues.pendingReq,
      goal: "0",
      alert: pendingReq > 0,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50">
      {stats.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
          className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative"
        >
          {item.alert && (
            <div className="absolute -top-2 -right-2">
              <div className="bg-red-500 text-white p-1 rounded-full">
                <AlertCircle size={14} />
              </div>
            </div>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">{item.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${item.gradient}`}>
              {item.icon}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${item.gradient}`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <p className={`text-xs font-medium ${
              item.alert 
                ? "text-red-600 flex items-center gap-1" 
                : "text-gray-500"
            }`}>
              {item.alert && <AlertCircle size={12} />}
              {item.trend}
            </p>
            <p className="text-xs text-gray-500">Goal: {item.goal}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Adminstats;