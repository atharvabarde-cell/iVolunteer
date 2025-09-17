"use client";
import Image from "next/image";
import React from "react";
import { motion, Variants } from "framer-motion";

const steps = [
  {
    step: 1,
    title: "Discover",
    desc: "Explore a wide range of volunteering opportunities, community events, and charitable causes.",
  },
  {
    step: 2,
    title: "Participate",
    desc: "Engage in activities that match your interests and contribute your time & skills.",
  },
  {
    step: 3,
    title: "Get Rewarded",
    desc: "Earn recognition, badges, and rewards for your valuable contributions.",
  },
];

// ✅ Animation Variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Howitworks = () => {
  return (
    <section className="w-full px-6 py-20 ">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        How it Works
      </motion.h1>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        {/* Left - Image */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/howitworkposter.jpg"
            alt="How it works illustration"
            width={500}
            height={400}
            className="rounded-xl shadow-"
          />
        </motion.div>

        {/* Right - Steps */}
        <motion.div
          className="md:w-1/2 space-y-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Journey with iVolunteer
            </h2>
            <p className="text-lg text-gray-600">
              Joining iVolunteer is simple. Discover opportunities that match
              your interests, contribute to your community, and see your impact
              grow.
            </p>
          </div>

          {/* Steps list */}
          <div className="space-y-6">
            {steps.map((step) => (
              <motion.div
                key={step.step}
                className="flex items-start gap-4"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Howitworks;
