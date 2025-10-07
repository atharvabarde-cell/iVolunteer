# Event Location Filtering - Quick Testing Guide

## What Was Changed?

### Backend Changes:
1. ✅ **Event Controller** - Added city-based filtering logic to `getAllPublishedEvents`
2. ✅ **Event Service** - Updated to accept location filter parameter
3. ✅ **Event Routes** - Added authentication middleware to `/all-event` route
4. ✅ **Event Creation** - Admin events now use `location: 'global'`

### Frontend Changes:
1. ✅ **Events Context** - Updated to pass authentication token when fetching events

---

## Testing Steps

### 1. Start Backend
```powershell
cd backend
npm run dev
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```

### 3. Test Scenarios

#### Scenario A: Regular User (Volunteer)
1. Login as a regular user with city "Mumbai" (e.g., vol@gmail.com)
2. Navigate to events page
3. ✅ Should see only events with `location: "Mumbai"` or `location: "global"`
4. ❌ Should NOT see events from other cities

#### Scenario B: NGO/Corporate Entity
1. Login as NGO/Corporate with `address.city: "Delhi"`
2. Navigate to events page
3. ✅ Should see only events with `location: "Delhi"` or `location: "global"`
4. ❌ Should NOT see events from other cities

#### Scenario C: Admin User
1. Login as admin
2. Navigate to events page
3. ✅ Should see ALL events from ALL locations

#### Scenario D: Create Event as Admin
1. Login as admin
2. Create a new event
3. Check database - event should have `location: "global"`
4. Verify all users can see this event

#### Scenario E: Create Event as NGO
1. Login as NGO (e.g., with city "Mumbai")
2. Create a new event
3. Check database - event should have `location: "Mumbai"`
4. Only Mumbai users (+ admin) should see this event

---

## Database Queries to Verify

### Check Event Locations
```javascript
// In MongoDB
db.events.find({ status: "approved" }).forEach(e => {
  print(`Event: ${e.title} | Location: ${e.location} | Org: ${e.organization}`)
})
```

### Check User Cities
```javascript
// In MongoDB
db.users.find({}).forEach(u => {
  const city = u.role === 'user' ? u.city : u.address?.city
  print(`User: ${u.name} | Role: ${u.role} | City: ${city}`)
})
```

---

## Expected Backend Logs

When a user fetches events, you should see:
```
User city for events: Mumbai
Event query: {
  "status": "approved",
  "$or": [
    { "location": /^Mumbai$/i },
    { "location": "global" }
  ]
}
Events found: 3
```

When admin fetches events:
```
Admin user - showing all events
Event query: {
  "status": "approved"
}
Events found: 10
```

---

## Common Issues & Solutions

### Issue 1: Events not showing up
**Solution**: Check if events are approved (`status: "approved"`)

### Issue 2: User sees all events regardless of city
**Solution**: 
- Verify authentication token is being sent
- Check user has city in their profile
- Check backend logs for query filter

### Issue 3: Admin events not visible to everyone
**Solution**: Ensure admin events have `location: "global"`

### Issue 4: 401 Unauthorized error
**Solution**: Route now requires authentication - ensure user is logged in

---

## Files Modified

### Backend:
- `backend/src/controllers/ngoEvent.controller.js`
- `backend/src/services/ngoEvent.service.js`
- `backend/src/routes/event.routes.js`

### Frontend:
- `frontend/contexts/events-context.tsx`

### Documentation:
- `EVENT_LOCATION_FILTERING_IMPLEMENTATION.md` (detailed)
- `EVENT_LOCATION_FILTERING_TESTING_GUIDE.md` (this file)

---

## Next Steps After Testing

1. Test all scenarios above
2. Verify no breaking changes for existing functionality
3. Check console logs match expected output
4. Ensure event participation still works
5. Test event creation for all user roles
6. Verify event details page loads correctly

---

## Rollback (If Needed)

If you need to rollback these changes:
```powershell
git diff HEAD
git checkout -- backend/src/controllers/ngoEvent.controller.js
git checkout -- backend/src/services/ngoEvent.service.js
git checkout -- backend/src/routes/event.routes.js
git checkout -- frontend/contexts/events-context.tsx
```

---

## Success Criteria

✅ Events are filtered by user's city (just like posts)
✅ Admin events are global and visible to everyone
✅ Admin users can see all events
✅ No 401/400 errors when fetching events
✅ Event creation works for all user roles
✅ Existing functionality is not broken
