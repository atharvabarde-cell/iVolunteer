import express from "express";
import { rewardsController } from "../controllers/rewards.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { rewardsValidator } from "../validators/rewards.validators.js";

const router = express.Router();

// All routes require authentication
router.use(authentication);

// Claim daily reward (daily quote, login bonus, etc.)
router.post(
    "/daily-claim",
    validate(rewardsValidator.dailyRewardSchema),
    rewardsController.claimDailyReward
);

// Get user reward statistics
router.get(
    "/stats",
    rewardsController.getUserRewardStats
);

// Spend coins
router.post(
    "/spend",
    validate(rewardsValidator.spendCoinsSchema),
    rewardsController.spendCoins
);

// Get reward history
router.get(
    "/history",
    rewardsController.getRewardHistory
);

export default router;