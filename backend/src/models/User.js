import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
        unique: true,
        lowercase: true,
        trim: true
	},

	name: { 
		type: String, 
		required: true 
	},

	password: { 
		type: String, 
		required: true 
	},

	role: { 
		type: String, 
		enum: ["user", "ngo", "admin"], 
		default: "user",
	},

	// Added for your system
	points: { type: Number, default: 0 }, // total earned points
	coins: { type: Number, default: 0 }, // current coins balance
	
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);

