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

const getEventsByOrganization = asyncHandler(async (req, res) => {
  const organizationId = req.user.id;
  const events = await ngoEventService.getEventsByOrganization(organizationId);

  res.status(200).json({
    success: true,
    events,
  });
});

export const ngoEventController = {
  addEvent,
  getAllPublishedEvents,
  getSponsorshipEvents,
  getEventsByOrganization
};
