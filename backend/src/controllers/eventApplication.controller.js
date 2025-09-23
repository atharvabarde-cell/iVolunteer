import { eventApplicationService } from "../services/eventApplication.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const applyForEvent = asyncHandler(async (req, res) => {
  const user = req.user?._id; // Get user from auth middleware
  const eventId = req.params.id;

  const application = await eventApplicationService.createApplication(
    req.body,
    user,
    eventId
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, application, "Application submitted successfully")
    );
});

const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await eventApplicationService.getUserApplications(
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications retrieved successfully")
    );
});

export const eventApplicationController = {
  applyForEvent,
  getUserApplications,
};
