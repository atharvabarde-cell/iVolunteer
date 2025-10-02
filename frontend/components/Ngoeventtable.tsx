"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Users, ChevronDown, Search, Filter, Calendar } from "lucide-react";
import api from "@/lib/api"; // your axios instance

interface EventItem {
  _id: string;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  filled: number;
  status: "Open" | "Ongoing" | "Full" | "pending" | "approved" | "rejected";
  progress: number;
  eventStatus?: string;
  participants?: any[];
}

const Ngoeventtable = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Add cache-busting parameter to prevent 304 responses
      const timestamp = new Date().getTime();
      const res = await api.get<{ success: boolean; events: any[] }>(`/v1/event/organization?_t=${timestamp}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      });
      
      console.log("Fetched events:", res.data); // Debug log
      
      // Map backend fields to frontend display fields
      const mappedEvents = res.data.events.map((e) => {
        const participantCount = e.participants?.length || 0;
        const progress = e.maxParticipants ? Math.round((participantCount / e.maxParticipants) * 100) : 0;
        
        // Determine display status based on event status and capacity
        let displayStatus: "Open" | "Ongoing" | "Full" | "pending" | "approved" | "rejected" = e.status;
        if (e.status === "approved") {
          if (participantCount >= e.maxParticipants) {
            displayStatus = "Full";
          } else if (new Date(e.date) < new Date()) {
            displayStatus = "Ongoing";
          } else {
            displayStatus = "Open";
          }
        }
        
        return {
          _id: e._id,
          title: e.title,
          date: new Date(e.date).toLocaleDateString(),
          location: e.location,
          filled: participantCount,
          maxParticipants: e.maxParticipants,
          status: displayStatus,
          progress: progress,
          eventStatus: e.eventStatus,
          participants: e.participants
        };
      });
      setEvents(mappedEvents);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Sorting
  const sortedEvents = [...events].sort((a, b) => {
    let aValue: any = (a as any)[sortConfig.key];
    let bValue: any = (b as any)[sortConfig.key];

    if (sortConfig.key === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  // Filtering
  const filteredEvents = sortedEvents
    .filter((event) => (filter === "all" ? true : event.status.toLowerCase() === filter.toLowerCase()))
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const requestSort = (key: keyof EventItem) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading events...</div>;

  return (
    <section className="px-4 py-6 md:px-4 md:py-8 rounded-2xl border border-gray-100 md:m-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Upcoming Events</h2>
          <p className="text-gray-500 mt-1">Manage and track your upcoming volunteer events</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
          <Calendar className="w-4 h-4" />
          View All Events
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          {["all", "open", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                filter === status
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilter(status)}
            >
              <Filter className="w-4 h-4" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 text-left text-sm text-gray-700">
              {["title", "date", "location", "volunteers", "status", "action"].map((col) => (
                <th
                  key={col}
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => col !== "volunteers" && col !== "action" && requestSort(col as keyof EventItem)}
                >
                  <div className="flex items-center gap-1">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {col !== "volunteers" && col !== "action" && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          sortConfig.key === col && sortConfig.direction === "descending" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.tr
                  key={event._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-100 bg-white hover:bg-gray-50 transition-all"
                >
                  <td className="p-4 font-medium text-gray-900">{event.title}</td>
                  <td className="p-4 text-gray-600">{event.date}</td>
                  <td className="p-4 text-gray-600">{event.location}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-gray-800 font-semibold">
                        {event.filled}/{event.maxParticipants}
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
                        />
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
          <div className="p-8 text-center text-gray-500">No events found matching your criteria</div>
        )}
      </div>
    </section>
  );
};

export default Ngoeventtable;
