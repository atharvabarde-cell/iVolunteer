"use client";
import React, { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";

const Donationeventbutton = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="md:w-[45%] w-[90%] mt-3">
      <div className="h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex-1 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Manage Your Donation Events
              </h3>
            </div>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              Raise funds and donations to support your cause and make a greater impact
            </p>
          </div>

          {/* Button Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Ready to create</span>
            </div>
            
            <Link 
              href="/donationevent-form" 
              className="w-full sm:w-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button
                className={`
                  flex items-center justify-center gap-3 w-full
                  bg-gradient-to-r from-blue-600 to-blue-700
                  hover:from-blue-700 hover:to-blue-800
                  text-white font-semibold
                  py-3.5 px-8
                  rounded-xl
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-200
                  transform hover:scale-105
                  border border-blue-500
                  whitespace-nowrap
                  relative overflow-hidden
                `}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-white/20 transform ${isHovered ? 'scale-100' : 'scale-0'} transition-transform duration-300`} />
                
                <Plus size={20} className="relative z-10" />
                <span className="relative z-10">Add Donation Event</span>
                <div className={`relative z-10 transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : 'translate-x-0'}`}>
                  →
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Link href="/add-event">
          <button
            className={`
              flex items-center justify-center
              bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              text-white
              rounded-full
              p-5
              shadow-xl
              hover:shadow-2xl
              transition-all duration-200
              transform hover:scale-110
              border border-blue-500
            `}
          >
            <Plus size={24} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Donationeventbutton;