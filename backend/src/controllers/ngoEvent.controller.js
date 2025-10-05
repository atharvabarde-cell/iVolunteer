import { asyncHandler } from "../utils/asyncHandler.js";
import { ngoEventService } from "../services/ngoEvent.service.js";
import { Event } from "../models/Event.js";


export const addEvent = asyncHandler(async (req, res) => {
  const organizationId = req.user._id;
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

// ngoEvent.controller.js
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

// Get single event by ID
const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const event = await ngoEventService.getEventById(eventId);
  
  res.status(200).json({
    success: true,
    event
  });
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
  const organizationId = req.user._id;

  const events = await ngoEventService.getEventsByOrganization(organizationId);

  console.log(`[DEBUG] Found ${events.length} approved upcoming/ongoing events for org ${organizationId}`);

  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });

  res.status(200).json({
    success: true,
    events,
    count: events.length,
    timestamp: new Date().toISOString(),
    debug: {
      organizationId: organizationId.toString(),
      userRole: req.user.role,
      userName: req.user.name,
    },
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

// NGO: Request to end event
// Request event completion (by NGO)
// NGO submits completion proof
const requestCompletion = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Proof image is required" });
  }

  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");
  if (event.organizationId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only event creator can request completion");
  }
  if (event.completionStatus === "pending") {
    throw new ApiError(400, "Completion request already submitted");
  }

  // Save proof
  event.completionProof = { url: req.file.path };
  event.completionStatus = "pending"; // mark request as pending
  await event.save();

  res.status(200).json({
    success: true,
    message: "Completion request submitted, pending admin approval",
    event,
  });
});


// Admin reviews completion
// ngoEvent.controller.js
// Admin reviews completion
export const reviewCompletion = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const { eventId } = req.params;
  const { decision } = req.body; // "accepted" | "rejected"

  const event = await ngoEventService.reviewEventCompletion(eventId, decision);

  res.status(200).json({
    success: true,
    message: `Completion request ${decision}`,
    event,
  });
});




// Admin fetches all pending requests
const getAllCompletionRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const requests = await ngoEventService.getAllCompletionRequests();

  res.status(200).json({
    success: true,
    requests,
    count: requests.length,
  });
});

// Admin: get all accepted/rejected completion request history (optional filter by NGO)
const getCompletionRequestHistory = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const ngoId = req.query.ngoId; // optional query param to filter by NGO

  const events = await ngoEventService.getCompletionRequestHistory(ngoId);

  res.status(200).json({
    success: true,
    count: events.length,
    events,
  });
});

// Admin: get completed events of a specific NGO
const getCompletedEventsByNgo = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const ngoId = req.params.ngoId;
  if (!ngoId) {
    return res.status(400).json({ success: false, message: "NGO ID is required" });
  }

  const events = await ngoEventService.getCompletedEventsByNgo(ngoId);

  res.status(200).json({
    success: true,
    count: events.length,
    events,
  });
});




export const ngoEventController = {
  addEvent,
  getAllPublishedEvents,
  getSponsorshipEvents,
  getEventById,
  participateInEvent,
  leaveEvent,
  getUserParticipatedEvents,
  migrateParticipantsData,
  getEventsByOrganization,
  updateEventStatus,
  getPendingEvents,
  requestCompletion,
  reviewCompletion,
  getAllCompletionRequests,
    getCompletionRequestHistory,
  getCompletedEventsByNgo,
};
