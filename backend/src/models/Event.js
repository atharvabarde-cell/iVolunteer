import mongoose from "mongoose";

// Query helpers
const findApprovedUpcoming = function () {
  return this.find({
    status: "approved",
    date: { $gt: new Date() },
  }).sort({ date: 1 });
};

const findByOrganization = function (organizationId) {
  return this.find({ organizationId }).sort({ date: -1 });
};

const findAvailableByCategory = function (category) {
  return this.find({
    category,
    status: "approved",
    date: { $gt: new Date() },
    $expr: { $lt: ["$participants", "$maxParticipants"] },
  }).sort({ date: 1 });
};

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    organization: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organization ID is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please provide a valid time in HH:MM format",
      ],
    },
    duration: {
      type: Number,
      required: [true, "Event duration is required"],
      min: [1, "Duration must be at least 1 hour"],
      max: [12, "Duration cannot exceed 12 hours"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: [
          "environmental",
          "education",
          "healthcare",
          "community",
          "animal-welfare",
          "other",
        ],
        message: "{VALUE} is not a supported category",
      },
    },
    participants: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
      default: [] 
    },

    maxParticipants: {
      type: Number,
      required: [true, "Maximum participants is required"],
      min: [1, "Must allow at least 1 participant"],
      max: [1000, "Cannot exceed 1000 participants"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "completed", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "approved",
    },
    eventStatus: {
      type: String,
      enum: {
        values: ["ongoing", "completed", "upcoming", "cancelled", "postponed"],
        message: "{VALUE} is not a valid event status",
      },
      default: "upcoming",
    },
    pointsOffered: {
      type: Number,
      required: [true, "Points reward must be specified"],
      min: [0, "Points cannot be negative"],
      default: 50,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    sponsorshipRequired: {
      type: Boolean,
      default: true,
    },
    sponsorshipAmount: {
      type: Number,
      min: [0, "Sponsorship amount cannot be negative"],
      default: 1000,
      validate: {
        validator: function (value) {
          if (this.sponsorshipRequired) {
            return value > 0;
          }
          return true;
        },
        message: "Sponsorship amount must be > 0 if sponsorship is required",
      },
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    virtuals: {
      isOpen: {
        get() {
          return (
            this.status === "approved" &&
            this.date > new Date() &&
            this.participants < this.maxParticipants
          );
        },
      },
      participantsNeeded: {
        get() {
          return Math.max(0, this.maxParticipants - this.participants);
        },
      },
      participationRate: {
        get() {
          return ((this.participants / this.maxParticipants) * 100).toFixed(1);
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Instance methods
eventSchema.methods.isFull = function () {
  return this.participants >= this.maxParticipants;
};

eventSchema.methods.canAcceptApplications = function () {
  return this.isOpen && !this.isFull();
};

eventSchema.methods.hasUserApplied = async function (userId) {
  const application = await mongoose.model("Application").findOne({
    event: this._id,
    user: userId,
  });
  return !!application;
};

eventSchema.methods.acceptApplication = async function (applicationId) {
  if (!this.canAcceptApplications()) {
    throw new Error("Event cannot accept more applications");
  }

  const application = await mongoose
    .model("Application")
    .findByIdAndUpdate(applicationId, { status: "accepted" }, { new: true });

  if (!application) {
    throw new Error("Application not found");
  }

  this.participants += 1;
  await this.save();

  return application;
};

// Pre-save hook to validate participant count
eventSchema.pre("save", function (next) {
  if (this.participants > this.maxParticipants) {
    next(new Error("Participants count cannot exceed maximum participants"));
  } else {
    next();
  }
});

// Pre-save hook to handle status changes
eventSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    // If event is cancelled, update all pending applications
    if (this.status === "cancelled") {
      await mongoose
        .model("Application")
        .updateMany(
          { event: this._id, status: "pending" },
          { status: "cancelled" }
        );
    }

    // If event is completed, calculate and award points
    if (this.status === "completed") {
      const applications = await mongoose
        .model("Application")
        .find({ event: this._id, status: "accepted" });

      for (const app of applications) {
        const user = await mongoose.model("User").findById(app.user);
        if (user) {
          user.points += this.pointsOffered;
          await user.save();
        }
      }
    }
  }
  next();
});

// Add indexes
eventSchema.index({ status: 1, date: 1 }); // For querying upcoming approved events
eventSchema.index({ organizationId: 1, date: -1 }); // For organization's events
eventSchema.index({ category: 1, status: 1, date: 1 }); // For category-based queries

// Add query helpers
eventSchema.statics.findApprovedUpcoming = findApprovedUpcoming;
eventSchema.statics.findByOrganization = findByOrganization;
eventSchema.statics.findAvailableByCategory = findAvailableByCategory;

export const Event = mongoose.model("Event", eventSchema);
