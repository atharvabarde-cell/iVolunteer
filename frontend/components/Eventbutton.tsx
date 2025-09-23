"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

const Eventbutton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  return (
    <div className="max-w-8xl mx-auto px-4 md:ml-10 md:mr-10 md:mb-0 mb-8">
      <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">
              Manage Your Events
            </h3>
            <p className="text-gray-600 text-md font-medium">
              Create and organize volunteer events to maximize your impact
            </p>
          </div>
          <button
            className={`
              flex items-center justify-center gap-2 md:w-fit w-full
              bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              text-white font-medium
              py-2.5 px-5
              rounded-lg
              shadow-sm
              hover:shadow-md
              transition-all duration-200
              transform hover:scale-105
              border border-blue-500
              whitespace-nowrap
            `}
          >
            <Plus size={18} />
            <Link href="/add-event">Add Event</Link>
          </button>
        </div>
      </div>

      {/* Floating action button version for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <button
          className={`
            flex items-center justify-center
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-full
            p-4
            shadow-lg
            hover:shadow-xl
            transition-all duration-200
          `}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Eventbutton;
