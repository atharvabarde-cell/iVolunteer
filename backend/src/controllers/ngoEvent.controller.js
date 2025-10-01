import { asyncHandler } from "../utils/asyncHandler.js";
import { ngoEventService } from "../services/ngoEvent.service.js";
import { Event } from "../models/Event.js";


export const addEvent = asyncHandler(async (req, res) => {
  const organizationId = req.user.id;
  const organizationName = req.user.name;

  const eventData = {
    ...req.body,
    organizationId,
    organization: organizationName,
  };

  const event = await ngoEventService.createEvent(
    eventData,
    organizationId,
    organizationName
  );

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

// Get all published events
const getAllPublishedEvents = asyncHandler(async (req, res) => {
  const events = await ngoEventService.getAllPublishedEvents();
  res.status(200).json({
    success: true,
    events,
  });
});

// Get events for corporate sponsorship
const getSponsorshipEvents = asyncHandler(async (req, res) => {
  const events = await ngoEventService.getSponsorshipEvents();
  res.status(200).json({ success: true, availableSponsorEvent: events });
});

// Participate in an event
const participateInEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id;

  const result = await ngoEventService.participateInEvent(eventId, userId);
  
  res.status(200).json({
    success: true,
    message: "Successfully joined the event!",
    event: result.event,
    pointsEarned: result.pointsEarned
  });
});

// Leave an event
const leaveEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id;

  const result = await ngoEventService.leaveEvent(eventId, userId);
  
  res.status(200).json({
    success: true,
    message: "Successfully left the event!",
    event: result.event
  });
});

// Get user's participated events
const getUserParticipatedEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const events = await ngoEventService.getUserParticipatedEvents(userId);
  
  res.status(200).json({
    success: true,
    events
  });
});

// Migration endpoint (for admin use)
const migrateParticipantsData = asyncHandler(async (req, res) => {
  // Import the migration utility
  const { migrateParticipantsField } = await import("../utils/migrateParticipants.js");
  
  const result = await migrateParticipantsField();
  
  if (result.success) {
    res.status(200).json({
      success: true,
      message: `Successfully migrated ${result.migratedCount} events`,
      migratedCount: result.migratedCount
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Migration failed",
      error: result.error
    });
  }
});

const getEventsByOrganization = asyncHandler(async (req, res) => {
  const organizationId = req.user.id;
  const events = await ngoEventService.getEventsByOrganization(organizationId);

  res.status(200).json({
    success: true,
    events,
  });
});

// Admin: approve or reject event
const updateEventStatus = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  const event = await ngoEventService.updateEventStatus(eventId, status);

  res.status(200).json({
    success: true,
    message: `Event ${status} successfully`,
    event,
  });
});

// Admin: get all pending events
const getPendingEvents = asyncHandler(async (req, res) => {
  const events = await ngoEventService.getPendingEvents();
  res.status(200).json({ success: true, events });
});


export const ngoEventController = {
  addEvent,
  getAllPublishedEvents,
  getSponsorshipEvents,
  participateInEvent,
  leaveEvent,
  getUserParticipatedEvents,
  migrateParticipantsData,
  getEventsByOrganization,
  updateEventStatus,
  getPendingEvents,
};
