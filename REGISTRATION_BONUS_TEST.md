# Registration Bonus Testing

## Test the registration bonus functionality

### ✅ Issues Fixed:
1. **Total coins calculation**: Registration bonus now included in total coins earned
2. **Toast notification**: Welcome bonus message now displays properly after registration
3. **Backend response**: Login endpoint now returns current coin balance

### Backend Testing:
Test the registration endpoint directly:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "userId": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user",
    "coins": 50
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User registered successfully! You've been awarded 50 coins as a welcome bonus!"
}
```

### Reward Stats Testing:
Test that total coins earned includes registration bonus:

```bash
curl -X GET http://localhost:5000/api/v1/rewards/stats \
  -H "Authorization: Bearer <access_token>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "activeCoins": 50,
    "totalCoinsEarned": 50,
    "totalSpent": 0,
    "points": 0,
    "badges": 0,
    "streak": "1 days",
    "streakCount": 1,
    "volunteeredHours": 0
  }
}
```

### Frontend Testing:
1. Open the signup form
2. Register a new user
3. Check for toast notification: "🎉 Welcome to iVolunteer! You've been awarded 50 coins as a welcome bonus!"
4. Verify user dashboard shows:
   - Active Coins: 50
   - Total Coins Earned: 50
   - Welcome bonus message in toast

### Database Verification:
Check MongoDB collections:
1. `users` collection should show the new user with `coins: 50`
2. `registrationrewards` collection should have a record for the new user

### Automated Testing:
Run the test script:
```bash
node test-registration-bonus.mjs
```

### Troubleshooting:
If not working, check:
1. Backend server is running
2. MongoDB is connected
3. No console errors in browser dev tools
4. Network tab shows successful API calls
5. Check server logs for registration bonus logging