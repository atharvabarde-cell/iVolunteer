"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, QuoteIcon } from "lucide-react";
import { toast } from "react-toastify";

const quotes = [
  "Believe you can and you're halfway there.",
  "Do something today that your future self will thank you for.",
  "The best time to start was yesterday. The next best time is now.",
  "Push yourself, because no one else is going to do it for you.",
  "Don't stop until you're proud.",
];

const Dailyquote = () => {
  const [collected, setCollected] = useState(false);
  const [todayQuote, setTodayQuote] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const quoteIndex = new Date().getDate() % quotes.length;
    setTodayQuote(quotes[quoteIndex]);

    const lastCollected = localStorage.getItem("lastCollectedDate");
    if (lastCollected === today) {
      setCollected(true);
    }
  }, []);

  const handleCollect = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("lastCollectedDate", today);
    setCollected(true);
    toast.success("You collected +10 coins!");
  };

  return (
    <section className="flex items-center justify-center px-4 py-6 md:px-8 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 w-full max-w-8xl flex flex-col-reverse md:flex-row items-center justify-between gap-8 border border-gray-100 md:mr-8 md:ml-8"
      >
        {/* Left Side - Text Content */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-semibold text-blue-700 tracking-wide uppercase">
              Daily Inspiration
            </p>
          </div>

          <div className="relative mb-6">
            <QuoteIcon className="absolute -left-6 -top-2 w-12 h-12 text-blue-200 opacity-80" />
            <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed ml-6">
              "{todayQuote}"
            </p>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            Collect your daily bonus of 10 coins for motivation!
          </p>

          {!collected ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCollect}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Collect 10 Coins
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Today's reward collected!</span>
            </motion.div>
          )}
        </div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 relative"
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0"></div>
            <Image
            src="/images/dailyreward.jpg"
            alt="Daily Bonus"
            width={200}
            height={200}
            className="rounded-lg object-contain"
          />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-1" />
                +10 Coins
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Dailyquote;
