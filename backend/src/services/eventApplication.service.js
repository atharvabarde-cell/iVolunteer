import { EventApplication } from "../models/EventApplication.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const createApplication = async (data, userId, eventId) => {
    try {
        const application = new EventApplication({
            eventId,
            userId,
            fullName: data.fullName,
            phone: data.phone,
            message: data.message
        });
        await application.save();

        // Award points after successful application using the new User method
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        await user.awardPoints(50); // Award 50 points for applying

        return application;
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, "You have already applied for this event");
        }
        throw new ApiError(500, "Error applying for event");
    }
};

const getUserApplications = async (userId) => {
    const applications = await EventApplication.find({ userId })
        .populate("eventId", "title description date location") // Populate event details
        .sort({ createdAt: -1 }); // Most recent first

    return applications;
};

export const eventApplicationService = {
    createApplication,
    getUserApplications
};