import express from "express";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getAllEvents, getEventById,
  getPendingEvents,
  updateEventApproval,
} from "../controllers/donationEvent.controller.js";

const donationEventRouter = express.Router();

donationEventRouter.post("/create-event", authMiddleware, createEvent);
donationEventRouter.get("/getallevent", getAllEvents);

// 👇 Admin routes
donationEventRouter.get(
  "/pending",
  authMiddleware,
  
  getPendingEvents
);
donationEventRouter.patch(
  "/status/:eventId",
  authMiddleware,
  authorizeRole("admin"),
  updateEventApproval
);
donationEventRouter.get("/:eventId", getEventById); // Get single donation event

export default donationEventRouter;
