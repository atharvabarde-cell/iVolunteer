"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Target, ArrowRight, Star } from "lucide-react";
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Sponsorship Opportunities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partner with us to create meaningful impact through corporate social responsibility initiatives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              Loading sponsorship opportunities...
            </p>
          ) : (
            opportunities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Users size={16} />
                      <span>{item.participants}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Target size={16} />
                      <span>Goal: {item.goal}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      Sponsor Event <ArrowRight size={16} />
                    </button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
