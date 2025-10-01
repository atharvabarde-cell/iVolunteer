"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  CalendarCheck, 
  CalendarClock, 
  HeartHandshake, 
  PiggyBank, 
  TrendingUp,
  BarChart3,
  Target
} from "lucide-react";
import { useNGO } from "@/contexts/ngo-context"; // import your context

const Ngoanalytics = () => {
  const { events, fetchAvailableEvents, loading } = useNGO();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetchAvailableEvents(); // fetch events on mount
  }, []);

  useEffect(() => {
    // Compute stats dynamically from events
    const activeEvents = events.filter(e => new Date(e.date) > new Date()).length;
    const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length; // same as active for demo
    const totalVolunteers = events.reduce((acc, e) => acc + (e.participants?.length || 0), 0);
    const fundsRaised = events.reduce((acc, e) => acc + (e.sponsorshipAmount || 0), 0);
    const communitiesImpacted = new Set(events.map(e => e.location)).size;

    setStats([
      {
        title: "Active Events",
        value: activeEvents,
        icon: <CalendarCheck className="w-6 h-6" />,
        color: "text-blue-600",
        bg: "bg-blue-500/10",
        border: "border-blue-200",
        trend: { value: 12, isPositive: true }
      },
      {
        title: "Upcoming Events",
        value: upcomingEvents,
        icon: <CalendarClock className="w-6 h-6" />,
        color: "text-indigo-600",
        bg: "bg-indigo-500/10",
        border: "border-indigo-200",
        trend: { value: 5, isPositive: false }
      },
      {
        title: "Total Volunteers",
        value: totalVolunteers,
        icon: <Users className="w-6 h-6" />,
        color: "text-green-600",
        bg: "bg-green-500/10",
        border: "border-green-200",
        trend: { value: 24, isPositive: true }
      },
      {
        title: "Funds Raised",
        value: `$${fundsRaised.toLocaleString()}`,
        icon: <PiggyBank className="w-6 h-6" />,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-200",
        trend: { value: 18, isPositive: true }
      },
      {
        title: "Communities Impacted",
        value: communitiesImpacted,
        icon: <HeartHandshake className="w-6 h-6" />,
        color: "text-rose-600",
        bg: "bg-rose-500/10",
        border: "border-rose-200",
        trend: { value: 8, isPositive: true }
      },
    ]);
  }, [events]);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <section className="px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className="max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">NGO Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">Track your organization's impact and performance metrics</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`${stat.bg} ${stat.border} rounded-2xl p-5 border flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 rounded-full opacity-10" style={{ backgroundColor: stat.color.replace('text-', '') }}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl md:text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              </div>
              
              <div className="flex items-center mt-2">
                <div className={`flex items-center text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${!stat.trend.isPositive && 'rotate-180'}`} />
                  <span>{stat.trend.value}%</span>
                </div>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ngoanalytics;
