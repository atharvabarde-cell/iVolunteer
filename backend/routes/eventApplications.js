// routes/eventApplications.js
const express = require('express');
const router = express.Router();
const EventApplication = require('../models/EventApplication');
const User = require('../models/User');

router.post('/apply', async (req, res) => {
  try {
    const { eventId, userId, fullName, phone, message } = req.body;

const application = new EventApplication({ eventId, userId, fullName, phone, message });
await application.save(); // <-- first confirm it saves

// Only then award points
await User.findByIdAndUpdate(userId, { $inc: { points: 50 } });

    res.status(201).json({ message: 'Application submitted and points awarded!', application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this event' });
    }
    res.status(500).json({ message: 'Error applying for event', error });
  }
});

module.exports = router;
