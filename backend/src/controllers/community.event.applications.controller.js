import { Event } from '../models/Event.js';
import { Application } from '../models/Application.js';
import { Community } from '../models/Community.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Apply for an event
export const applyForEvent = asyncHandler(async (req, res) => {
    const { communityId, eventId } = req.params;
    const { motivation, skills, experience, questionsOrComments } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    // Check if user is community member
    if (!community.isMember(req.user._id)) {
        throw new ApiError(403, 'Only community members can apply for events');
    }

    const event = await Event.findOne({
        _id: eventId,
        _id: { $in: community.events }
    });

    if (!event) {
        throw new ApiError(404, 'Event not found in this community');
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
        event: eventId,
        user: req.user._id
    });

    if (existingApplication) {
        throw new ApiError(400, 'You have already applied for this event');
    }

    // Check if event can accept applications
    if (!event.canAcceptApplications()) {
        throw new ApiError(400, 'This event is not accepting applications');
    }

    // Create application
    const application = await Application.create({
        event: eventId,
        user: req.user._id,
        motivation,
        skills,
        experience,
        questionsOrComments
    });

    // Add application to event
    event.applications.push(application._id);
    await event.save();

    return res.status(201).json(
        new ApiResponse(201, application, 'Application submitted successfully')
    );
});

// Get all applications for an event
export const getEventApplications = asyncHandler(async (req, res) => {
    const { communityId, eventId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    const event = await Event.findOne({
        _id: eventId,
        _id: { $in: community.events }
    });

    if (!event) {
        throw new ApiError(404, 'Event not found in this community');
    }

    // Check if user has permission to view applications
    const userRole = community.getMemberRole(req.user._id);
    if (userRole !== 'admin' && event.organizationId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You do not have permission to view applications');
    }

    const query = { event: eventId };
    if (status) query.status = status;

    const applications = await Application.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            applications,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }, 'Applications fetched successfully')
    );
});

// Update application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { communityId, eventId, applicationId } = req.params;
    const { status, reason } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    const event = await Event.findOne({
        _id: eventId,
        _id: { $in: community.events }
    });

    if (!event) {
        throw new ApiError(404, 'Event not found in this community');
    }

    // Check if user has permission to update applications
    const userRole = community.getMemberRole(req.user._id);
    if (userRole !== 'admin' && event.organizationId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You do not have permission to update applications');
    }

    const application = await Application.findOne({
        _id: applicationId,
        event: eventId
    });

    if (!application) {
        throw new ApiError(404, 'Application not found');
    }

    // Update application based on status
    switch (status) {
        case 'accepted':
            await application.accept();
            break;
        case 'rejected':
            await application.reject(reason);
            break;
        case 'cancelled':
            await application.cancel(reason);
            break;
        default:
            throw new ApiError(400, 'Invalid status');
    }

    return res.status(200).json(
        new ApiResponse(200, application, 'Application status updated successfully')
    );
});

// Get user's applications
export const getUserApplications = asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const community = await Community.findById(communityId);
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    const query = {
        user: req.user._id,
        event: { $in: community.events }
    };

    if (status) query.status = status;

    const applications = await Application.find(query)
        .populate('event', 'title date location')
        .sort('-createdAt')
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            applications,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }, 'User applications fetched successfully')
    );
});