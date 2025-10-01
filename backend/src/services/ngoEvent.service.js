import { Event } from "../models/Event.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const createEvent = async (data, organizationId, organizationName) => {
  let {
    title,
    description,
    location,
    date,
    time,
    duration,
    category,
    maxParticipants,
    pointsOffered = 50,
    requirements = [],
    sponsorshipRequired,
    sponsorshipAmount,
    eventStatus,
    images = [],
  } = data;

  const event = new Event({
    title,
    description,
    organization: organizationName,
    organizationId,
    location,
    date,
    time,
    eventStatus,
    duration,
    category,
    maxParticipants,
    pointsOffered,
    requirements,
    sponsorshipRequired,
    sponsorshipAmount,
    images,
    status: "pending"
  });

  try {
    return await event.save();
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Failed to create event"
    );
  }
};

// Get all approved events (status = approved)
const getAllPublishedEvents = async () => {
  const events = await Event.find({ status: "approved" })
    .populate('participants', '_id name email')
    .sort({ date: 1 });
  
  // Auto-migrate events with number participants field
  const eventsToMigrate = events.filter(event => typeof event.participants === 'number');
  
  if (eventsToMigrate.length > 0) {
    console.log(`Auto-migrating ${eventsToMigrate.length} events with legacy participants field`);
    
    for (const event of eventsToMigrate) {
      try {
        await Event.updateOne(
          { _id: event._id },
          { $set: { participants: [] } }
        );
        console.log(`Migrated event: ${event.title} (${event._id})`);
      } catch (error) {
        console.error(`Failed to migrate event ${event._id}:`, error);
      }
    }
    
    // Return fresh data after migration with populated participants
    return await Event.find({ status: "approved" })
      .populate('participants', '_id name email')
      .sort({ date: 1 });
  }
  
  return events;
};

// Get approved events that require sponsorship (use a real field)
const getSponsorshipEvents = async () => {
  return await Event.find({
    sponsorshipAmount: { $gt: 0 },
  }).sort({ date: 1 });
};

const getEventsByOrganization = async (organizationId) => {
  return await Event.find({ organizationId }).sort({ date: -1 });
};

const getUpcomingEvents = async () => {
  return await Event.find({
    status: "approved",
    date: { $gt: new Date() },
  }).sort({ date: 1 });
};

// Update status (approve/reject)
const updateEventStatus = async (eventId, status) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    { status },
    { new: true }
  );

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

// Get all pending events (for admin)
const getPendingEvents = async () => {
  return await Event.find({ status: "pending" }).sort({ createdAt: -1 });
};

// Participate in an event
const participateInEvent = async (eventId, userId) => {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.status !== "approved") {
      throw new Error("Event is not available for participation");
    }

    if (event.date <= new Date()) {
      throw new Error("Event has already started or ended");
    }

    // Auto-migrate legacy data: convert participants from number to array if needed
    let needsRefresh = false;
    if (typeof event.participants === 'number') {
      console.log(`Auto-migrating event ${eventId}: converting participants from number to array`);
      await Event.updateOne(
        { _id: eventId },
        { $set: { participants: [] } }
      );
      needsRefresh = true;
    }

    // Initialize participants array if it doesn't exist or isn't an array
    if (!event.participants || !Array.isArray(event.participants)) {
      await Event.updateOne(
        { _id: eventId },
        { $set: { participants: [] } }
      );
      needsRefresh = true;
    }

    // Reload the event if we made changes
    const currentEvent = needsRefresh ? await Event.findById(eventId) : event;

    if (currentEvent.participants.includes(userId)) {
      throw new Error("You are already participating in this event");
    }

    if (currentEvent.participants.length >= currentEvent.maxParticipants) {
      throw new Error("Event is full");
    }

    // Add user to participants using $addToSet to avoid duplicates
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: userId } },
      { new: true }
    );

    // Award participation points to user
    const User = (await import("../models/User.js")).User;
    const { ParticipationReward } = await import("../controllers/rewards.controller.js");
    
    const user = await User.findById(userId);
    if (user) {
      // No coins awarded for participation - just return the updated event
      return {
        event: await Event.findById(eventId).populate('participants', 'name email'),
        pointsEarned: 0
      };
    }

    return {
      event: await Event.findById(eventId).populate('participants', 'name email'),
      pointsEarned: 0
    };
  } catch (error) {
    console.error('Error in participateInEvent:', error);
    throw error;
  }
};

// Leave an event
const leaveEvent = async (eventId, userId) => {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }

    // Auto-migrate legacy data: convert participants from number to array if needed
    let needsRefresh = false;
    if (typeof event.participants === 'number') {
      console.log(`Auto-migrating event ${eventId}: converting participants from number to array`);
      await Event.updateOne(
        { _id: eventId },
        { $set: { participants: [] } }
      );
      needsRefresh = true;
    }

    // Initialize participants array if it doesn't exist or isn't an array
    if (!event.participants || !Array.isArray(event.participants)) {
      await Event.updateOne(
        { _id: eventId },
        { $set: { participants: [] } }
      );
      needsRefresh = true;
    }

    // Reload the event if we made changes
    const currentEvent = needsRefresh ? await Event.findById(eventId) : event;

    if (!currentEvent.participants.includes(userId)) {
      throw new Error("You are not participating in this event");
    }

    if (currentEvent.date <= new Date()) {
      throw new Error("Cannot leave an event that has already started");
    }

    // Remove user from participants using $pull
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: userId } },
      { new: true }
    );

    return {
      event: await Event.findById(eventId).populate('participants', 'name email')
    };
  } catch (error) {
    console.error('Error in leaveEvent:', error);
    throw error;
  }
};

// Get user's participated events
const getUserParticipatedEvents = async (userId) => {
  return await Event.find({ 
    participants: userId 
  }).sort({ date: -1 });
};

export const ngoEventService = {
  createEvent,
  getEventsByOrganization,
  getUpcomingEvents,
  getAllPublishedEvents,
  
  getSponsorshipEvents,
  participateInEvent,
  leaveEvent,
  getUserParticipatedEvents,
  getPendingEvents,
  updateEventStatus,
};
