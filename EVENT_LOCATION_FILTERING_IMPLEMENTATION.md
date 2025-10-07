# Event Location-Based Filtering - Implementation Summary

## Overview
Implemented city-based filtering for events, matching the same behavior as posts. Events are now filtered by location so entities/users only see events from their city (plus global events created by admins).

## Problem
Previously, all approved events were visible to all users regardless of their location. This meant:
- Users in Mumbai saw events from Delhi, Punjab, etc.
- No location-based community segregation for events
- Inconsistent with the post filtering behavior

## Solution
Implemented location-based filtering for events that mirrors the post filtering logic:
1. **Admin events** use `location: 'global'` to be visible to everyone
2. **Regular users** see events from their city + global events
3. **Entity (NGO/Corporate) users** see events from their city + global events
4. Events are now filtered by the `location` field based on user's city

---

## 📝 Changes Made

### Backend Changes

#### 1. Event Controller (`backend/src/controllers/ngoEvent.controller.js`)

**`addEvent` Function:**
```javascript
// Admin events use 'global' as location to be visible to everyone
if (req.user.role === 'admin') {
  defaultCity = 'global';
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
  defaultCity = req.user.address?.city;
} else {
  defaultCity = req.user.city;
}
```

**`getAllPublishedEvents` Function:**
```javascript
// Build query filter based on user role
let locationFilter = null;

// Admins can see all events, others see events from their city + global events
if (req.user && req.user.role !== 'admin') {
  let userCity;
  if (req.user.role === 'user') {
    userCity = req.user.city;
  } else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    userCity = req.user.address?.city;
  }

  if (userCity) {
    locationFilter = {
      $or: [
        { location: new RegExp(`^${userCity.trim()}$`, 'i') },
        { location: 'global' }
      ]
    };
  }
}

const events = await ngoEventService.getAllPublishedEvents(locationFilter);
```

#### 2. Event Service (`backend/src/services/ngoEvent.service.js`)

**`getAllPublishedEvents` Function:**
```javascript
const getAllPublishedEvents = async (locationFilter = null) => {
  // Build the base query
  const baseQuery = { status: "approved" };
  
  // Add location filter if provided
  const query = locationFilter 
    ? { ...baseQuery, ...locationFilter }
    : baseQuery;

  console.log('Event query:', JSON.stringify(query, null, 2));

  const events = await Event.find(query)
    .populate('participants', '_id name email')
    .populate('organizationId', 'name email organizationType ...')
    .sort({ date: 1 });
  
  console.log('Events found:', events.length);
  return events;
};
```

#### 3. Event Routes (`backend/src/routes/event.routes.js`)
```javascript
// Events are now filtered by city - requires authentication
eventRouter.get("/all-event", authMiddleware, ngoEventController.getAllPublishedEvents);
```

---

## 🎯 How It Works

### Event Creation Flow:
1. User creates an event
2. Backend automatically determines location:
   - **Admin**: `location: 'global'`
   - **NGO/Corporate**: Uses `address.city` from profile
   - **Regular User**: Uses `city` from profile
3. Event is saved with the appropriate location

### Event Viewing Flow:
1. User logs in and requests events
2. Backend checks user's role and city
3. Events are filtered:
   - **Admin**: Sees all events (no filter)
   - **Others**: See events from their city + global events
4. Filtering is case-insensitive (Mumbai = mumbai = MUMBAI)

---

## 📊 Database Query Examples

### Admin Query
```javascript
{
  status: "approved"
  // No location filter - returns all approved events
}
```

### Regular User in Mumbai Query
```javascript
{
  status: "approved",
  $or: [
    { location: /^Mumbai$/i },   // Case-insensitive match for Mumbai
    { location: 'global' }       // Include global admin events
  ]
}
```

### NGO in Delhi Query
```javascript
{
  status: "approved",
  $or: [
    { location: /^Delhi$/i },    // Case-insensitive match for Delhi
    { location: 'global' }       // Include global admin events
  ]
}
```

---

## 🔍 Examples

### Example 1: Admin Creates Event
```javascript
{
  title: "National Volunteer Day",
  organization: "Admin",
  organizationId: "admin_user_id",
  location: "global",  // ← Admin events are global
  date: "2025-10-15",
  time: "10:00",
  status: "approved"
}
```

### Example 2: NGO Creates Event
```javascript
{
  title: "Beach Cleanup Drive",
  organization: "Green Earth NGO",
  organizationId: "ngo_user_id",
  location: "Mumbai",  // ← City-specific
  date: "2025-10-12",
  time: "09:00",
  status: "pending"
}
```

### Example 3: User in Mumbai Sees
- ✅ All events with `location: "Mumbai"`
- ✅ All events with `location: "global"` (admin events)
- ❌ Events from other cities (e.g., Delhi, Bangalore)

### Example 4: Admin Sees
- ✅ Events from Mumbai
- ✅ Events from Delhi
- ✅ Events from Bangalore
- ✅ Global events
- ✅ **ALL EVENTS** from all locations

---

## 💡 Benefits

1. **Location-Based Communities**: Users see relevant local events
2. **Global Announcements**: Admins can create events visible to all users
3. **Consistency**: Events now follow the same filtering logic as posts
4. **Better UX**: Users don't get overwhelmed with irrelevant events from other cities
5. **Scalability**: As the platform grows, city-based filtering helps manage content

---

## 🔐 Security & Validation

- Only users with `role: 'admin'` can create global events
- Regular users cannot manually set `location: 'global'`
- The location field is automatically determined by user role
- Users must be authenticated to view events
- Location matching is case-insensitive to prevent duplicates

---

## ⚠️ Important Notes

- Events MUST be approved by admin before being visible
- Events are filtered by both `status: "approved"` AND `location`
- Admin events bypass location filtering for viewers
- Existing events retain their original locations
- Location field is required for all events

---

## 🚀 Testing Checklist

- [ ] Admin creates event → location is set to 'global'
- [ ] NGO creates event → location is set to their address.city
- [ ] Regular user creates event → location is set to their city
- [ ] User in Mumbai sees only Mumbai + global events
- [ ] User in Delhi sees only Delhi + global events
- [ ] Admin sees all events from all locations
- [ ] Global events are visible to all users
- [ ] Case-insensitive matching works (Mumbai = MUMBAI)
- [ ] Authentication is required to fetch events
- [ ] Console logs show correct query filters

---

## 🔄 Comparison with Posts

| Feature | Posts | Events |
|---------|-------|--------|
| Location Field | `city` | `location` |
| Admin Global Value | `'global'` | `'global'` |
| Authentication Required | ✅ Yes | ✅ Yes |
| City-based Filtering | ✅ Yes | ✅ Yes |
| Admin See All | ✅ Yes | ✅ Yes |
| Case-insensitive Match | ✅ Yes | ✅ Yes |
| Status Filter | N/A | `status: 'approved'` |

---

## 📅 Implementation Date
**October 8, 2025**

## 🎉 Status
✅ **IMPLEMENTED AND READY FOR TESTING**
