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

// Model to track participation rewards
const participationRewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    coins: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ["participation", "completion"],
        default: "participation"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one reward per user per event
participationRewardSchema.index({ userId: 1, eventId: 1, type: 1 }, { unique: true });

const ParticipationReward = mongoose.model("ParticipationReward", participationRewardSchema);

export const rewardsController = {
    // Debug endpoint to check reward records
    debugRewardRecords: async (req, res) => {
        try {
            const userId = req.user._id;
            
            console.log('Debug: Checking reward records for userId:', userId);

            // Get all daily rewards for user
            const dailyRewards = await DailyReward.find({ userId }).sort({ createdAt: -1 });
            console.log('Debug: Daily rewards found:', dailyRewards.length);

            // Get all registration rewards for user
            const registrationRewards = await RegistrationReward.find({ userId }).sort({ createdAt: -1 });
            console.log('Debug: Registration rewards found:', registrationRewards.length);

            // Get all participation rewards for user
            const participationRewards = await ParticipationReward.find({ userId }).sort({ createdAt: -1 });
            console.log('Debug: Participation rewards found:', participationRewards.length);

            return res.status(200).json(
                new ApiResponse(200, {
                    dailyRewards,
                    registrationRewards,
                    participationRewards,
                    userId
                })
            );

        } catch (error) {
            logger.error("Error debugging reward records", {
                error: error.message,
                stack: error.stack
            });

            return res.status(500).json({
                success: false,
                message: "Failed to debug reward records"
            });
        }
    },

    // Migration function to create participation reward records for existing participations
    migrateParticipationRewards: async (req, res) => {
        try {
            // Import Event model
            const { Event } = await import("../models/Event.js");
            
            // Get all events with participants
            const eventsWithParticipants = await Event.find({
                participants: { $exists: true, $ne: [] }
            }).populate('participants', '_id');

            let migratedCount = 0;
            
            for (const event of eventsWithParticipants) {
                if (Array.isArray(event.participants) && event.participants.length > 0) {
                    for (const participant of event.participants) {
                        const userId = participant._id || participant;
                        
                        // Check if participation reward already exists
                        const existingReward = await ParticipationReward.findOne({
                            userId,
                            eventId: event._id,
                            type: "participation"
                        });

                        if (!existingReward) {
                            // Calculate participation points (10% of event points)
                            const participationPoints = Math.floor((event.pointsOffered || 50) * 0.1);
                            
                            // Create participation reward record
                            const participationReward = new ParticipationReward({
                                userId,
                                eventId: event._id,
                                coins: participationPoints,
                                type: "participation"
                            });
                            
                            await participationReward.save();
                            migratedCount++;
                        }
                    }
                }
            }

            logger.info("Participation rewards migration completed", {
                migratedCount
            });

            return res.status(200).json(
                new ApiResponse(200, {
                    message: `Migration completed! Created ${migratedCount} participation reward records.`,
                    migratedCount
                })
            );

        } catch (error) {
            logger.error("Error migrating participation rewards", {
                error: error.message,
                stack: error.stack
            });

            return res.status(500).json({
                success: false,
                message: "Failed to migrate participation rewards"
            });
        }
    },

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

            // Calculate total coins earned (lifetime) - include daily, registration, and participation rewards
            console.log('Debug: userId for aggregation:', userId, 'Type:', typeof userId);
            
            // Convert userId to ObjectId if it's a string
            const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
            
            const dailyCoinsEarned = await DailyReward.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$coins" } } }
            ]);

            console.log('Debug: Daily coins aggregation result:', dailyCoinsEarned);

            const registrationCoinsEarned = await RegistrationReward.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$coins" } } }
            ]);

            console.log('Debug: Registration coins aggregation result:', registrationCoinsEarned);

            const participationCoinsEarned = await ParticipationReward.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$coins" } } }
            ]);

            console.log('Debug: Participation coins aggregation result:', participationCoinsEarned);

            // Alternative approach: Use simple find queries and calculate totals manually
            const dailyRewardsRecords = await DailyReward.find({ userId: userObjectId });
            const registrationRewardsRecords = await RegistrationReward.find({ userId: userObjectId });
            const participationRewardsRecords = await ParticipationReward.find({ userId: userObjectId });

            const dailyCoinsAlternative = dailyRewardsRecords.reduce((sum, record) => sum + (record.coins || 0), 0);
            const registrationCoinsAlternative = registrationRewardsRecords.reduce((sum, record) => sum + (record.coins || 0), 0);
            const participationCoinsAlternative = participationRewardsRecords.reduce((sum, record) => sum + (record.coins || 0), 0);

            console.log('Debug: Alternative calculation results:', {
                dailyCoinsAlternative,
                registrationCoinsAlternative,
                participationCoinsAlternative,
                dailyRecordsCount: dailyRewardsRecords.length,
                registrationRecordsCount: registrationRewardsRecords.length,
                participationRecordsCount: participationRewardsRecords.length
            });

            // Calculate current streak
            const streak = await calculateStreak(userId);

            // Calculate total spent (using alternative calculation for now)
            const dailyCoins = dailyCoinsAlternative;
            const registrationCoins = registrationCoinsAlternative;
            const participationCoins = participationCoinsAlternative;
            const totalEarned = dailyCoins + registrationCoins + participationCoins;
            const totalSpent = Math.max(0, totalEarned - user.coins);

            console.log('Debug: Final calculation breakdown:', {
                dailyCoins,
                registrationCoins,
                participationCoins,
                totalEarned,
                userCoins: user.coins,
                totalSpent
            });

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

export { DailyReward, ParticipationReward };