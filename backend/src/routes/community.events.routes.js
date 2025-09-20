import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    createEvent,
    getCommunityEvents,
    getEvent,
    updateEvent,
    deleteEvent
} from '../controllers/community.events.controller.js';
import {
    createEventValidator,
    updateEventValidator,
    listQueryValidator
} from '../validators/community.validators.js';
import applicationRouter from './community.event.applications.routes.js';

const router = express.Router({ mergeParams: true });

// Apply auth middleware to all routes
router.use(authMiddleware);

// Event routes within communities
router.route('/')
    .post(createEventValidator, createEvent)
    .get(listQueryValidator, getCommunityEvents);

router.route('/:eventId')
    .get(getEvent)
    .patch(updateEventValidator, updateEvent)
    .delete(deleteEvent);

// Mount application routes for events
router.use('/:eventId/applications', applicationRouter);

export default router;