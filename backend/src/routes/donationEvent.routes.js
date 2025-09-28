import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createEvent, getAllEvents, getEventById } from "../controllers/donationEvent.controller.js";

const donationEventRouter = express.Router();

donationEventRouter.post("/create-event", authMiddleware, createEvent);
donationEventRouter.get("/getallevent", getAllEvents);
donationEventRouter.get("/:eventId", getEventById); // Get single donation event

export default donationEventRouter;
