# Show All Posts/Events Filter Feature - Implementation Summary

## Overview
Added an optional "Show All" toggle button that allows users to view all posts and events from all locations, bypassing the city-based filtering.

## Problem
Users could only see posts/events from their city + global items. Sometimes users want to explore content from other cities as well.

## Solution
Implemented a toggle button on both Posts and Events pages that:
1. **By default**: Shows filtered view (user's city + global)
2. **When toggled ON**: Shows all content from all locations
3. **Admin users**: Always see all content (no toggle needed)

---

## 📝 Changes Made

### Backend Changes

#### 1. Post Controller (`backend/src/controllers/post.controller.js`)

**Added `showAll` query parameter:**
```javascript
const { category, showAll } = req.query;
const shouldShowAll = showAll === 'true';

// Only apply city filter if user is not admin AND not requesting showAll
if (req.user.role !== 'admin' && !shouldShowAll) {
  // Apply city-based filtering
  query.$or = [
    { city: new RegExp(`^${userCity.trim()}$`, 'i') },
    { city: 'global' }
  ];
  console.log('Filtered view - showing local + global posts');
} else {
  console.log(shouldShowAll ? 'Show all requested - showing all posts' : 'Admin user - showing all posts');
}
```

#### 2. Event Controller (`backend/src/controllers/ngoEvent.controller.js`)

**Added `showAll` query parameter:**
```javascript
const shouldShowAll = req.query.showAll === 'true';

// Only apply location filter if user is not admin AND not requesting showAll
if (req.user && req.user.role !== 'admin' && !shouldShowAll) {
  // Apply location-based filtering
  locationFilter = {
    $or: [
      { location: new RegExp(`^${userCity.trim()}$`, 'i') },
      { location: 'global' }
    ]
  };
  console.log('Filtered view - showing local + global events');
} else {
  console.log(shouldShowAll ? 'Show all requested - showing all events' : 'Admin user - showing all events');
}
```

---

### Frontend Changes

#### 3. Post Context (`frontend/contexts/post-context.tsx`)

**Updated interface:**
```typescript
interface PostContextType {
  getPosts: (page?: number, showAll?: boolean) => Promise<...>;
  // ... other methods
}
```

**Updated getPosts function:**
```typescript
const getPosts = async (page = 1, showAll = false) => {
  const showAllParam = showAll ? '&showAll=true' : '';
  const response = await api.get(`/v1/posts?page=${page}${showAllParam}`);
  // ...
};
```

#### 4. NGO Context (`frontend/contexts/ngo-context.tsx`)

**Updated interface:**
```typescript
type NGOContextType = {
  fetchAvailableEvents: (showAll?: boolean) => Promise<void>;
  // ... other methods
};
```

**Updated fetchAvailableEvents function:**
```typescript
const fetchAvailableEvents = async (showAll = false) => {
  const showAllParam = showAll ? '?showAll=true' : '';
  const res = await api.get(`/v1/event/all-event${showAllParam}`, ...);
  // ...
};
```

#### 5. Posts Page UI (`frontend/app/posts/page.tsx`)

**Added state:**
```typescript
const [showAllPosts, setShowAllPosts] = useState(false);
```

**Added toggle button (for non-admin users only):**
```tsx
{activeTab === 'posts' && user && user.role !== 'admin' && (
  <Button
    variant={showAllPosts ? "default" : "outline"}
    size="sm"
    onClick={toggleShowAll}
    className={`flex items-center gap-2 transition-all duration-300 ${
      showAllPosts 
        ? 'bg-gradient-to-r from-primary to-emerald-600 text-white ...' 
        : 'bg-white/80 backdrop-blur-sm border-primary/20 ...'
    }`}
  >
    <Globe className="w-4 h-4" />
    {showAllPosts ? 'Showing All Posts' : 'Show All Posts'}
  </Button>
)}
```

**Updated useEffect to reload when toggle changes:**
```typescript
useEffect(() => {
  if (activeTab === 'posts') {
    loadPosts();
  }
}, [activeTab, showAllPosts]);
```

#### 6. Events Page UI (`frontend/app/volunteer/page.tsx`)

**Added state:**
```typescript
const [showAllEvents, setShowAllEvents] = useState(false);
```

**Added toggle button (for non-admin users only):**
```tsx
{user && user.role !== 'admin' && (
  <Button
    variant={showAllEvents ? "default" : "outline"}
    size="sm"
    onClick={toggleShowAll}
    className={`flex items-center gap-2 transition-all duration-300 ${
      showAllEvents 
        ? 'bg-gradient-to-r from-primary to-emerald-600 text-white ...' 
        : 'bg-white/80 backdrop-blur-sm border-primary/20 ...'
    }`}
  >
    <Globe className="w-4 h-4" />
    {showAllEvents ? 'Showing All Events' : 'Show All Events'}
  </Button>
)}
```

**Updated useEffect to reload when toggle changes:**
```typescript
useEffect(() => {
  fetchAvailableEvents(showAllEvents);
}, [showAllEvents]);
```

---

## 🎯 How It Works

### Default Behavior (Filtered View)
1. User opens Posts/Events page
2. `showAll = false` by default
3. Backend applies city-based filtering
4. User sees only content from their city + global content

### With "Show All" Enabled
1. User clicks "Show All Posts/Events" button
2. `showAll = true` 
3. Request sent with `?showAll=true` parameter
4. Backend skips city-based filtering
5. User sees ALL content from ALL locations

### Admin Behavior
- Admin users always see all content
- No toggle button shown (not needed)
- No filtering applied regardless of parameters

---

## 🎨 UI Design

### Toggle Button States

**Inactive (Filtered View):**
- Outlined button style
- White background with primary border
- Text: "Show All Posts" / "Show All Events"
- Globe icon (outline)

**Active (Showing All):**
- Filled gradient button
- Primary to emerald gradient background
- White text
- Text: "Showing All Posts" / "Showing All Events"
- Globe icon (filled)

**Button Location:**
- Positioned next to the Refresh button
- Only visible to authenticated non-admin users
- Hidden for admin users (they always see all)

---

## 📊 API Examples

### Posts API Calls

**Filtered View:**
```
GET /api/v1/posts?page=1
```

**Show All View:**
```
GET /api/v1/posts?page=1&showAll=true
```

### Events API Calls

**Filtered View:**
```
GET /api/v1/event/all-event
```

**Show All View:**
```
GET /api/v1/event/all-event?showAll=true
```

---

## 🔍 User Scenarios

### Scenario 1: Volunteer in Mumbai (Filtered View)
```
showAll = false
→ Sees: Mumbai posts + global posts
→ Doesn't see: Delhi posts, Pune posts, etc.
```

### Scenario 2: Volunteer in Mumbai (Show All)
```
showAll = true
→ Sees: ALL posts from ALL cities
→ Mumbai, Delhi, Pune, Bangalore, global, etc.
```

### Scenario 3: NGO in Delhi (Filtered View)
```
showAll = false
→ Sees: Delhi events + global events
→ Doesn't see: Mumbai events, Kolkata events, etc.
```

### Scenario 4: NGO in Delhi (Show All)
```
showAll = true
→ Sees: ALL events from ALL locations
→ Delhi, Mumbai, Kolkata, Chennai, global, etc.
```

### Scenario 5: Admin User
```
→ Always sees ALL content
→ No toggle button shown
→ Both `showAll=false` and `showAll=true` return all content
```

---

## 💡 Benefits

1. **User Choice**: Users can choose between focused local content or exploring all content
2. **Discovery**: Helps users discover interesting content from other cities
3. **Flexibility**: Doesn't force users into one view or the other
4. **Default Smart**: Defaults to filtered view for better relevance
5. **Simple Toggle**: One-click switch between views
6. **Persistent Admin View**: Admins always see everything (no confusion)

---

## 🔐 Security & Validation

- ✅ Authentication still required for both views
- ✅ Admin users bypass filter automatically
- ✅ Toggle only affects filtering, not access control
- ✅ No way to access restricted content
- ✅ Backend validates user authentication before applying any filters

---

## ⚠️ Important Notes

- Toggle button is **ONLY visible to non-admin authenticated users**
- Admin users **ALWAYS see all content** (no toggle needed)
- Default state is **filtered view** (showAll = false)
- Toggle state **persists during session** but resets on page reload
- Changing toggle **immediately reloads** data
- Works with **all other filters** (category, time, search)

---

## 🧪 Testing Checklist

### Posts Page
- [ ] Non-admin user sees toggle button
- [ ] Admin user does NOT see toggle button
- [ ] Unauthenticated user does NOT see toggle button
- [ ] Default shows filtered posts (user's city + global)
- [ ] Clicking toggle shows all posts from all cities
- [ ] Toggle state persists while navigating within page
- [ ] Category/time/search filters work with both toggle states
- [ ] Button shows correct text ("Show All" vs "Showing All")
- [ ] Button shows correct styling (outline vs filled)

### Events Page
- [ ] Non-admin user sees toggle button
- [ ] Admin user does NOT see toggle button
- [ ] Unauthenticated user does NOT see toggle button
- [ ] Default shows filtered events (user's city + global)
- [ ] Clicking toggle shows all events from all locations
- [ ] Toggle state persists while switching event type tabs
- [ ] Button shows correct text ("Show All" vs "Showing All")
- [ ] Button shows correct styling (outline vs filled)

### Backend
- [ ] `showAll=true` returns all posts/events
- [ ] `showAll=false` applies city filtering
- [ ] Admin users see all content regardless of showAll
- [ ] Console logs show correct filtering mode
- [ ] Query performance is acceptable

---

## 📅 Implementation Date
**October 8, 2025**

## 🎉 Status
✅ **IMPLEMENTED AND READY FOR TESTING**

---

## Files Modified

### Backend:
- `backend/src/controllers/post.controller.js`
- `backend/src/controllers/ngoEvent.controller.js`

### Frontend:
- `frontend/contexts/post-context.tsx`
- `frontend/contexts/ngo-context.tsx`
- `frontend/app/posts/page.tsx`
- `frontend/app/volunteer/page.tsx`

### Documentation:
- `SHOW_ALL_FILTER_FEATURE.md` (this file)
