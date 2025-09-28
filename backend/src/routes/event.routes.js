import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoEventController } from "../controllers/ngoEvent.controller.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", authMiddleware, ngoEventController.addEvent);
eventRouter.get("/sponsorship", ngoEventController.getSponsorshipEvents);
eventRouter.get("/all-event", ngoEventController.getAllPublishedEvents);
eventRouter.get("/:eventId", ngoEventController.getEventById); // Get single event

// Participation routes
eventRouter.post("/participate/:eventId", authMiddleware, ngoEventController.participateInEvent);
eventRouter.delete("/leave/:eventId", authMiddleware, ngoEventController.leaveEvent);
eventRouter.get("/my-events", authMiddleware, ngoEventController.getUserParticipatedEvents);

// Migration route (for fixing legacy data)
eventRouter.post("/migrate-participants", authMiddleware, ngoEventController.migrateParticipantsData);

export default eventRouter;
