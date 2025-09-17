import React from "react";
import { Award, Star, Coins } from "lucide-react";
import { motion, Variants } from "framer-motion";

const rewards = [
  { id: 1, name: "Community Champion" },
  { id: 2, name: "Event Enthusiast" },
  { id: 3, name: "Volunteer Veteran" },
  { id: 4, name: "Social Star" },
];

// ✅ Strongly typed animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Gamified = () => {
  return (
    <section className="w-full px-6 py-20 bg-gradient-to-br from-blue-100 to-white mt-20">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Gamified Rewards
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-start"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Left */}
        <motion.div className="space-y-8" variants={item}>
          <h2 className="text-2xl font-bold text-gray-900">
            Earn Coins & Badges
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Your efforts are recognized and rewarded. Collect coins for every
            activity and exchange them for coupons & gifts. Unlock exclusive
            badges to showcase your achievements.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              className="flex items-center gap-4 border rounded-2xl p-6 bg-white shadow-md w-full"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <Coins className="text-yellow-500 h-8 w-8" />
              <div>
                <h4 className="text-gray-600 text-base">Total Coins</h4>
                <p className="text-3xl font-extrabold text-gray-900">1,250</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 border rounded-2xl p-6 bg-white shadow-md w-full"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="text-green-600 h-8 w-8" />
              <div>
                <h4 className="text-gray-600 text-base">Badges Earned</h4>
                <p className="text-3xl font-extrabold text-gray-900">5</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right - Rewards */}
        <motion.div variants={item}>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Rewards
          </h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={container}
          >
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                className="flex items-center gap-4 border rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition"
                variants={item}
                whileHover={{ scale: 1.05 }}
              >
                <Star className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-lg text-gray-800">
                  {reward.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Gamified;
