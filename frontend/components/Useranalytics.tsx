"use client";
import React from "react";
import { motion } from "framer-motion";
import { Coins, Award, Flame, PiggyBank, Wallet, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add this import

const Useranalytics = () => {
  const {
    activeCoins,
    totalCoinsEarned,
    totalSpend,
    badges,
    streak,
    isLoading,
  } = useUser();

  const router = useRouter(); 

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
      value: badges || 0, // Use badges from context instead of hardcoded 0
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-l-4 border-emerald-500",
      link: "/badges",
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

  if (isLoading) {
    return (
      <section className="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          <div className="grid  grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-5 gap-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                onClick={() => stat.link && router.push(stat.link)} // Fixed onClick handler
                className={`bg-white border-l-4 border-gray-300 rounded-lg p-5 shadow-sm flex flex-col justify-between h-full ${
                  stat.link ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {stats.map((stat, index) => {
            const CardContent = (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  scale: stat.link ? 1.05 : 1,
                  transition: { duration: 0.2 },
                }}
                className={`${stat.bg} ${
                  stat.border
                } rounded-lg p-5 shadow-sm hover:shadow-md flex flex-col justify-between h-full ${
                  stat.link ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <div className="p-2 rounded-lg bg-white shadow-xs">
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            );

            return stat.link ? (
              <Link key={stat.title} href={stat.link} className="block">
                {CardContent}
              </Link>
            ) : (
              CardContent
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Useranalytics;
