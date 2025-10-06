# Admin Posts Access and Global Visibility Fix

## Issue
When accessing the community section in the admin page, the following error occurred:
```
GET /api/v1/posts?page=1&_t=1759722378882 400 250.975 ms - 61
```

Additionally, when admins create posts, they should be visible to all users regardless of their location.

## Root Cause
The `getPosts` endpoint in `post.controller.js` was filtering posts by the user's city. However, it only handled three roles:
- `user` - gets city from `req.user.city`
- `ngo` - gets city from `req.user.address.city`
- `corporate` - gets city from `req.user.address.city`

The **admin role was not handled**, causing the `userCity` variable to be `undefined`, which triggered a 400 error with the message "User city information is required to view posts".

## Solution
Implemented a two-part fix:

### 1. Admin Posts are Global
When admins create posts, they are assigned a special `city` value of `'global'` instead of a specific location.

### 2. Global Posts are Visible to Everyone
Modified the `getPosts` query to:
- Allow admins to view **all posts** from all cities
- Allow regular users to view posts from **their city + global posts (admin posts)**

## Changes Made

### Change 1: Create Post Function
**File**: `backend/src/controllers/post.controller.js` - `createPost` function

**Before**:
```javascript
// Get city from the logged-in user's profile
let city;
if (req.user.role === 'user') {
    city = req.user.city;
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    city = req.user.address?.city;
}

if (!city) {
    return res.status(400).json({ 
        message: 'User must have a city set in their profile to create posts' 
    });
}
```

**After**:
```javascript
// Get city from the logged-in user's profile
// Admin posts use 'global' as city to be visible to everyone
let city;
if (req.user.role === 'admin') {
    city = 'global';
} else if (req.user.role === 'user') {
    city = req.user.city;
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    city = req.user.address?.city;
}

if (!city) {
    return res.status(400).json({ 
        message: 'User must have a city set in their profile to create posts' 
    });
}
```

### Change 2: Get Posts Function
**File**: `backend/src/controllers/post.controller.js` - `getPosts` function

**Before**:
```javascript
// Get the user's city
let userCity;
if (req.user.role === 'user') {
    userCity = req.user.city;
} else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    userCity = req.user.address?.city;
}

if (!userCity) {
    return res.status(400).json({ 
        message: 'User city information is required to view posts' 
    });
}

// Build query object - filter by user's city (case-insensitive)
const query = { 
    city: new RegExp(`^${userCity.trim()}$`, 'i') 
};
```

**After**:
```javascript
// Build query object
const query = {};

// Admins can see all posts, others see posts from their city + global posts
if (req.user.role !== 'admin') {
    // Get the user's city
    let userCity;
    if (req.user.role === 'user') {
        userCity = req.user.city;
    } else if (req.user.role === 'ngo' || req.user.role === 'corporate') {
        userCity = req.user.address?.city;
    }

    if (!userCity) {
        return res.status(400).json({ 
            message: 'User city information is required to view posts' 
        });
    }

    // Filter by user's city OR global posts (admin posts)
    query.$or = [
        { city: new RegExp(`^${userCity.trim()}$`, 'i') },
        { city: 'global' }
    ];
    console.log('User city:', userCity);
} else {
    console.log('Admin user - showing all posts');
}
```

## Result
- ✅ Admin users can now access the community section without errors
- ✅ Admins can view all posts from all cities
- ✅ Posts created by admins are marked as 'global' and visible to everyone
- ✅ Regular users, NGOs, and corporate users see posts from their city + global admin posts
- ✅ Better logging to distinguish between admin and regular user queries

## Testing Scenarios

### Test 1: Admin Viewing Posts
1. Login as an admin user
2. Navigate to the admin page community section
3. Verify that posts are loaded successfully without 400 errors
4. Verify that all posts from all cities are visible

### Test 2: Admin Creating Posts
1. Login as an admin user
2. Create a new post
3. Verify the post is created with `city: 'global'` in the database

### Test 3: Regular Users Viewing Admin Posts
1. Login as a regular user (volunteer/NGO/corporate)
2. Navigate to the community section
3. Verify that you can see:
   - Posts from your own city
   - Posts created by admins (global posts)
4. Verify that you cannot see posts from other cities (except global posts)

### Test 4: Different Cities See Same Admin Posts
1. Create an admin post
2. Login as User A from City X
3. Login as User B from City Y
4. Verify both users can see the admin post
