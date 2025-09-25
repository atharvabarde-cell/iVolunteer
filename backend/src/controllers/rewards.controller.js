import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { RegistrationReward } from "../models/RegistrationReward.js";

// Model to track daily rewards
import mongoose from "mongoose";

const dailyRewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String, // Store date as YYYY-MM-DD string
        required: true
    },
    coins: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ["daily_quote", "login_bonus", "activity_completion"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one reward per user per day per type
dailyRewardSchema.index({ userId: 1, date: 1, type: 1 }, { unique: true });

const DailyReward = mongoose.model("DailyReward", dailyRewardSchema);

export const rewardsController = {
    // Claim daily quote reward
    claimDailyReward: async (req, res) => {
        try {
            const userId = req.user._id;
            const { type = "daily_quote" } = req.body;
            const today = new Date().toISOString().split('T')[0];

            // Check if user already claimed this reward today
            const existingReward = await DailyReward.findOne({
                userId,
                date: today,
                type
            });

            if (existingReward) {
                throw new ApiError(400, "Daily reward already claimed for today");
            }

            // Define reward amounts based on type
            const rewardAmounts = {
                daily_quote: 10,
                login_bonus: 5,
                activity_completion: 20
            };

            const coinAmount = rewardAmounts[type] || 10;

            // Start transaction to ensure data consistency
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Create daily reward record
                const dailyReward = new DailyReward({
                    userId,
                    date: today,
                    coins: coinAmount,
                    type
                });
                await dailyReward.save({ session });

                // Award coins to user
                await User.findByIdAndUpdate(
                    userId,
                    { $inc: { coins: coinAmount } },
                    { session, new: true }
                );

                await session.commitTransaction();

                logger.info(`Daily reward claimed: ${type}`, {
                    userId,
                    coins: coinAmount,
                    date: today
                });

                return res.status(200).json(
                    new ApiResponse(200, {
                        message: `Daily reward claimed! +${coinAmount} coins`,
                        coins: coinAmount,
                        type,
                        date: today
                    })
                );

            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }

        } catch (error) {
            logger.error("Error claiming daily reward", {
                error: error.message,
                userId: req.user?._id,
                stack: error.stack
            });

            const statusCode = error instanceof ApiError ? error.statusCode : 500;
            const message = error instanceof ApiError ? error.message : "Failed to claim daily reward";
            
            return res.status(statusCode).json({
                success: false,
                message
            });
        }
    },

    // Get user's reward status and statistics
    getUserRewardStats: async (req, res) => {
        try {
            const userId = req.user._id;
            const today = new Date().toISOString().split('T')[0];

            // Get user's current coins and stats
            const user = await User.findById(userId).select('coins points volunteeredHours badges');
            if (!user) {
                throw new ApiError(404, "User not found");
            }

            // Check today's claimed rewards
            const todayRewards = await DailyReward.find({
                userId,
                date: today
            });

            // Calculate total coins earned (lifetime) - include both daily rewards and registration bonus
            const dailyCoinsEarned = await DailyReward.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: "$coins" } } }
            ]);

            const registrationCoinsEarned = await RegistrationReward.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: "$coins" } } }
            ]);

            // Calculate current streak
            const streak = await calculateStreak(userId);

            // Calculate total spent (assuming coins can only be spent, so totalEarned - currentCoins = spent)
            const dailyCoins = dailyCoinsEarned[0]?.total || 0;
            const registrationCoins = registrationCoinsEarned[0]?.total || 0;
            const totalEarned = dailyCoins + registrationCoins;
            const totalSpent = Math.max(0, totalEarned - user.coins);

            const rewardStatus = {
                activeCoins: user.coins,
                totalCoinsEarned: totalEarned,
                totalSpent: totalSpent,
                points: user.points,
                badges: user.badges?.length || 0,
                streak: `${streak} days`,
                streakCount: streak,
                volunteeredHours: user.volunteeredHours,
                todaysClaimed: {
                    daily_quote: todayRewards.some(r => r.type === 'daily_quote'),
                    login_bonus: todayRewards.some(r => r.type === 'login_bonus'),
                    activity_completion: todayRewards.some(r => r.type === 'activity_completion')
                }
            };

            return res.status(200).json(
                new ApiResponse(200, rewardStatus, "Reward statistics retrieved successfully")
            );

        } catch (error) {
            logger.error("Error fetching reward stats", {
                error: error.message,
                userId: req.user?._id,
                stack: error.stack
            });

            const statusCode = error instanceof ApiError ? error.statusCode : 500;
            const message = error instanceof ApiError ? error.message : "Failed to fetch reward statistics";
            
            return res.status(statusCode).json({
                success: false,
                message
            });
        }
    },

    // Spend coins (for rewards store)
    spendCoins: async (req, res) => {
        try {
            const userId = req.user._id;
            const { amount, itemName, itemId } = req.body;

            if (!amount || amount <= 0) {
                throw new ApiError(400, "Invalid coin amount");
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new ApiError(404, "User not found");
            }

            if (user.coins < amount) {
                throw new ApiError(400, "Insufficient coins");
            }

            // Deduct coins
            await user.spendCoins(amount);

            logger.info("Coins spent", {
                userId,
                amount,
                itemName,
                remainingCoins: user.coins - amount
            });

            return res.status(200).json(
                new ApiResponse(200, {
                    message: `Successfully purchased ${itemName}`,
                    coinsSpent: amount,
                    remainingCoins: user.coins - amount
                })
            );

        } catch (error) {
            logger.error("Error spending coins", {
                error: error.message,
                userId: req.user?._id,
                stack: error.stack
            });

            const statusCode = error instanceof ApiError ? error.statusCode : 500;
            const message = error instanceof ApiError ? error.message : "Failed to spend coins";
            
            return res.status(statusCode).json({
                success: false,
                message
            });
        }
    },

    // Get reward history
    getRewardHistory: async (req, res) => {
        try {
            const userId = req.user._id;
            const { page = 1, limit = 20 } = req.query;

            const rewards = await DailyReward.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .select('date coins type createdAt');

            const total = await DailyReward.countDocuments({ userId });

            return res.status(200).json(
                new ApiResponse(200, {
                    rewards,
                    pagination: {
                        current: page,
                        total: Math.ceil(total / limit),
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                })
            );

        } catch (error) {
            logger.error("Error fetching reward history", {
                error: error.message,
                userId: req.user?._id,
                stack: error.stack
            });

            return res.status(500).json({
                success: false,
                message: "Failed to fetch reward history"
            });
        }
    }
};

// Helper function to calculate streak
async function calculateStreak(userId) {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        const reward = await DailyReward.findOne({
            userId,
            date: dateString,
            type: 'daily_quote'
        });

        if (reward) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }

        // Prevent infinite loop - max 365 days
        if (streak >= 365) break;
    }

    return streak;
}

export { DailyReward };