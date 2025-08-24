"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  applications: string[] // user IDs who applied
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
  createEvent: (event: Omit<Event, "id" | "createdAt" | "participants" | "applications" | "status">) => void
  applyToEvent: (eventId: string, userId: string, userName: string, userEmail: string) => void
  approveEvent: (eventId: string) => void
  rejectEvent: (eventId: string) => void
  getEventsByOrganization: (organizationId: string) => Event[]
  getApplicationsByEvent: (eventId: string) => EventApplication[]
  getApplicationsByUser: (userId: string) => EventApplication[]
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [applications, setApplications] = useState<EventApplication[]>([])

  useEffect(() => {
    // Load events and applications from localStorage
    const savedEvents = localStorage.getItem("events")
    const savedApplications = localStorage.getItem("applications")

    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      // Initialize with sample events
      const sampleEvents: Event[] = [
        {
          id: "food-bank",
          title: "Food Bank Volunteer",
          organization: "City Food Bank",
          organizationId: "org-1",
          location: "Downtown Community Center",
          date: "2024-01-20",
          time: "9:00 AM - 1:00 PM",
          participants: 0,
          maxParticipants: 20,
          coins: 75,
          description: "Help sort and distribute food to families in need",
          category: "Community Service",
          status: "approved",
          createdAt: new Date().toISOString(),
          applications: [],
        },
        {
          id: "beach-cleanup",
          title: "Beach Cleanup Drive",
          organization: "Ocean Conservation Society",
          organizationId: "org-2",
          location: "Sunset Beach",
          date: "2024-01-21",
          time: "7:00 AM - 11:00 AM",
          participants: 0,
          maxParticipants: 15,
          coins: 60,
          description: "Join us in cleaning up our beautiful coastline",
          category: "Environment",
          status: "approved",
          createdAt: new Date().toISOString(),
          applications: [],
        },
      ]
      setEvents(sampleEvents)
      localStorage.setItem("events", JSON.stringify(sampleEvents))
    }

    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  const createEvent = (eventData: Omit<Event, "id" | "createdAt" | "participants" | "applications" | "status">) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      participants: 0,
      applications: [],
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

  const applyToEvent = (eventId: string, userId: string, userName: string, userEmail: string) => {
    const newApplication: EventApplication = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      userId,
      userName,
      userEmail,
      appliedAt: new Date().toISOString(),
      status: "pending",
    }

    const updatedApplications = [...applications, newApplication]
    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    // Update event applications array
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? { ...event, applications: [...event.applications, userId], participants: event.participants + 1 }
        : event,
    )
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

  const approveEvent = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, status: "approved" as const } : event,
    )
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

  const rejectEvent = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, status: "rejected" as const } : event,
    )
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))
  }

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
