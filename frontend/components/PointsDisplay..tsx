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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600" />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    );
  }

  const currentLevel = Math.floor(points / 500) + 1;
  const progressToNextLevel = (points % 500) / 5;
  const pointsToNextLevel = 500 - (points % 500);

  return (
    <div className="w-full flex md:flex-row flex-col justify-between mx-auto p-6">
      {/* Main Points Card */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl md:w-[73%] w-full overflow-hidden border border-slate-200  relative">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-slate-600 text-sm font-semibold uppercase tracking-wider">
                  Achievement Points
                </span>
              </div>
              
              <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-2">
                <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {points.toLocaleString()}
                </span>
                <span className="text-slate-500 text-lg font-medium">pts</span>
              </div>
              
              <p className="text-slate-500 text-sm">
                Level {currentLevel} • {pointsToNextLevel} points to next level
              </p>
            </div>

            {/* Right Content - Progress */}
            <div className="flex flex-col items-center lg:items-end space-y-5">
              <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-700 text-sm font-medium">Active Status</span>
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-slate-300"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressToNextLevel) / 100}
                    className="text-blue-600 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-slate-800 text-lg">{Math.round(progressToNextLevel)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex justify-between text-sm text-slate-600 mb-3">
              <span className="font-medium">Level {currentLevel} Progress</span>
              <span className="font-semibold">{points % 500}/500 points</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-rows-1 md:grid-rows-3 gap-6 md:w-[25%] w-full md:mt-0 mt-3">
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Current Level</p>
              <p className="text-2xl font-bold text-slate-800">{currentLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl  border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">To Next Level</p>
              <p className="text-2xl font-bold text-slate-800">{pointsToNextLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-lg border border-violet-100">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Next Milestone</p>
              <p className="text-2xl font-bold text-slate-800">{(currentLevel) * 500}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;