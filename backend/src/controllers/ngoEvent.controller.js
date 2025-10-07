import { asyncHandler } from "../utils/asyncHandler.js";
import { ngoEventService } from "../services/ngoEvent.service.js";
import { Event } from "../models/Event.js";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const addEvent = asyncHandler(async (req, res) => {
  const organizationId = req.user._id;
  const organizationName = req.user.name;
  
  // Get default city from the user's profile based on their role
  let defaultCity;
  
  // Admin events use 'global' as location to be visible to everyone
  if (req.user.role === 'admin') {
    defaultCity = 'global';
  } else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    defaultCity = req.user.address?.city;
  } else {
    defaultCity = req.user.city;
  }

  // Use location from request body if provided, otherwise use default city
  const location = req.body.location || defaultCity;

  // Ensure location exists
  if (!location) {
    return res.status(400).json({
      success: false,
      message: "Location is required. Please update your profile with city information or provide a location.",
    });
  }

  const eventData = {
    ...req.body,
    organizationId,
    organization: organizationName,
    location, // Use provided location or default to organization's city
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

// Get all published events (filtered by city for non-admin users)
const getAllPublishedEvents = asyncHandler(async (req, res) => {
  // Check if user wants to see all events (showAll=true parameter)
  const shouldShowAll = req.query.showAll === 'true';
  
  // Build query filter based on user role
  let locationFilter = null;
  
  // Admins can see all events, others see events from their city + global events
  // Unless showAll is explicitly requested
  if (req.user && req.user.role !== 'admin' && !shouldShowAll) {
    // Get the user's city
    let userCity;
    if (req.user.role === 'user') {
      userCity = req.user.city;
    } else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
      userCity = req.user.address?.city;
    }

    if (userCity) {
      // Filter by user's city OR global events
      locationFilter = {
        $or: [
          { location: new RegExp(`^${userCity.trim()}$`, 'i') },
          { location: 'global' }
        ]
      };
      console.log('User city for events:', userCity);
      console.log('Filtered view - showing local + global events');
    }
  } else {
    console.log(shouldShowAll ? 'Show all requested - showing all events' : 'Admin user - showing all events');
  }
  
  const events = await ngoEventService.getAllPublishedEvents(locationFilter);
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
  const organizationId = req.user._id; // Use _id instead of id
  console.log(`[DEBUG] Fetching events for organization: ${organizationId}`);
  console.log(`[DEBUG] User object keys:`, Object.keys(req.user));
  console.log(`[DEBUG] User role:`, req.user.role);
  console.log(`[DEBUG] User name:`, req.user.name);
  console.log(`[DEBUG] Full user object:`, JSON.stringify(req.user, null, 2));
  
  const events = await ngoEventService.getEventsByOrganization(organizationId);
  console.log(`[DEBUG] Found ${events.length} events for organization ${organizationId}`);

  // Also check if there are any events with different organizationId formats
  const allEvents = await Event.find({});
  console.log(`[DEBUG] Total events in database: ${allEvents.length}`);
  const eventsWithOrgId = allEvents.filter(event => 
    event.organizationId && event.organizationId.toString() === organizationId.toString()
  );
  console.log(`[DEBUG] Events matching organizationId: ${eventsWithOrgId.length}`);

  // Set cache control headers to prevent caching issues
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  res.status(200).json({
    success: true,
    events,
    timestamp: new Date().toISOString(), // Add timestamp to ensure uniqueness
    count: events.length,
    debug: {
      organizationId: organizationId.toString(),
      totalEventsInDb: allEvents.length,
      eventsMatchingOrgId: eventsWithOrgId.length,
      userRole: req.user.role,
      userName: req.user.name
    }
  });
});


// Admin: approve or reject event
const updateEventStatus = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { status, rejectionReason } = req.body;

  const event = await ngoEventService.updateEventStatus(eventId, status, rejectionReason);

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

// Get user's default location (city) for event creation
const getDefaultLocation = asyncHandler(async (req, res) => {
  let defaultCity;
  if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    defaultCity = req.user.address?.city;
  } else {
    defaultCity = req.user.city;
  }

  if (!defaultCity) {
    return res.status(404).json({
      success: false,
      message: "No city information found in your profile. Please update your profile.",
    });
  }

  res.status(200).json({
    success: true,
    defaultLocation: defaultCity,
  });
});

// Upload event image to Cloudinary
const uploadEventImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'iVolunteer_events',
      transformation: [
        { width: 1200, height: 630, crop: "fill" }
      ],
      public_id: `event_${req.user._id}_${Date.now()}`
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { 
        url: result.secure_url, 
        publicId: result.public_id 
      }, "Event image uploaded successfully"));
  } catch (error) {
    console.error("Error uploading event image:", error);
    throw new ApiError(500, "Failed to upload event image");
  }
});

// Update event (for organization owners)
const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  // Find the event
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if the user is the owner of the event
  if (event.organizationId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this event");
  }

  // Update the event with new data
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    event: updatedEvent,
  });
});

// Delete event (for organization owners)
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  // Find the event
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if the user is the owner of the event
  if (event.organizationId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  // Delete the event
  await Event.findByIdAndDelete(eventId);

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
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
  getDefaultLocation,
  uploadEventImage,
  updateEvent,
  deleteEvent,
};
