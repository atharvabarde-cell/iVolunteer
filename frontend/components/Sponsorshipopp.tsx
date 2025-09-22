"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Target,
  ArrowRight,
  Star
} from "lucide-react";

const opportunities = [
  {
    title: "EcoAction Tree Planting Event",
    description: "Join us in planting 10,000 trees to combat deforestation and promote environmental sustainability across urban areas.",
    image: "/images/treeplanting.avif",
    date: "June 15, 2023",
    location: "Central Park, New York",
    participants: "500+ volunteers",
    goal: "10,000 trees",
    category: "Environmental",
    featured: true
  },
  {
    title: "Coastal Cleanup Initiative",
    description: "Help us clean up our beaches and protect marine life from pollution while promoting ocean conservation awareness.",
    image: "/images/coastalclean.avif",
    date: "July 22, 2023",
    location: "Santa Monica Beach, CA",
    participants: "300+ volunteers",
    goal: "5 tons of waste",
    category: "Conservation",
    featured: false
  },
  {
    title: "Community Food Drive",
    description: "Support our food drive to help families in need and combat food insecurity in local communities through corporate sponsorship.",
    image: "/images/fooddrive.avif",
    date: "August 10, 2023",
    location: "Chicago, Illinois",
    participants: "200+ volunteers",
    goal: "10,000 meals",
    category: "Social Welfare",
    featured: false
  },
];

export default function Sponsorshipopp() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  </div>
                )}
                
                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Stats */}
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
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Sponsor Event
                    <ArrowRight size={16} />
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Custom Sponsorship Packages Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We can create tailored sponsorship opportunities that align with your brand values and CSR objectives.
            </p>
            <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2">
              Contact Our Partnership Team
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}