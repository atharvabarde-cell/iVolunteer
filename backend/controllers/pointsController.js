const User = require('../models/User');

// Award points to a user
exports.awardPoints = async (req, res) => {
  try {
    const { userId, points } = req.body; // points to award

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += points;
    await user.save();

    res.status(200).json({
      message: `${points} points awarded to ${user.name}`,
      points: user.points,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error awarding points', error });
  }
};
