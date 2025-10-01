import express from "express";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import { ngoEventController } from "../controllers/ngoEvent.controller.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", authMiddleware, ngoEventController.addEvent);
eventRouter.get("/sponsorship", ngoEventController.getSponsorshipEvents);
eventRouter.get("/all-event", ngoEventController.getAllPublishedEvents);
// Admin: get all pending events
eventRouter.get(
  "/pending",
  authMiddleware,
  authorizeRole("admin"),
  ngoEventController.getPendingEvents
);

eventRouter.get("/:eventId", ngoEventController.getEventById); // Get single event

// Participation routes
eventRouter.post("/participate/:eventId", authMiddleware, ngoEventController.participateInEvent);
eventRouter.delete("/leave/:eventId", authMiddleware, ngoEventController.leaveEvent);
eventRouter.get("/my-events", authMiddleware, ngoEventController.getUserParticipatedEvents);

// Migration route (for fixing legacy data)
eventRouter.post("/migrate-participants", authMiddleware, ngoEventController.migrateParticipantsData);
eventRouter.get("/all-event", ngoEventController.getAllPublishedEvents);
eventRouter.get(
  "/organization",
  authMiddleware,
  ngoEventController.getEventsByOrganization
);

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
