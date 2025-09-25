import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createEvent, getAllEvents } from "../controllers/donationEvent.controller.js";

const donationEventRouter = express.Router();

donationEventRouter.post("/create-event", authMiddleware, createEvent);
donationEventRouter.get("/getallevent", getAllEvents);

export default donationEventRouter;
