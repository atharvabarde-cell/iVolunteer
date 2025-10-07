# Event vs Post Location Filtering - Side-by-Side Comparison

## Overview
Events now follow the same location-based filtering logic as posts.

---

## 🔄 How They Work (Identical Logic)

### Posts
```javascript
// Creating a post
let city;
if (req.user.role === 'admin') {
  city = 'global';  // Admin posts are global
} else if (req.user.role === 'user') {
  city = req.user.city;
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
  city = req.user.address?.city;
}

// Fetching posts
if (req.user.role !== 'admin') {
  query.$or = [
    { city: new RegExp(`^${userCity.trim()}$`, 'i') },
    { city: 'global' }
  ];
}
```

### Events (NEW - Now matches posts!)
```javascript
// Creating an event
let defaultCity;
if (req.user.role === 'admin') {
  defaultCity = 'global';  // Admin events are global
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
  defaultCity = req.user.address?.city;
} else {
  defaultCity = req.user.city;
}

// Fetching events
if (req.user.role !== 'admin') {
  locationFilter = {
    $or: [
      { location: new RegExp(`^${userCity.trim()}$`, 'i') },
      { location: 'global' }
    ]
  };
}
```

---

## 📊 Field Names

| Feature | Posts | Events |
|---------|-------|--------|
| Location Field Name | `city` | `location` |
| Admin Global Value | `'global'` | `'global'` |

---

## 🎯 User Experience

### Regular User in Mumbai

**Posts Visible:**
- ✅ Posts with `city: "Mumbai"`
- ✅ Posts with `city: "global"` (admin posts)
- ❌ Posts from other cities

**Events Visible:**
- ✅ Events with `location: "Mumbai"`
- ✅ Events with `location: "global"` (admin events)
- ❌ Events from other cities

### NGO in Delhi

**Posts Visible:**
- ✅ Posts with `city: "Delhi"`
- ✅ Posts with `city: "global"` (admin posts)
- ❌ Posts from other cities

**Events Visible:**
- ✅ Events with `location: "Delhi"`
- ✅ Events with `location: "global"` (admin events)
- ❌ Events from other cities

### Admin

**Posts Visible:**
- ✅ ALL posts from ALL cities

**Events Visible:**
- ✅ ALL events from ALL locations

---

## 🔐 Authentication

Both require authentication to view:

**Posts:**
```javascript
postRouter.get('/', authMiddleware, getPosts);
```

**Events:**
```javascript
eventRouter.get("/all-event", authMiddleware, getAllPublishedEvents);
```

---

## 🎨 Examples

### Admin Creates Content

**Post:**
```json
{
  "user": "admin_id",
  "title": "Important Announcement",
  "city": "global",
  "createdAt": "2025-10-08"
}
```

**Event:**
```json
{
  "organizationId": "admin_id",
  "title": "National Volunteer Day",
  "location": "global",
  "status": "approved",
  "date": "2025-10-15"
}
```

### NGO in Mumbai Creates Content

**Post:**
```json
{
  "user": "ngo_id",
  "title": "Community Initiative",
  "city": "Mumbai",
  "createdAt": "2025-10-08"
}
```

**Event:**
```json
{
  "organizationId": "ngo_id",
  "title": "Beach Cleanup",
  "location": "Mumbai",
  "status": "pending",
  "date": "2025-10-12"
}
```

---

## 🔍 Database Queries

### User in Mumbai Fetching Posts
```javascript
{
  $or: [
    { city: /^Mumbai$/i },
    { city: 'global' }
  ]
}
```

### User in Mumbai Fetching Events
```javascript
{
  status: "approved",
  $or: [
    { location: /^Mumbai$/i },
    { location: 'global' }
  ]
}
```

### Admin Fetching Posts
```javascript
{
  // No filter - returns all posts
}
```

### Admin Fetching Events
```javascript
{
  status: "approved"
  // No location filter - returns all approved events
}
```

---

## ✅ Consistency Achieved

Both posts and events now:
1. ✅ Filter by user's location (city)
2. ✅ Allow admin to create global content
3. ✅ Show global content to all users
4. ✅ Use case-insensitive matching
5. ✅ Require authentication to view
6. ✅ Admin users see all content

---

## 🚀 Benefits

1. **Consistent User Experience**: Events and posts work the same way
2. **Location-Based Communities**: Users see relevant local content
3. **Global Announcements**: Admins can reach everyone
4. **Better Performance**: Queries are filtered and indexed
5. **Scalability**: As platform grows, location filtering helps manage content

---

## 📅 Implementation Date
**October 8, 2025**
