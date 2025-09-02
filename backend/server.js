const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const pointsRoutes = require('./routes/points');
const eventApplicationsRoutes = require('./routes/eventApplications');


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/event-applications', eventApplicationsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
