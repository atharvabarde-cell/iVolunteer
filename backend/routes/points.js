const express = require('express');
const router = express.Router();
const { awardPoints } = require('../controllers/pointsController');

// @route   POST /api/points/award
// @desc    Award points to a user
// @access  Private/Admin (optional: depending on your middleware setup)
router.post('/award', awardPoints);

module.exports = router;
