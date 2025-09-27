"use client";

import React from "react";
import { usePoints } from "@/contexts/points-context";
import { Award, TrendingUp, Sparkles, Target } from "lucide-react";

const PointsDisplay: React.FC = () => {
  const { points, loading } = usePoints();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    );
  }

  const currentLevel = Math.floor(points / 1000) + 1;
  const progressToNextLevel = (points % 1000) / 10;
  const pointsToNextLevel = 1000 - (points % 1000);

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      {/* Main Points Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-2xl">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium uppercase tracking-wider">
                  Total Achievement Points
                </span>
              </div>
              
              <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-2">
                <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {points.toLocaleString()}
                </span>
                <span className="text-slate-400 text-lg font-semibold">pts</span>
              </div>
              
              <p className="text-slate-400 text-sm">
                Level {currentLevel} • {pointsToNextLevel} points to next level
              </p>
            </div>

            {/* Right Content - Progress */}
            <div className="flex flex-col items-center lg:items-end space-y-4">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-2xl px-4 py-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * progressToNextLevel) / 100}
                    className="text-blue-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{Math.round(progressToNextLevel)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-slate-400 mb-3">
              <span>Level {currentLevel} Progress</span>
              <span>{points % 500}/500</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/25"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Current Level</p>
              <p className="text-2xl font-bold text-slate-900">{currentLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">To Next Level</p>
              <p className="text-2xl font-bold text-slate-900">{pointsToNextLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Milestone</p>
              <p className="text-2xl font-bold text-slate-900">{currentLevel * 500}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;