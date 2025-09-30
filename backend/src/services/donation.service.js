import { DonationEvent } from "../models/DonationEvent.js";
import { Donation } from "../models/Donation.js";
import { User } from "../models/User.js";
import crypto from "crypto";

// Verify Razorpay signature
export const verifySignature = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};

// Create donation and update user/event
export const donateToEventService = async (userId, eventId, amount) => {
  const event = await DonationEvent.findById(eventId);
  if (!event || event.status !== "active") {
    throw new Error("Event not found or not active");
  }

  const remaining = event.goalAmount - event.collectedAmount;
  if (remaining <= 0) {
    throw new Error("Donation goal already reached");
  }

  const finalAmount = Math.min(amount, remaining);

  const donation = await Donation.create({ userId, eventId, amount: finalAmount });

  event.collectedAmount += finalAmount;
  if (event.collectedAmount >= event.goalAmount) {
    event.status = "completed";
  }
  await event.save();

  const user = await User.findById(userId);
  const coinsEarned = Math.floor(finalAmount * 1.5);
  user.coins += coinsEarned;
  await user.save();

  return { donation, updatedEvent: event, coinsEarned };
};
