"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, HeartHandshake, Clock } from "lucide-react";

const activities = [
  {
    title: "Join a Community",
    desc: "Connect with like-minded individuals and make a difference together.",
    link: "Explore Communities",
    href: "#",
    img: "/images/community.avif",
    icon: <Users className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  {
    title: "Donate",
    desc: "Support environmental causes with your generous contributions.",
    link: "Donate Now",
    href: "#",
    img: "/images/donate.jpg",
    icon: <HeartHandshake className="w-5 h-5" />,
    color: "bg-green-500"
  },
  {
    title: "Become a Volunteer",
    desc: "Contribute your time and skills to meaningful initiatives.",
    link: "Get Started",
    href: "#",
    img: "/images/volunteer.jpg",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-purple-500"
  },
];

const Useractivity = () => {
  return (
    <section className="px-4 py-12 md:px-8 md:py-16 lg:px-16 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get Involved</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover meaningful ways to contribute to your community and make a positive impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
            >
              {/* Image with overlay */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Icon badge */}
                <div className={`absolute top-4 right-4 ${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white`}>
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  {item.desc}
                </p>
                <a
                  href={item.href}
                  className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors group-hover:gap-2 gap-1"
                >
                  <span>{item.link}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Ready to make a difference?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2">
            Explore All Opportunities
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Useractivity;