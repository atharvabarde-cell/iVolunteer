import * as donationService from "../services/donation.service.js";

export const donateToEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId, amount } = req.body;

    const result = await donationService.donateToEventService(userId, eventId, amount);

    res.status(201).json({
      success: true,
      message: `Donation successful! You earned ${result.coinsEarned} coins 🎉`,
      ...result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};