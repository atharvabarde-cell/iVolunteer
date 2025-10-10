"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Target, ArrowRight, Star, Building2, Heart, TrendingUp } from "lucide-react";
import { useCorporate } from "../contexts/corporate-context";

export default function Sponsorshipopp() {
  const { opportunities } = useCorporate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-[#5D8A6E] to-[#7AA981] rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-[#5D8A6E] bg-clip-text text-transparent">
              Sponsorship Opportunities
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Partner with us to create meaningful impact through corporate social responsibility initiatives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.length === 0 ? (
            <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-3xl p-16 text-center border border-green-100 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 mb-6">
                  <Building2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No Opportunities Available</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Check back later for new sponsorship opportunities
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
              </div>
            </div>
          ) : (
            opportunities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Header with Category and Featured Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#5D8A6E] rounded-full"></div>
                    <span className="text-sm font-semibold text-[#5D8A6E] bg-green-50 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  
                  {item.featured && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>

                {/* Title and Description */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5D8A6E] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Participants</p>
                      <p className="text-sm font-semibold text-gray-900">{item.participants}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Goal</p>
                      <p className="text-sm font-semibold text-gray-900">{item.goal}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (Optional) */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#5D8A6E] to-[#7AA981] h-2 rounded-full transition-all duration-500"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-green-100">
                  <button className="group flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Heart className="w-4 h-4" />
                    Sponsor Event
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  {/* <button className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    Details
                  </button> */}
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">24+</h3>
            <p className="text-gray-600">Successful Partnerships</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000+</h3>
            <p className="text-gray-600">Lives Impacted</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">15+</h3>
            <p className="text-gray-600">Corporate Partners</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}