import { User } from "../models/User.js";
import { addPoints } from "../services/pointsBadge.service.js";

const earnPoints = async (req, res) => {
  try {
    const { actionType, referenceId } = req.body;

    // Call service to add points
    const result = await addPoints(req.user._id, actionType, referenceId);

    res.json({
      success: true,
      totalPoints: result.totalPoints,
      currentLevel: result.currentLevel, // send level to frontend
      newBadges: result.newBadges,
      allBadges: result.allBadges,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("points badges");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      points: user.points,
      badges: user.badges,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const pointsBadgesController = {
  earnPoints,
  getMyPoints,
};
