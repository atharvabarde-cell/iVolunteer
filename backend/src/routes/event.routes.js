import express from "express";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import { ngoEventController } from "../controllers/ngoEvent.controller.js";
import { Event } from "../models/Event.js";
import { upload } from "../config/cloudinary.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", authMiddleware, ngoEventController.addEvent);
eventRouter.get("/sponsorship", ngoEventController.getSponsorshipEvents);
// Events are now filtered by city - requires authentication
eventRouter.get("/all-event", authMiddleware, ngoEventController.getAllPublishedEvents);
// Upload event image
eventRouter.post(
  "/upload-event-image",
  authMiddleware,
  upload.single('eventImage'),
  ngoEventController.uploadEventImage
);
// Get user's default location for event creation
eventRouter.get(
  "/default-location",
  authMiddleware,
  ngoEventController.getDefaultLocation
);
// Admin: get all pending events
eventRouter.get(
  "/pending",
  authMiddleware,
  authorizeRole("admin"),
  ngoEventController.getPendingEvents
);

// Get events by organization (must come before /:eventId route)
eventRouter.get(
  "/organization",
  authMiddleware,
  ngoEventController.getEventsByOrganization
);

// Debug route to test event creation
eventRouter.post(
  "/test-create",
  authMiddleware,
  authorizeRole("ngo"),
  async (req, res) => {
    try {
      console.log('[DEBUG] Test event creation - User:', req.user._id, req.user.name);
      
      const testEvent = {
        title: "Test Event - " + new Date().toISOString(),
        description: "This is a test event created for debugging",
        organization: req.user.name,
        organizationId: req.user._id,
        location: "Test Location",
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: "10:00",
        duration: 2,
        category: "community",
        maxParticipants: 10,
        pointsOffered: 50,
        sponsorshipRequired: false
      };
      
      const event = await Event.create(testEvent);
      console.log('[DEBUG] Test event created:', event._id);
      
      res.json({
        success: true,
        message: "Test event created successfully",
        event: event,
        debug: {
          organizationId: req.user._id.toString(),
          eventId: event._id.toString()
        }
      });
    } catch (error) {
      console.error('[DEBUG] Test event creation failed:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create test event",
        error: error.message
      });
    }
  }
);

eventRouter.get("/:eventId", ngoEventController.getEventById); // Get single event

// Update event (for organization owners)
eventRouter.put("/:eventId", authMiddleware, ngoEventController.updateEvent);

// Delete event (for organization owners)
eventRouter.delete("/:eventId", authMiddleware, ngoEventController.deleteEvent);

// Participation routes
eventRouter.post("/participate/:eventId", authMiddleware, ngoEventController.participateInEvent);
eventRouter.delete("/leave/:eventId", authMiddleware, ngoEventController.leaveEvent);
eventRouter.get("/my-events", authMiddleware, ngoEventController.getUserParticipatedEvents);

// Migration route (for fixing legacy data)
eventRouter.post("/migrate-participants", authMiddleware, ngoEventController.migrateParticipantsData);
eventRouter.get("/all-event", ngoEventController.getAllPublishedEvents);

// Admin: approve/reject event
eventRouter.put(
  "/status/:eventId",
  authMiddleware,
  authorizeRole("admin"),
  ngoEventController.updateEventStatus
);

// Admin: get all pending events
eventRouter.get(
  "/pending",
  authMiddleware,
  authorizeRole("admin"),
  ngoEventController.getPendingEvents
);

export default eventRouter;
