# Post "Edited" Label Fix

## Problem
Posts were showing "(edited)" label even when they were just created and never modified.

## Root Cause
The Post model had a `pre('save')` middleware that updated `updatedAt` **every time** the document was saved, including on initial creation:

```javascript
// Old code - WRONG
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // This runs even for new posts!
    next();
});
```

This meant:
- New post created → `createdAt` set to `2025-10-05 10:00:00`
- Pre-save hook runs → `updatedAt` set to `2025-10-05 10:00:00.003` (3ms later)
- Frontend compares → `updatedAt !== createdAt` → Shows "(edited)" ❌

## Solution

### 1. Backend Model Fix (`backend/src/models/Post.js`)

**Changed:**
- Removed default value for `updatedAt`
- Modified pre-save hook to only set `updatedAt` for existing documents:

```javascript
updatedAt: {
    type: Date  // No default value
}

// Update the updatedAt timestamp only when modifying existing posts
postSchema.pre('save', function(next) {
    // Only set updatedAt if this is not a new document
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});
```

### 2. Frontend Comparison Fix (`frontend/components/post-display.tsx`)

**Improved the comparison logic:**
```typescript
// Old code
{post.updatedAt !== post.createdAt && (
    <span className="ml-1 text-amber-600 font-medium">(edited)</span>
)}

// New code - Better
{post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime() && (
    <span className="ml-1 text-amber-600 font-medium">(edited)</span>
)}
```

Changes:
- ✅ Check if `updatedAt` exists (undefined for new posts)
- ✅ Compare timestamps as numbers for accuracy
- ✅ Only show "(edited)" if times are actually different

### 3. Database Cleanup Script (`backend/fix-post-timestamps.js`)

Created script to fix existing posts in the database:
- Finds posts where `updatedAt` is within 1 second of `createdAt`
- Removes the `updatedAt` field for these posts
- Ran successfully and fixed 1 post

## How It Works Now

### Creating a New Post:
1. Post is created with `createdAt` set to current time
2. Pre-save hook checks `this.isNew` → **true**
3. `updatedAt` is **NOT** set → remains `undefined`
4. Frontend checks `post.updatedAt` → **undefined** → No "(edited)" label ✅

### Editing an Existing Post:
1. Post is modified and saved
2. Pre-save hook checks `this.isNew` → **false**
3. `updatedAt` is set to current time
4. Frontend compares timestamps → different → Shows "(edited)" label ✅

## Testing

### Test Case 1: New Post
```
✅ Create a new post
✅ Should NOT show "(edited)" label
```

### Test Case 2: Edited Post
```
✅ Create a new post
✅ Edit the post (change title/description)
✅ Should show "(edited)" label
```

## Files Changed

1. `backend/src/models/Post.js` - Fixed pre-save hook
2. `frontend/components/post-display.tsx` - Improved comparison logic
3. `backend/fix-post-timestamps.js` - Database cleanup script (run once)

## Result

✅ New posts no longer show "(edited)" label
✅ Actually edited posts correctly show "(edited)" label
✅ Existing posts in database were cleaned up
