import { User } from "../models/User.js";
import { pointsRules, badgeRules } from "./pointsBadgeRules.js";

export const addPoints = async (userId, actionType, referenceId = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 1. Find matching rule
  const rule = pointsRules.find(r => r.type === actionType);
  if (!rule) throw new Error("No points rule found for this action");

  // 2. Prevent duplicate rewards for same reference (e.g., same donation/event)
  if (referenceId) {
    const alreadyRewarded = user.pointsHistory.some(
      h => h.type === actionType && h.referenceId === referenceId
    );
    if (alreadyRewarded) throw new Error("Points already awarded for this action");
  }

  // 3. Add points
  user.points += rule.points;
  user.pointsHistory.push({ type: actionType, points: rule.points, referenceId });

  // 4. Calculate level
  const pointsPerLevel = 500;
  const currentLevel = Math.floor(user.points / pointsPerLevel) + 1;

  // 5. Badge check
  const unlockedBadges = [];
  badgeRules.forEach(badge => {
    const alreadyUnlocked = user.badges.some(b => b.badgeId === badge.id);
    if (!alreadyUnlocked && user.points >= badge.criteriaPoints) {
      const newBadge = {
        badgeId: badge.id,
        name: badge.name,
        tier: badge.tier,
        icon: badge.icon,
      };
      user.badges.push(newBadge);
      unlockedBadges.push(newBadge);
    }
  });

  await user.save();

  return {
    totalPoints: user.points,
    currentLevel,
    newBadges: unlockedBadges,
    allBadges: user.badges,
  };
};
