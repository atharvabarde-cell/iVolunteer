import { DonationEvent } from "../models/DonationEvent.js";
import { Donation } from "../models/Donation.js";
import { User } from "../models/User.js";

export const donateToEventService = async (userId, eventId, amount) => {
  const event = await DonationEvent.findById(eventId);
  if (!event || event.status !== "active") {
    throw new Error("Event not found or not active");
  }

  // ✅ Check remaining amount
  const remaining = event.goalAmount - event.collectedAmount;
  if (remaining <= 0) {
    throw new Error("Donation goal already reached");
  }

  // Optional: Cap donation to remaining amount
  const finalAmount = Math.min(amount, remaining);

  // Create donation
  const donation = await Donation.create({ userId, eventId, amount: finalAmount });

  // Update collectedAmount
  event.collectedAmount += finalAmount;

  // Optional: Mark event as completed
  if (event.collectedAmount >= event.goalAmount) {
    event.status = "completed"; // or "inactive"
  }

  await event.save();

  // Reward user
  const user = await User.findById(userId);
  user.coins += Math.floor(finalAmount * 1.5); // apply 1.5x coins reward
  await user.save();

  return { donation, updatedEvent: event };
};


