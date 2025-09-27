import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoEventController } from "../controllers/ngoEvent.controller.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", authMiddleware, ngoEventController.addEvent);
eventRouter.get("/sponsorship", ngoEventController.getSponsorshipEvents);
eventRouter.get("/all-event",ngoEventController.getAllPublishedEvents)
eventRouter.get("/organization", authMiddleware,ngoEventController.getEventsByOrganization)

export default eventRouter;
