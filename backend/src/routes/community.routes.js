import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    createCommunity,
    getCommunities,
    getCommunity,
    updateCommunity,
    joinCommunity,
    leaveCommunity,
    deleteCommunity
} from '../controllers/community.controller.js';
import {
    createCommunityValidator,
    updateCommunityValidator,
    listQueryValidator
} from '../validators/community.validators.js';
// import eventRouter from './community.events.routes.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Community routes
router.route('/')
    .post(createCommunityValidator, createCommunity)
    .get(listQueryValidator, getCommunities);

router.route('/:id')
    .get(getCommunity)
    .patch(updateCommunityValidator, updateCommunity)
    .delete(deleteCommunity);

router.route('/:id/join')
    .post(joinCommunity);

router.route('/:id/leave')
    .post(leaveCommunity);

// Mount event routes for communities
// router.use('/:communityId/events', eventRouter);

export default router;
