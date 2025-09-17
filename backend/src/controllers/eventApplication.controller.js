import { eventApplicationService } from "../services/eventApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const applyForEvent = asyncHandler(async (req, res) => {
    const { eventId, phone, message } = req.body;
    const user = req.user; // Get user from auth middleware

    const application = await eventApplicationService.createApplication({
        eventId,
        userId: user._id,
        fullName: user.name,
        phone,
        message
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully")
    );
});

const getUserApplications = asyncHandler(async (req, res) => {
    const applications = await eventApplicationService.getUserApplications(req.user._id);
    
    return res.status(200).json(
        new ApiResponse(200, applications, "Applications retrieved successfully")
    );
});

export const eventApplicationController = {
    applyForEvent,
    getUserApplications
};