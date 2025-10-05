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
    status: "pending",
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

// Get all published events with participants populated and NGO details
const getAllPublishedEvents = async () => {
  // Auto-migrate legacy participants if needed
  const eventsToMigrate = await Event.find({
    status: "approved",
    participants: { $type: "number" },
  });

  if (eventsToMigrate.length > 0) {
    console.log(
      `Auto-migrating ${eventsToMigrate.length} events with legacy participants`
    );
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
  }

  // Fetch only approved events that are upcoming or ongoing
  const events = await Event.find({
    status: "approved",
    eventStatus: { $in: ["upcoming", "ongoing"] },
  })
    .populate("participants", "_id name email")
    .populate(
      "organizationId",
      "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
    )
    .sort({ date: 1 });

  return events;
};

// Get approved events that require sponsorship (use a real field)
const getSponsorshipEvents = async () => {
  return await Event.find({
    // status: "approved",
    // sponsorshipRequired: true,
    sponsorshipAmount: { $gt: 0 },
  })
    .populate(
      "organizationId",
      "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
    )
    .sort({ date: 1 });
};

const getEventsByOrganization = async (organizationId) => {
  console.log(
    `[SERVICE] Searching approved events for organizationId: ${organizationId}`
  );

  const events = await Event.find({
    organizationId,
    status: "approved",
    eventStatus: { $in: ["upcoming", "ongoing"] },
  })
    .populate("organizationId", "name email organizationType")
    .populate("participants", "_id name email")
    .sort({ date: 1 }); // soonest first

  console.log(`[SERVICE] Query result: ${events.length} events found`);
  return events;
};

export default {
  getEventsByOrganization,
};

const getUpcomingEvents = async () => {
  return await Event.find({
    status: "approved",
    date: { $gt: new Date() },
  })
    .populate(
      "organizationId",
      "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
    )
    .sort({ date: 1 });
};

// Get single event by ID
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate("participants", "_id name email")
    .populate(
      "organizationId",
      "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
    );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
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
    if (typeof event.participants === "number") {
      console.log(
        `Auto-migrating event ${eventId}: converting participants from number to array`
      );
      await Event.updateOne({ _id: eventId }, { $set: { participants: [] } });
      needsRefresh = true;
    }

    // Initialize participants array if it doesn't exist or isn't an array
    if (!event.participants || !Array.isArray(event.participants)) {
      await Event.updateOne({ _id: eventId }, { $set: { participants: [] } });
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
    const { ParticipationReward } = await import(
      "../controllers/rewards.controller.js"
    );

    const user = await User.findById(userId);
    if (user) {
      // No coins awarded for participation - just return the updated event with NGO details
      return {
        event: await Event.findById(eventId)
          .populate("participants", "name email")
          .populate(
            "organizationId",
            "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
          ),
        pointsEarned: 0,
      };
    }

    return {
      event: await Event.findById(eventId)
        .populate("participants", "name email")
        .populate(
          "organizationId",
          "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
        ),
      pointsEarned: 0,
    };
  } catch (error) {
    console.error("Error in participateInEvent:", error);
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
    if (typeof event.participants === "number") {
      console.log(
        `Auto-migrating event ${eventId}: converting participants from number to array`
      );
      await Event.updateOne({ _id: eventId }, { $set: { participants: [] } });
      needsRefresh = true;
    }

    // Initialize participants array if it doesn't exist or isn't an array
    if (!event.participants || !Array.isArray(event.participants)) {
      await Event.updateOne({ _id: eventId }, { $set: { participants: [] } });
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
      event: await Event.findById(eventId)
        .populate("participants", "name email")
        .populate(
          "organizationId",
          "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
        ),
    };
  } catch (error) {
    console.error("Error in leaveEvent:", error);
    throw error;
  }
};

// Get user's participated events
const getUserParticipatedEvents = async (userId) => {
  return await Event.find({
    participants: userId,
  })
    .populate(
      "organizationId",
      "name email organizationType websiteUrl yearEstablished contactNumber address ngoDescription focusAreas organizationSize"
    )
    .sort({ date: -1 });
};

const requestEventCompletion = async (eventId, organizationId, proofImage) => {
  const event = await Event.findById(eventId);

  if (!event) throw new ApiError(404, "Event not found");
  if (event.organizationId.toString() !== organizationId.toString()) {
    throw new ApiError(403, "Only event creator can request completion");
  }
  if (event.completionStatus === "pending") {
    throw new ApiError(400, "Completion request already submitted");
  }

  // Only save proof and mark as pending
  event.completionProof = proofImage; // { url, caption }
  event.completionStatus = "pending"; // pending admin approval

  await event.save();
  return event;
};

// ngoEvent.service.js
const getAllCompletionRequests = async () => {
  return await Event.find({
    completionStatus: "pending", // ✅ correct condition
  })
    .populate("organizationId", "name email")
    .populate("participants", "_id name email")
    .sort({ updatedAt: -1 });
};

const reviewEventCompletion = async (eventId, decision) => {
  const event = await Event.findById(eventId).populate("participants");
  if (!event) throw new ApiError(404, "Event not found");

  if (event.completionStatus !== "pending") {
    throw new ApiError(400, "No pending completion request for this event");
  }

  if (decision === "accepted") {
    event.completionStatus = "accepted"; // admin approved
    event.eventStatus = "completed"; // lifecycle field

    // Award points to participants
    for (const userId of event.participants) {
      const user = await mongoose.model("User").findById(userId);
      if (user) {
        user.points += event.pointsOffered;
        await user.save();
      }
    }
  } else if (decision === "rejected") {
    event.completionStatus = "rejected"; // admin rejected
    event.eventStatus = "ongoing"; // back to ongoing
  } else {
    throw new ApiError(400, "Invalid decision value");
  }

  await event.save();
  return event;
};

// Get all completion requests (approved/rejected) history (admin)
const getCompletionRequestHistory = async (ngoId) => {
  const filter = {
    completionStatus: { $in: ["accepted", "rejected"] }, // admin decisions
  };

  if (ngoId) {
    filter.organizationId = ngoId; // filter by NGO if provided
  }

  const events = await Event.find(filter)
    .populate("participants", "_id name email")
    .populate("organizationId", "name email organizationType")
    .sort({ updatedAt: -1 }); // latest decisions first

  return events;
};

// Get completed events of a specific NGO
const getCompletedEventsByNgo = async (ngoId) => {
  const events = await Event.find({
    organizationId: ngoId,
    eventStatus: "completed", // completed lifecycle
  })
    .populate("participants", "_id name email")
    .populate("organizationId", "name email organizationType")
    .sort({ date: -1 }); // latest completed first

  return events;
};

export const ngoEventService = {
  createEvent,
  getEventsByOrganization,
  getUpcomingEvents,
  getAllPublishedEvents,

  getSponsorshipEvents,
  getEventById,
  participateInEvent,
  leaveEvent,
  getUserParticipatedEvents,
  getPendingEvents,
  updateEventStatus,

  requestEventCompletion,
  reviewEventCompletion,
  getAllCompletionRequests,

  getCompletionRequestHistory,
  getCompletedEventsByNgo,
};
