const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'ngo', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },

  // Added for your system
  points: { type: Number, default: 0 }, // total earned points
  coins: { type: Number, default: 0 },  // current coins balance
});

const User = mongoose.model('User', userSchema);

module.exports = User;
