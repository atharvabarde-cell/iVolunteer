# Daily Rewards System API Documentation

## Overview
The daily rewards system allows users to earn coins through various activities and spend them in the rewards store. It includes security measures to prevent abuse and ensures users can only claim rewards once per day.

## API Endpoints

### 1. Claim Daily Reward
**POST** `/api/v1/rewards/daily-claim`

**Description:** Allows users to claim their daily reward (coins) once per day.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "daily_quote" // Optional: "daily_quote" | "login_bonus" | "activity_completion"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Daily reward claimed! +10 coins",
    "coins": 10,
    "type": "daily_quote",
    "date": "2025-09-23"
  }
}
```

**Error Responses:**
- `400` - Daily reward already claimed for today
- `401` - Authentication required
- `500` - Server error

---

### 2. Get User Reward Statistics
**GET** `/api/v1/rewards/stats`

**Description:** Retrieves user's reward statistics including coins, streak, badges, etc.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "activeCoins": 1250,
    "totalCoinsEarned": 3500,
    "totalSpent": 2250,
    "points": 150,
    "badges": 12,
    "streak": "5 days",
    "streakCount": 5,
    "volunteeredHours": 25,
    "todaysClaimed": {
      "daily_quote": true,
      "login_bonus": false,
      "activity_completion": false
    }
  }
}
```

---

### 3. Spend Coins
**POST** `/api/v1/rewards/spend`

**Description:** Spend coins to purchase items from the rewards store.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 100,
  "itemName": "Coffee Voucher",
  "itemId": "coffee" // Optional
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully purchased Coffee Voucher",
    "coinsSpent": 100,
    "remainingCoins": 1150
  }
}
```

**Error Responses:**
- `400` - Insufficient coins / Invalid amount
- `401` - Authentication required
- `500` - Server error

---

### 4. Get Reward History
**GET** `/api/v1/rewards/history?page=1&limit=20`

**Description:** Get user's reward claim history with pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "_id": "...",
        "date": "2025-09-23",
        "coins": 10,
        "type": "daily_quote",
        "createdAt": "2025-09-23T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "total": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Security Features

### 1. Daily Limit Enforcement
- Users can only claim each reward type once per day
- Database constraint prevents duplicate claims
- Date-based checking (YYYY-MM-DD format)

### 2. Authentication Required
- All endpoints require valid JWT token
- User authentication middleware validates tokens
- User context is available in all controller functions

### 3. Transaction Safety
- MongoDB transactions ensure data consistency
- Atomic operations for coin updates
- Rollback on errors

### 4. Rate Limiting
- Global rate limiting applied to all routes
- Prevents abuse and spam requests

## Database Models

### DailyReward Schema
```javascript
{
  userId: ObjectId,          // Reference to User
  date: String,              // Date in YYYY-MM-DD format
  coins: Number,             // Number of coins awarded
  type: String,              // "daily_quote" | "login_bonus" | "activity_completion"
  createdAt: Date            // Timestamp
}
```

**Indexes:**
- Compound unique index on (userId, date, type) prevents duplicate claims

### User Schema Updates
```javascript
{
  // ... existing fields
  coins: {
    type: Number,
    default: 0,
    min: 0
  },
  // ... methods
  awardCoins(amount),        // Add coins
  spendCoins(amount)         // Spend coins (with validation)
}
```

## Frontend Integration

### UserContext
The `UserContext` provides:
- Real-time coin balance
- Daily reward claim status
- User statistics
- Functions to claim rewards and refresh data

### Components
1. **Dailyquote** - Daily reward claiming interface
2. **Useranalytics** - Statistics dashboard
3. **RewardsStore** - Coin spending interface

### Example Usage
```typescript
const { activeCoins, claimDailyReward, dailyRewardClaimed } = useUser();

// Claim daily reward
const success = await claimDailyReward("daily_quote");
if (success) {
  toast.success("Reward claimed!");
}

// Check if already claimed
if (dailyRewardClaimed) {
  // Show already claimed state
}
```

## Testing

### Manual Testing Steps
1. **Setup:**
   - Start backend server
   - Register/login a user
   - Verify user context loads

2. **Daily Reward:**
   - Click "Collect 10 Coins" button
   - Verify coins are added to balance
   - Try clicking again - should show "already claimed"
   - Check database for DailyReward record

3. **Statistics:**
   - Verify all stats display correctly
   - Check streak calculation
   - Verify real-time updates

4. **Rewards Store:**
   - Verify coin balance displays
   - Try purchasing items
   - Verify insufficient coins handling
   - Check coin deduction

### API Testing
```bash
# Claim daily reward
curl -X POST http://localhost:5000/api/v1/rewards/daily-claim \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily_quote"}'

# Get stats
curl -X GET http://localhost:5000/api/v1/rewards/stats \
  -H "Authorization: Bearer <token>"

# Spend coins
curl -X POST http://localhost:5000/api/v1/rewards/spend \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "itemName": "Coffee Voucher", "itemId": "coffee"}'
```

## Future Enhancements

1. **Streak Bonuses:** Increase rewards for consecutive days
2. **Weekly Challenges:** Special tasks for bonus coins
3. **Leaderboards:** Compare user progress
4. **Achievement System:** Unlock badges for milestones
5. **Social Features:** Share achievements with friends