"use client"
import React from 'react'
import { motion } from "framer-motion";


const Hero = () => {
  return (
   <motion.section
      className="flex flex-col items-center text-center px-4"
      initial={{ opacity: 0, y: 50 }}       
      whileInView={{ opacity: 1, y: 0 }}    
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}             
    >
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mt-20 leading-tight b">
        Make a Difference, Get Rewarded
      </h1>

      {/* Paragraph */}
      <p className="text-base sm:text-lg md:text-2xl mt-3 md:w-[50%] w-full text-gray-500">
        Join iVolunteer to connect with your community, participate in meaningful
        activities, and earn exciting rewards for your contributions.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center mt-6 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-md bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700"
        >
          Get Started
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-md bg-[#f7f5f3] px-6 py-3 text-sm sm:text-base font-semibold text-gray-800 shadow-md transition-all duration-300 hover:bg-gray-200"
        >
          Learn More
        </motion.button>
      </div>
    </motion.section>
  )
}

export default Hero