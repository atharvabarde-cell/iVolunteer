"use client";
import React from "react";
import { motion } from "framer-motion";
import { Coins, Award, Flame, PiggyBank, Wallet } from "lucide-react";
import { useUser } from "@/contexts/user-context";

const Useranalytics = () => {
  const { activeCoins, totalCoinsEarned, totalSpend, badges, streak } = useUser();

  const stats = [
    {
      title: "Active Coins",
      value: activeCoins,
      icon: <Coins className="w-6 h-6 text-blue-600" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-l-4 border-blue-500",
    },
    {
      title: "Total Coins Earned",
      value: totalCoinsEarned,
      icon: <PiggyBank className="w-6 h-6 text-purple-600" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-l-4 border-purple-500",
    },
    {
      title: "Total Spend",
      value: totalSpend,
      icon: <Wallet className="w-6 h-6 text-rose-600" />,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-l-4 border-rose-500",
    },
    {
      title: "Badges",
      value: badges,
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-l-4 border-emerald-500",
    },
    {
      title: "Streak",
      value: streak,
      icon: <Flame className="w-6 h-6 text-amber-600" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-l-4 border-amber-500",
    },
  ];

  return (
    <section className="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10"
        >
          Welcome back, Sarah
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${stat.bg} ${stat.border} rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full`}
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                <div className="p-2 rounded-lg bg-white shadow-xs">
                  {stat.icon}
                </div>
              </div>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Useranalytics;