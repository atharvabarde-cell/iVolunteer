import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
        type: String,
        enum: ["user", "ngo", "admin"],
        default: "user"
    },
    points: {
        type: Number,
        default: 0,
        min: [0, "Points cannot be negative"]
    },
    coins: {
        type: Number,
        default: 0,
        min: [0, "Coins cannot be negative"]
    },
    volunteeredHours: {
        type: Number,
        default: 0,
        min: [0, "Volunteered hours cannot be negative"]
    },
    completedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    badges: [{
        name: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],

    resetPasswordToken: {
        type: String,
        unique: true,
        sparse: true
    },

    resetPasswordExpiresAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ points: -1 }); // For leaderboard queries

// Virtual for total rewards (points + coins)
userSchema.virtual('totalRewards').get(function() {
    return this.points + this.coins;
});

// Method to award points
userSchema.methods.awardPoints = async function(points) {
    if (points < 0) throw new Error("Cannot award negative points");
    this.points += points;
    await this.save();
    return this.points;
};

// Method to award coins
userSchema.methods.awardCoins = async function(coins) {
    if (coins < 0) throw new Error("Cannot award negative coins");
    this.coins += coins;
    await this.save();
    return this.coins;
};

// Method to spend coins
userSchema.methods.spendCoins = async function(coins) {
    if (coins < 0) throw new Error("Cannot spend negative coins");
    if (this.coins < coins) throw new Error("Insufficient coins");
    this.coins -= coins;
    await this.save();
    return this.coins;
};

// Add badge
userSchema.methods.addBadge = async function(badgeName) {
    if (!this.badges.some(badge => badge.name === badgeName)) {
        this.badges.push({ name: badgeName });
        await this.save();
    }
    return this.badges;
};

export const User = mongoose.model("User", userSchema);
