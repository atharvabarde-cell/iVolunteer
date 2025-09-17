import express, { Router } from "express";
import { eventApplicationController } from "../controllers/eventApplication.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { eventApplicationValidator } from "../validators/eventApplication.validators.js";

const router = Router();

// All routes require authentication
router.use(authentication);

// Apply for an event
router.post(
    "/apply/:id",
    validate(eventApplicationValidator.applicationSchema),
    eventApplicationController.applyForEvent
);

// Get user's applications
router.get(
    "/my-applications",
    eventApplicationController.getUserApplications
);

export default router;