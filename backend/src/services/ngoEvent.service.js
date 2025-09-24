import { Event } from "../models/Event.js";
import { ApiError } from "../utils/ApiError.js";


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
  });

  try {
    return await event.save();
  } catch (error) {
    throw new ApiError(error.status || 500, error.message || "Failed to create event");
  }
};


// Get all approved events (status = approved)
const getAllPublishedEvents = async () => {
  return await Event.find({ status: "approved" }).sort({ date: 1 });
};

// Get approved events that require sponsorship (use a real field)
const getSponsorshipEvents = async () => {
  return await Event.find({
    // status: "approved",
    // sponsorshipRequired: true,
    sponsorshipAmount: { $gt: 0 }
  }).sort({ date: 1 });
};


const getEventsByOrganization = async (organizationId) => {
  return await Event.find({ organizationId }).sort({ date: -1 });
};

const getUpcomingEvents = async () => {
  return await Event.find({ status: "approved", date: { $gt: new Date() } }).sort({ date: 1 });
};

export const ngoEventService = {
  createEvent,
  getEventsByOrganization,
  getUpcomingEvents,
  getAllPublishedEvents,getSponsorshipEvents
};
