import { DonationEvent } from "../models/DonationEvent.js";

export const createEventService = async (ngoId, eventData) => {
  const event = await DonationEvent.create({ ngoId, ...eventData });
  return event;
};

export const getAllActiveEventsService = async () => {
  return DonationEvent.find({ status: "active" }).populate("ngoId", "name email").sort({ createdAt: -1 });
};
