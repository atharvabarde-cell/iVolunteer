"use client";

import React, { useState } from "react";
import {
  useAdmin,
  EventItem,
  basePointsMap,
  difficultyMap,
} from "@/contexts/admin-context";

const PendingEventsPage = () => {
  const { pendingEvents, handleApprove, handleDeny } = useAdmin();
  const [denialReasons, setDenialReasons] = useState<{ [key: string]: string }>(
    {}
  );
  const [showApproveOptions, setShowApproveOptions] = useState<string | null>(
    null
  );
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [selectedBase, setSelectedBase] = useState<{
    [id: string]: keyof typeof basePointsMap;
  }>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<{
    [id: string]: keyof typeof difficultyMap;
  }>({});
  const [hoursWorked, setHoursWorked] = useState<{ [id: string]: number }>({});

  const calculatePoints = (eventId: string) => {
    const base = selectedBase[eventId] || "small";
    const diff = selectedDifficulty[eventId] || "easy";
    const hours = hoursWorked[eventId] || 0;

    const basePoints = basePointsMap[base];
    const difficultyMultiplier = difficultyMap[diff];
    const durationFactor = 1 + hours / 10;
    const totalPoints = Math.round(
      basePoints * difficultyMultiplier * durationFactor
    );
    return { totalPoints, basePoints, difficultyMultiplier, durationFactor };
  };

  const onApprove = async (eventId: string) => {
    if (!selectedBase[eventId] || !selectedDifficulty[eventId]) {
      alert("Please select category and difficulty");
      return;
    }

    setLoadingAction(eventId);

    try {
      await handleApprove(eventId, {
        baseCategoryOrPoints: selectedBase[eventId],
        difficultyKeyOrMultiplier: selectedDifficulty[eventId],
        hoursWorked: hoursWorked[eventId] || 0,
      });

      setShowApproveOptions(null);
    } finally {
      setLoadingAction(null);
    }
  };

  const onDeny = async (id: string) => {
    const reason = denialReasons[id];
    if (!reason?.trim()) return alert("Please enter a denial reason");
    setLoadingAction(id);
    try {
      await handleDeny(id, reason);
      setDenialReasons((prev) => ({ ...prev, [id]: "" }));
      setShowRejectInput(null);
    } finally {
      setLoadingAction(null);
    }
  };

  const startRejectProcess = (id: string) => {
    setShowRejectInput(id);
    setDenialReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const cancelRejectProcess = (id: string) => {
    setShowRejectInput(null);
    setDenialReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const formatDuration = (duration: string) => {
    // Assuming duration is stored as a string like "2 hours", "30 minutes", etc.
    return duration || "Not specified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Pending Events
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Review and manage event submissions awaiting approval. Ensure all events meet community guidelines.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-base font-semibold text-slate-700">
              {pendingEvents.length} event{pendingEvents.length !== 1 ? "s" : ""} pending review
            </span>
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center backdrop-blur-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">All caught up!</h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              No pending events to review. New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {pendingEvents.map((event: EventItem) => {
              const { totalPoints } = calculatePoints(event._id);
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Event Header */}
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-2 pr-4">
                        {event.title}
                      </h3>
                      <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 mb-4">
                      {event.description || "No description provided"}
                    </p>
                    {event.location && (
                      <div className="flex items-center text-slate-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Organization</span>
                        <p className="text-slate-800 font-semibold">{event.organization}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Date</span>
                        <p className="text-slate-800 font-semibold">{event.date}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Time</span>
                        <p className="text-slate-800 font-semibold">{event.time}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Duration</span>
                        <p className="text-slate-800 font-semibold">{formatDuration(event.duration)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      {showApproveOptions === event._id ? (
                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Event Category
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.keys(basePointsMap).map((key) => (
                                  <button
                                    key={key}
                                    onClick={() => setSelectedBase((prev) => ({
                                      ...prev,
                                      [event._id]: key as keyof typeof basePointsMap,
                                    }))}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                      selectedBase[event._id] === key
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                  >
                                    {key}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Difficulty Level
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.keys(difficultyMap).map((key) => (
                                  <button
                                    key={key}
                                    onClick={() => setSelectedDifficulty((prev) => ({
                                      ...prev,
                                      [event._id]: key as keyof typeof difficultyMap,
                                    }))}
                                    className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                                      selectedDifficulty[event._id] === key
                                        ? "bg-purple-500 text-white border-purple-500"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Hours Worked
                              </label>
                              <input
                                type="number"
                                min={0}
                                step={0.5}
                                value={hoursWorked[event._id] || 0}
                                onChange={(e) =>
                                  setHoursWorked((prev) => ({
                                    ...prev,
                                    [event._id]: Number(e.target.value),
                                  }))
                                }
                                placeholder="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-slate-700">Final Points:</span>
                              <span className="text-lg font-bold text-green-600">{totalPoints}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowApproveOptions(null)}
                              className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => onApprove(event._id)}
                              disabled={loadingAction === event._id}
                              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {loadingAction === event._id ? "Approving..." : "Confirm Approve"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowApproveOptions(event._id)}
                          className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          Approve Event
                        </button>
                      )}

                      {showRejectInput === event._id ? (
                        <div className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-200">
                          <textarea
                            placeholder="Please provide a reason for rejection..."
                            rows={3}
                            value={denialReasons[event._id] || ""}
                            onChange={(e) =>
                              setDenialReasons((prev) => ({
                                ...prev,
                                [event._id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => cancelRejectProcess(event._id)}
                              className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => onDeny(event._id)}
                              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startRejectProcess(event._id)}
                          className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          Reject Event
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingEventsPage;