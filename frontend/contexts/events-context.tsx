"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface Event {
  id: string
  title: string
  organization: string
  organizationId: string
  location: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  coins: number
  description: string
  category: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  applications: string[] 
}

export interface EventApplication {
  id: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  appliedAt: string
  status: "pending" | "accepted" | "rejected"
}

interface EventsContextType {
  events: Event[]
  applications: EventApplication[]
  fetchEvents: () => void
  fetchApplications: (userId?: string, eventId?: string) => void
  createEvent: (eventData: Omit<Event, "id" | "createdAt" | "participants" | "status" | "applications">) => Promise<boolean>
  applyToEvent: (eventId: string, userId: string, userName: string, userEmail: string) => Promise<boolean>
  approveEvent: (eventId: string) => Promise<boolean>
  rejectEvent: (eventId: string) => Promise<boolean>
  getEventsByOrganization: (organizationId: string) => Event[]
  getApplicationsByEvent: (eventId: string) => EventApplication[]
  getApplicationsByUser: (userId: string) => EventApplication[]
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [applications, setApplications] = useState<EventApplication[]>([])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events from backend");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, []);
  
  const fetchApplications = useCallback(async (userId?: string, eventId?: string) => {
    try {
      let endpoint = '';
      if (userId) {
        endpoint = `http://localhost:5000/api/applications/user/${userId}`;
      } else if (eventId) {
        endpoint = `http://localhost:5000/api/applications/event/${eventId}`;
      }
      
      if (endpoint) {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error("Failed to fetch applications");
        }
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (eventData: Omit<Event, "id" | "createdAt" | "participants" | "status" | "applications">): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        fetchEvents();
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to create event:", error.message);
        return false;
      }
    } catch (err) {
      console.error("Error creating event:", err);
      return false;
    }
  };

  const applyToEvent = async (eventId: string, userId: string, userName: string, userEmail: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, userEmail }),
      });

      if (response.ok) {
        fetchEvents();
        fetchApplications(userId);
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to apply to event:", error.message);
        return false;
      }
    } catch (err) {
      console.error("Error applying to event:", err);
      return false;
    }
  };

  const approveEvent = async (eventId: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/approve`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchEvents();
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to approve event:", error.message);
        return false;
      }
    } catch (err) {
      console.error("Error approving event:", err);
      return false;
    }
  };

  const rejectEvent = async (eventId: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchEvents();
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to reject event:", error.message);
        return false;
      }
    } catch (err) {
      console.error("Error rejecting event:", err);
      return false;
    }
  };

  const getEventsByOrganization = (organizationId: string) => {
    return events.filter((event) => event.organizationId === organizationId)
  }

  const getApplicationsByEvent = (eventId: string) => {
    return applications.filter((app) => app.eventId === eventId)
  }

  const getApplicationsByUser = (userId: string) => {
    return applications.filter((app) => app.userId === userId)
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        applications,
        fetchEvents,
        fetchApplications,
        createEvent,
        applyToEvent,
        approveEvent,
        rejectEvent,
        getEventsByOrganization,
        getApplicationsByEvent,
        getApplicationsByUser,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider")
  }
  return context
}