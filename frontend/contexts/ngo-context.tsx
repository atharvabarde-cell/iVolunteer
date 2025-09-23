"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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
};

const NGOContext = createContext<NGOContextType | undefined>(undefined);

export const NGOProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("user-id") || "" : "";

  const createEvent = async (eventData: EventData) => {
    try {
      setLoading(true);
      setError(null);
      if (!token) throw new Error("No auth token found");

      const res = await api.post("/v1/event/add-event", eventData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setEvents((prev) => [...prev, res.data.event]);
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

      setEvents(res.data.events || []);
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

      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, participants: [...e.participants, currentUserId] }
            : e
        )
      );

      toast.success("Participation successful!");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Participation failed");
      return false;
    }
  };

  return (
    <NGOContext.Provider
      value={{ events, loading, error, createEvent, fetchAvailableEvents, participateInEvent }}
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
