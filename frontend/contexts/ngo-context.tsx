import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "react-toastify";

export type EventData = {
  _id?: string; 
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  category: string;
  participants: string[]; // Array of user IDs
  maxParticipants: number;
  pointsOffered: number;
  requirements: string[];
  sponsorshipRequired: boolean;
  sponsorshipAmount: number;
  image?: { url: string; caption: string };
  eventStatus: string;
};

type NGOContextType = {
  events: EventData[];
  loading: boolean;
  error: string | null;
  createEvent: (data: EventData) => Promise<void>;
  fetchAvailableEvents: () => Promise<void>;
  participateInEvent: (eventId: string) => Promise<boolean>;
  leaveEvent: (eventId: string) => Promise<boolean>;
  getUserParticipatedEvents: () => Promise<EventData[]>;
};

const NGOContext = createContext<NGOContextType | undefined>(undefined);

export const NGOProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
  const currentUserId = user?._id || "";

  const createEvent = async (eventData: EventData) => {
    try {
      setLoading(true);
      setError(null);
      if (!token) throw new Error("No auth token found");

      const res = await api.post("/v1/event/add-event", eventData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEvents((prev) => [...prev, (res.data as any).event]);
      toast.success("Event created successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create event";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/v1/event/all-event", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEvents((res.data as any).events || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const participateInEvent = async (eventId: string) => {
    try {
      if (!token) throw new Error("No auth token found");

      const res = await api.post(
        `/v1/event/participate/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      // Update local state - add current user to participants
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { 
                ...e, 
                participants: [...(e.participants || []), currentUserId] 
              }
            : e
        )
      );

      const responseData = res.data as any;
      toast.success(`Participation successful! ${responseData.pointsEarned ? `You earned ${responseData.pointsEarned} coins!` : ''}`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Participation failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Add leave event functionality
  const leaveEvent = async (eventId: string) => {
    try {
      if (!token) throw new Error("No auth token found");

      await api.delete(
        `/v1/event/leave/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      // Update local state - remove current user from participants
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { 
                ...e, 
                participants: (e.participants || []).filter(id => id !== currentUserId)
              }
            : e
        )
      );

      toast.success("Successfully left the event!");
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to leave event";
      toast.error(errorMessage);
      return false;
    }
  };

  // Get user's participated events
  const getUserParticipatedEvents = async () => {
    try {
      if (!token) throw new Error("No auth token found");

      const res = await api.get("/v1/event/my-events", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return (res.data as any).events || [];
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch participated events");
      return [];
    }
  };

  return (
    <NGOContext.Provider
      value={{ 
        events, 
        loading, 
        error, 
        createEvent, 
        fetchAvailableEvents, 
        participateInEvent,
        leaveEvent,
        getUserParticipatedEvents
      }}
    >
      {children}
    </NGOContext.Provider>
  );
};

export const useNGO = () => {
  const context = useContext(NGOContext);
  if (!context) throw new Error("useNGO must be used within NGOProvider");
  return context;
};
