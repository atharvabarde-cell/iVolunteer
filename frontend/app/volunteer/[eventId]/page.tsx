'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useNGO } from "@/contexts/ngo-context";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  UserPlus,
  ArrowLeft,
  Award,
  Target,
  Tag,
  Image as ImageIcon,
  Building,
  Globe,
  Phone,
  Mail,
  MapPinIcon,
} from "lucide-react";
import { Header } from "@/components/header";

const EventDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;
  
  const { events, fetchAvailableEvents, loading: contextLoading, error: contextError, participateInEvent, leaveEvent } = useNGO();
  const [event, setEvent] = useState<any>(null);
  const [participating, setParticipating] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  // Fetch single event with NGO details
  const fetchEventDetails = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching event details for:', eventId);
      
      // Try to fetch from the new single event endpoint first
      try {
        const response = await api.get(`/v1/event/${eventId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        const responseData = response.data as any;
        if (responseData.success && responseData.event) {
          console.log('Event fetched successfully:', responseData.event);
          console.log('NGO Details:', responseData.event.organizationId);
          setEvent(responseData.event);
          return;
        }
      } catch (singleEventError) {
        console.log('Single event endpoint failed, trying all events endpoint');
        
        // Fallback to fetching all events
        const allEventsResponse = await api.get("/v1/event/all-event", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        const allEventsData = allEventsResponse.data as any;
        const events = allEventsData.events || [];
        const foundEvent = events.find((e: any) => e._id === eventId);
        
        if (foundEvent) {
          console.log('Event found in all events:', foundEvent);
          setEvent(foundEvent);
        } else {
          throw new Error("Event not found");
        }
      }
    } catch (err: any) {
      console.error('Error fetching event:', err);
      const errorMessage = err.response?.data?.message || "Failed to fetch event details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event && user) {
      // Check if user is already participating
      const currentUserId = user._id || "";
      setParticipated(
        Array.isArray(event.participants) && 
        event.participants.some((participant: any) => 
          participant._id === currentUserId || participant === currentUserId
        )
      );
    }
  }, [event, user]);

  const handleParticipate = async () => {
    if (!event?._id) return;
    
    setParticipating(true);
    try {
      const success = await participateInEvent(event._id);
      if (success) {
        setParticipated(true);
        // Refresh event details to get updated data with NGO details
        setTimeout(() => fetchEventDetails(), 500);
      }
    } catch (err) {
      console.error("Participation failed:", err);
    } finally {
      setParticipating(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!event?._id) return;
    
    setLeaving(true);
    try {
      const success = await leaveEvent(event._id);
      if (success) {
        setParticipated(false);
        // Refresh event details to get updated data with NGO details
        setTimeout(() => fetchEventDetails(), 500);
      }
    } catch (err) {
      console.error("Leave event failed:", err);
    } finally {
      setLeaving(false);
    }
  };

  const getProgressPercentage = () => {
    if (!event) return 0;
    const currentParticipants = Array.isArray(event.participants) ? event.participants.length : 0;
    const maxParticipants = event.maxParticipants || Infinity;
    
    if (maxParticipants === Infinity) return 0;
    return Math.min(100, Math.round((currentParticipants / maxParticipants) * 100));
  };

  const isEventFull = () => {
    if (!event) return false;
    const currentParticipants = Array.isArray(event.participants) ? event.participants.length : 0;
    const maxParticipants = event.maxParticipants || Infinity;
    return currentParticipants >= maxParticipants;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="text-red-600 text-4xl mb-2">⚠️</div>
              <h2 className="text-red-800 text-xl font-semibold mb-2">
                {error ? "Error" : "Event Not Found"}
              </h2>
              <p className="text-red-600 mb-4">
                {error || "The event you're looking for could not be found."}
              </p>
              <button
                onClick={() => router.back()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const progress = getProgressPercentage();
  const eventFull = isEventFull();
  const currentParticipants = Array.isArray(event.participants) ? event.participants.length : 0;
  const maxParticipants = event.maxParticipants || Infinity;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>

          {/* Event Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Event Image */}
            {event.image?.url ? (
              <div className="h-64 md:h-80 relative">
                <img
                  src={event.image.url}
                  alt={event.image.caption || event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                  <p className="text-white/90">{event.organization || "Organization"}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-64 md:h-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                  <p className="text-white/90">{event.organization || "Organization"}</p>
                </div>
              </div>
            )}

            {/* Participation Status */}
            {participated && (
              <div className="bg-green-50 border-b border-green-200 px-6 py-3">
                <div className="flex items-center justify-center text-green-700 text-sm font-medium">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  You're participating in this event
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">
                  {event.description || "No description available for this event."}
                </p>
              </div>

              {/* NGO Information */}
              {event.organizationId && typeof event.organizationId === 'object' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">About the Organization</h2>
                  
                  {/* Debug info - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                      <strong>Debug:</strong> organizationId type: {typeof event.organizationId}, 
                      keys: {event.organizationId && typeof event.organizationId === 'object' ? Object.keys(event.organizationId).join(', ') : 'N/A'}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organization Basic Info */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Organization Name</p>
                          <p className="text-sm text-gray-600">
                            {event.organizationId.name || event.organization}
                          </p>
                        </div>
                      </div>

                      {event.organizationId.organizationType && (
                        <div className="flex items-start space-x-3">
                          <Tag className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Organization Type</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {event.organizationId.organizationType.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      )}

                      {event.organizationId.yearEstablished && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Established</p>
                            <p className="text-sm text-gray-600">
                              {event.organizationId.yearEstablished}
                            </p>
                          </div>
                        </div>
                      )}

                      {event.organizationId.organizationSize && (
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-orange-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Organization Size</p>
                            <p className="text-sm text-gray-600">
                              {event.organizationId.organizationSize} employees
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      {event.organizationId.email && (
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-red-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <a 
                              href={`mailto:${event.organizationId.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {event.organizationId.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {event.organizationId.contactNumber && (
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <a 
                              href={`tel:${event.organizationId.contactNumber}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {event.organizationId.contactNumber}
                            </a>
                          </div>
                        </div>
                      )}

                      {event.organizationId.websiteUrl && (
                        <div className="flex items-start space-x-3">
                          <Globe className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Website</p>
                            <a 
                              href={event.organizationId.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}

                      {event.organizationId.address && (
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Address</p>
                            <div className="text-sm text-gray-600">
                              {event.organizationId.address.street && (
                                <p>{event.organizationId.address.street}</p>
                              )}
                              <p>
                                {[
                                  event.organizationId.address.city,
                                  event.organizationId.address.state,
                                  event.organizationId.address.zip
                                ].filter(Boolean).join(', ')}
                              </p>
                              {event.organizationId.address.country && (
                                <p>{event.organizationId.address.country}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Organization Description */}
                  {event.organizationId.ngoDescription && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">About Us</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {event.organizationId.ngoDescription}
                      </p>
                    </div>
                  )}

                  {/* Focus Areas */}
                  {event.organizationId.focusAreas && event.organizationId.focusAreas.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.organizationId.focusAreas.map((area: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                          >
                            {area.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for basic organization info when NGO details are not populated */}
              {(!event.organizationId || typeof event.organizationId !== 'object') && event.organization && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">About the Organization</h2>
                  
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Organization Name</p>
                      <p className="text-sm text-gray-600">{event.organization}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Detailed organization information is not available for this event. Only the organization name is provided.
                    </p>
                  </div>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date & Time */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date</p>
                        <p className="text-sm text-gray-600">
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "Date not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Time</p>
                        <p className="text-sm text-gray-600">
                          {event.time || (event.date ? new Date(event.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : "Time not specified")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Category */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">
                          {event.location || "Location not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Tag className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Category</p>
                        <p className="text-sm text-gray-600">
                          {event.category || "General"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration & Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                  {event.duration && (
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{event.duration} hours</p>
                      </div>
                    </div>
                  )}

                  {event.pointsOffered && (
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-yellow-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Points Offered</p>
                        <p className="text-sm text-gray-600">{event.pointsOffered} points</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              {event.requirements && Array.isArray(event.requirements) && event.requirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {event.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participation Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Join This Event</h3>
                
                {/* Participants Progress */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">
                        {currentParticipants} / {maxParticipants === Infinity ? "∞" : maxParticipants} participants
                      </span>
                    </div>
                    {maxParticipants !== Infinity && (
                      <span className="text-xs font-medium text-gray-500">{progress}%</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {maxParticipants !== Infinity && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          eventFull ? "bg-red-500" : progress > 75 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {participated ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Already Participating
                    </button>
                    <button
                      onClick={handleLeaveEvent}
                      disabled={leaving}
                      className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium text-sm disabled:bg-red-200 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {leaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                          Leaving...
                        </>
                      ) : (
                        'Leave Event'
                      )}
                    </button>
                  </div>
                ) : eventFull ? (
                  <button
                    disabled
                    className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg font-medium text-sm cursor-not-allowed"
                  >
                    Event Full
                  </button>
                ) : (
                  <button
                    onClick={handleParticipate}
                    disabled={participating}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {participating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Event
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Event Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.eventStatus === 'active' ? 'bg-green-100 text-green-700' :
                      event.eventStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.eventStatus || 'Active'}
                    </span>
                  </div>
                  
                  {event.sponsorshipRequired && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sponsorship</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${event.sponsorshipAmount || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;