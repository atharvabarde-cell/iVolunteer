const express = require('express');
const router = express.Router();
const User = require('../models/User');

// General Sign Up
router.post('/signup', async (req, res) => {
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
      password,
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
router.post('/login', async (req, res) => {
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

module.exports = router;