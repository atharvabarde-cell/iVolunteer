"use client";
import React, { useEffect, useState } from "react";
import { useNGO } from "@/contexts/ngo-context";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { Header } from "@/components/header";

const AvailableEventsPage: React.FC = () => {
  const { events, fetchAvailableEvents, loading, error, participateInEvent } =
    useNGO();
  const [participating, setParticipating] = useState<{
    [key: string]: boolean;
  }>({});
  const [participated, setParticipated] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchAvailableEvents();
  }, []);

  const handleParticipate = async (eventId: string) => {
    setParticipating((prev) => ({ ...prev, [eventId]: true }));

    try {
      const success = await participateInEvent(eventId);
      if (success) {
        setParticipated((prev) => ({ ...prev, [eventId]: true }));
        // Refresh events to get updated participant counts
        setTimeout(() => fetchAvailableEvents(), 500);
      }
    } catch (err) {
      console.error("Participation failed:", err);
    } finally {
      setParticipating((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const getProgressPercentage = (event: any) => {
    const currentParticipants = Array.isArray(event.participants)
      ? event.participants.length
      : 0;
    const maxParticipants = event.maxParticipants || Infinity;

    if (maxParticipants === Infinity) return 0;
    return Math.min(
      100,
      Math.round((currentParticipants / maxParticipants) * 100)
    );
  };

  const isEventFull = (event: any) => {
    const currentParticipants = Array.isArray(event.participants)
      ? event.participants.length
      : 0;
    const maxParticipants = event.maxParticipants || Infinity;
    return currentParticipants >= maxParticipants;
  };

  const isUserParticipating = (event: any) => {
    // This would typically check against current user ID from context
    // For now, using the local state
    return (
      participated[event._id] ||
      (Array.isArray(event.participants) && event.participants.length > 0)
    ); // Simplified check
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-4xl mb-2">⚠️</div>
            <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAvailableEvents}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md">
            <div className="text-gray-400 text-5xl mb-4">📅</div>
            <h2 className="text-gray-600 text-xl font-semibold mb-2">
              No Events Available
            </h2>
            <p className="text-gray-500">
              There are currently no events available. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover meaningful opportunities to support our community through
              various events and activities.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const progress = getProgressPercentage(event);
              const eventFull = isEventFull(event);
              const userParticipating = isUserParticipating(event);
              const currentParticipants = Array.isArray(event.participants)
                ? event.participants.length
                : 0;
              const maxParticipants = event.maxParticipants || Infinity;

              return (
                <div
                  key={event._id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border overflow-hidden ${
                    eventFull ? "border-red-200" : "border-gray-100"
                  } ${userParticipating ? "ring-2 ring-green-200" : ""}`}
                >
                  {/* Participation Badge */}
                  {userParticipating && (
                    <div className="bg-green-50 border-b border-green-200 px-4 py-2">
                      <div className="flex items-center justify-center text-green-700 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        You're participating in this event
                      </div>
                    </div>
                  )}

                  {/* Event Header */}
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                      <span className="text-sm">
                        {event.date ? (
                          <>
                            {new Date(event.date).toLocaleDateString()}
                            <span className="mx-1">•</span>
                            {new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        ) : (
                          "Date not specified"
                        )}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-red-600" />
                      <span className="text-sm">
                        {event.location || "Location not specified"}
                      </span>
                    </div>

                    {/* Participants Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-3 text-green-600" />
                          <span className="text-sm">
                            {currentParticipants} /{" "}
                            {maxParticipants === Infinity
                              ? "∞"
                              : maxParticipants}{" "}
                            participants
                          </span>
                        </div>
                        {maxParticipants !== Infinity && (
                          <span className="text-xs font-medium text-gray-500">
                            {progress}%
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {maxParticipants !== Infinity && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              eventFull
                                ? "bg-red-500"
                                : progress > 75
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Sponsorship */}
                    {/* {event.sponsorshipRequired && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-3 text-yellow-600" />
                        <span className="text-sm">
                          Sponsorship: ${event.sponsorshipAmount}
                        </span>
                      </div>
                    )} */}
                  </div>

                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    {userParticipating ? (
                      <button
                        disabled
                        className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Participating
                      </button>
                    ) : eventFull ? (
                      <button
                        disabled
                        className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium text-sm cursor-not-allowed"
                      >
                        Event Full
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          event._id && handleParticipate(event._id)
                        }
                        disabled={!event._id || participating[event._id]}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {event._id && participating[event._id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Joining...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Participate
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Stats */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-sm p-6 inline-block">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>
                    Available: {events.filter((e) => !isEventFull(e)).length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>
                    Full: {events.filter((e) => isEventFull(e)).length}
                  </span>
                </div>
                <div>
                  <span>Total: {events.length} events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableEventsPage;
