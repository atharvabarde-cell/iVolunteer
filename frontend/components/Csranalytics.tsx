"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  Eye, 
  TrendingUp, 
  BarChart3,
  Target,
  Calendar
} from "lucide-react";

const stats = [
  { 
    title: "Total Volunteer Hours", 
    value: "1,250", 
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    change: "+15%",
    trend: "up",
    description: "Hours contributed this quarter",
    color: "bg-blue-500"
  },
  { 
    title: "Volunteers Reached", 
    value: "500+", 
    icon: <Users className="w-6 h-6 text-green-600" />,
    change: "+22%",
    trend: "up",
    description: "Active volunteers engaged",
    color: "bg-green-500"
  },
  { 
    title: "Media Impressions", 
    value: "10,000+", 
    icon: <Eye className="w-6 h-6 text-purple-600" />,
    change: "+8%",
    trend: "up",
    description: "Total reach across platforms",
    color: "bg-purple-500"
  },
];

// Additional metrics for enhanced dashboard
const additionalStats = [
  { 
    title: "Community Projects", 
    value: "24", 
    icon: <Target className="w-5 h-5 text-amber-600" />,
    description: "Ongoing initiatives"
  },
  { 
    title: "Completion Rate", 
    value: "92%", 
    icon: <BarChart3 className="w-5 h-5 text-teal-600" />,
    description: "Project success rate"
  },
  { 
    title: "Upcoming Events", 
    value: "6", 
    icon: <Calendar className="w-5 h-5 text-rose-600" />,
    description: "Scheduled activities"
  },
];

export default function CSRAnalytics() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Corporate Social Responsibility Analytics
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your organization's social impact and community engagement performance
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${item.color.replace('500', '100')}`}>
                  {item.icon}
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {item.change}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.value}</h3>
              <p className="text-gray-600 font-medium mb-2">{item.title}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${Math.min(100, 70 + index * 10)}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Metrics */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Additional Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {additionalStats.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="mr-4 p-2 bg-white rounded-lg shadow-xs">
                  {item.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-end mt-6"
        >
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
              Weekly
            </button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-blue-100 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
              Monthly
            </button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
              Quarterly
            </button>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
            Download Full Report
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}