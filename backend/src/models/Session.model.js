import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    }
}, {timestamps: true});

export const Session = mongoose.model("Session", sessionSchema);