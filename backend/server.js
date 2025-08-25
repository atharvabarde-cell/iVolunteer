const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
const uri = "mongodb://localhost:27017/iVolunteer"; 
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Common User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'ngo', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// Event Schema
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

// Event Application Schema
const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});
const Application = mongoose.model('Application', applicationSchema);

// --- AUTHENTICATION ROUTES ---

// General Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = new User({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password, // In a real app, you would hash this password
      role,
    });
    await newUser.save();

    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ message: "Account created successfully", user: userData });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// General Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  
  try {
    // Hardcoded admin login for demo purposes
    if (email === "admin@volunteer.com" && password === "admin123" && role === "admin") {
      const adminUser = { id: "admin-001", email, name: "System Admin", role: "admin", createdAt: new Date().toISOString() };
      return res.status(200).json({ message: "Admin login successful", user: adminUser });
    }

    const foundUser = await User.findOne({ email, role });
    if (!foundUser || foundUser.password !== password) {
      return res.status(401).json({ message: "Invalid email, password, or role" });
    }
    
    const { password: _, ...userData } = foundUser.toObject();
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// --- EVENT & APPLICATION ROUTES ---

// Create Event
app.post('/api/events', async (req, res) => {
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
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: "An error occurred while fetching events" });
  }
});

// Approve Event
app.put('/api/events/:id/approve', async (req, res) => {
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
app.put('/api/events/:id/reject', async (req, res) => {
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

// Apply to Event (New)
app.post('/api/events/:id/apply', async (req, res) => {
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

app.get('/api/applications/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId });
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by user:', err);
    res.status(500).json({ message: "An error occurred while fetching applications" });
  }
});

app.get('/api/applications/event/:eventId', async (req, res) => {
  try {
    const applications = await Application.find({ eventId: req.params.eventId });
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by event:', err);
    res.status(500).json({ message: "An error occurred while fetching applications" });
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));