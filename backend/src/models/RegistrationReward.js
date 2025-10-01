import mongoose from "mongoose";

const registrationRewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // Ensure only one registration reward per user
    },
    coins: {
        type: Number,
        required: true,
        min: 0,
        default: 50
    },
    type: {
        type: String,
        default: "registration_bonus"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const RegistrationReward = mongoose.model("RegistrationReward", registrationRewardSchema);