const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Application = require('../models/Application');

// Create Event
router.post('/', async (req, res) => {
  const eventData = req.body;
  try {
    const newEvent = new Event({
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: "An error occurred while creating the event" });
  }
});

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: "An error occurred while fetching events" });
  }
});

// Approve Event
router.put('/:id/approve', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { id: req.params.id },
      { status: 'approved' },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event approved successfully", event });
  } catch (err) {
    console.error('Error approving event:', err);
    res.status(500).json({ message: "An error occurred while approving the event" });
  }
});

// Reject Event
router.put('/:id/reject', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { id: req.params.id },
      { status: 'rejected' },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event rejected successfully", event });
  } catch (err) {
    console.error('Error rejecting event:', err);
    res.status(500).json({ message: "An error occurred while rejecting the event" });
  }
});

// Apply to Event
router.post('/:id/apply', async (req, res) => {
  const { userId, userName, userEmail } = req.body;
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.participants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const newApplication = new Application({
      id: Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      userId,
      userName,
      userEmail,
      status: 'pending',
    });
    await newApplication.save();

    event.applications.push(newApplication._id);
    event.participants += 1;
    await event.save();
    
    res.status(200).json({ message: "Application successful", application: newApplication });
  } catch (err) {
    console.error('Error applying to event:', err);
    res.status(500).json({ message: "An error occurred while applying to the event" });
  }
});

router.get('/applications/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId });
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by user:', err);
    res.status(500).json({ message: "An error occurred while fetching applications" });
  }
});

router.get('/applications/event/:eventId', async (req, res) => {
  try {
    const applications = await Application.find({ eventId: req.params.eventId });
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by event:', err);
    res.status(500).json({ message: "An error occurred while fetching applications" });
  }
});

module.exports = router;