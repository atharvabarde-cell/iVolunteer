const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  organizationId: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  participants: { type: Number, default: 0 },
  maxParticipants: { type: Number, required: true },
  coins: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;