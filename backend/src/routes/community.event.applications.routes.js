import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    applyForEvent,
    getEventApplications,
    updateApplicationStatus,
    getUserApplications
} from '../controllers/community.event.applications.controller.js';
import {
    createApplicationValidator,
    updateApplicationStatusValidator,
    listQueryValidator
} from '../validators/community.validators.js';

const router = express.Router({ mergeParams: true });

// Apply auth middleware to all routes
router.use(authMiddleware);

// Application routes
router.route('/')
    .post(createApplicationValidator, applyForEvent)
    .get(listQueryValidator, getEventApplications);

router.route('/my-applications')
    .get(listQueryValidator, getUserApplications);

router.route('/:applicationId')
    .patch(updateApplicationStatusValidator, updateApplicationStatus);

export default router;