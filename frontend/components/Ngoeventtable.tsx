"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  Search,
  Filter,
  Calendar,
} from "lucide-react";

const events = [
  {
    id: 1,
    name: "Tree Plantation Drive",
    date: "Oct 12, 2025",
    location: "Central Park, NY",
    needed: 50,
    filled: 35,
    status: "Ongoing",
    progress: 70,
  },
  {
    id: 2,
    name: "Food Distribution Camp",
    date: "Oct 20, 2025",
    location: "Downtown Shelter",
    needed: 30,
    filled: 30,
    status: "Full",
    progress: 100,
  },
  {
    id: 3,
    name: "Beach Cleanup",
    date: "Nov 05, 2025",
    location: "Miami Beach",
    needed: 40,
    filled: 20,
    status: "Open",
    progress: 50,
  },
  {
    id: 4,
    name: "Education Outreach",
    date: "Nov 15, 2025",
    location: "City Library",
    needed: 25,
    filled: 15,
    status: "Open",
    progress: 60,
  },
  {
    id: 5,
    name: "Winter Clothing Drive",
    date: "Dec 01, 2025",
    location: "Community Center",
    needed: 35,
    filled: 35,
    status: "Full",
    progress: 100,
  },
];

const Ngoeventtable = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });

  // Fixed sorting function
  const sortedEvents = [...events].sort((a, b) => {
    // Handle different data types appropriately
    let aValue = (a as any)[sortConfig.key];
    let bValue = (b as any)[sortConfig.key];

    // For string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // For date comparison - convert to timestamps
    if (sortConfig.key === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEvents = sortedEvents
    .filter((event) => {
      if (filter === "all") return true;
      return event.status.toLowerCase() === filter.toLowerCase();
    })
    .filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const requestSort = (key: keyof (typeof events)[0]) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <section className="px-4 py-6 md:px-4 md:py-8 rounded-2xl border border-gray-100 md:m-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-500 mt-1">
            Manage and track your upcoming volunteer events
          </p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
          <Calendar className="w-4 h-4" />
          View All Events
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6  ">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
              filter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            <Filter className="w-4 h-4" />
            All
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("open")}
          >
            Open
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "ongoing"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filter === "full"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("full")}
          >
            Full
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 text-left text-sm text-gray-700">
              <th
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center gap-1">
                  Event Name
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortConfig.key === "name" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </th>
              <th
                className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortConfig.key === "date" &&
                      sortConfig.direction === "descending"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Volunteers</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-100 bg-white hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {event.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-600">{event.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-600">{event.location}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-gray-800 font-semibold">
                        {event.filled}/{event.needed}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            event.progress === 100
                              ? "bg-green-500"
                              : event.progress >= 70
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {event.status === "Full" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Full
                      </span>
                    ) : event.status === "Ongoing" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Ongoing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5" /> Open
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-4 py-1.5 rounded-lg text-sm font-medium transition bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                      Manage
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No events found matching your criteria
          </div>
        )}
      </div>
    </section>
  );
};

export default Ngoeventtable;
