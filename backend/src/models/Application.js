const mongoose = require('mongoose');

// Query helpers
const findByEventAndStatus = function (eventId, status) {
  return this.find({ event: eventId, status })
    .populate('user', 'name email')
    .sort({ createdAt: 1 });
};

const findByUser = function (userId) {
  return this.find({ user: userId })
    .populate('event', 'title date location')
    .sort({ createdAt: -1 });
};

const findPendingApplications = function () {
  return this.find({ status: 'pending' })
    .populate('event user', 'title date location name email')
    .sort({ createdAt: 1 });
};

const applicationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
    required: true
  },
  motivation: {
    type: String,
    trim: true,
    minlength: [20, 'Motivation must be at least 20 characters long'],
    maxlength: [500, 'Motivation cannot exceed 500 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    trim: true,
    maxlength: [1000, 'Experience description cannot exceed 1000 characters']
  },
  availability: {
    type: Boolean,
    required: [true, 'Please confirm your availability for the event'],
    default: true
  },
  questionsOrComments: {
    type: String,
    trim: true,
    maxlength: [500, 'Questions/comments cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Instance methods
applicationSchema.methods.accept = async function () {
  const event = await mongoose.model('Event').findById(this.event);
  if (!event) {
    throw new Error('Event not found');
  }

  if (!event.canAcceptApplications()) {
    throw new Error('Event cannot accept more applications');
  }

  this.status = 'accepted';
  await this.save();

  event.participants += 1;
  await event.save();

  return this;
};

applicationSchema.methods.reject = async function (reason) {
  this.status = 'rejected';
  if (reason) {
    this.rejectionReason = reason;
  }
  await this.save();
  return this;
};

applicationSchema.methods.cancel = async function (reason) {
  if (this.status === 'accepted') {
    const event = await mongoose.model('Event').findById(this.event);
    if (event) {
      event.participants -= 1;
      await event.save();
    }
  }

  this.status = 'cancelled';
  if (reason) {
    this.cancellationReason = reason;
  }
  await this.save();
  return this;
};

// Add compound indexes
applicationSchema.index({ event: 1, user: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ event: 1, status: 1 }); // For querying applications by event and status
applicationSchema.index({ user: 1, createdAt: -1 }); // For user's application history

// Add query helpers
applicationSchema.statics.findByEventAndStatus = findByEventAndStatus;
applicationSchema.statics.findByUser = findByUser;
applicationSchema.statics.findPendingApplications = findPendingApplications;

// Pre-save hooks
applicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Check if user already has an application for this event
    const existingApplication = await this.constructor.findOne({
      event: this.event,
      user: this.user
    });

    if (existingApplication) {
      next(new Error('User has already applied for this event'));
      return;
    }

    // Check if event can accept new applications
    const event = await mongoose.model('Event').findById(this.event);
    if (!event) {
      next(new Error('Event not found'));
      return;
    }

    if (!event.canAcceptApplications()) {
      next(new Error('Event is not accepting applications'));
      return;
    }
  }

  if (this.isModified('status')) {
    // Notify user of status change (you can implement this based on your notification system)
    const user = await mongoose.model('User').findById(this.user);
    if (user && user.email) {
      // Implement notification logic here
      console.log(`Application status changed to ${this.status} for user ${user.email}`);
    }
  }

  next();
});

export const Application = mongoose.model('Application', applicationSchema);
