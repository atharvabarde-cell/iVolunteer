# Pending Request Page - Rejection Reason Fix

## Overview
Fixed the rejection reason functionality on the `/pendingrequest` admin page to properly send rejection reasons to the backend and display them to entities.

## Implementation Date
October 8, 2025

## Issues Fixed

### Issue 1: Rejection Reason Not Sent to Backend
**Problem:** The `handleDeny` function in `admin-context.tsx` was accepting a `reason` parameter but not sending it to the backend API.

**Location:** `frontend/contexts/admin-context.tsx`

**Before:**
```typescript
const handleDeny = async (id: string, reason: string) => {
  if (!isAdmin) return;
  const token = localStorage.getItem("auth-token");
  try {
    await api.put(
      `/v1/event/status/${id}`,
      { status: "rejected" },  // ❌ Missing rejectionReason
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingEvents((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error("Failed to reject event", err);
  }
};
```

**After:**
```typescript
const handleDeny = async (id: string, reason: string) => {
  if (!isAdmin) return;
  const token = localStorage.getItem("auth-token");
  try {
    await api.put(
      `/v1/event/status/${id}`,
      { 
        status: "rejected",
        rejectionReason: reason || ""  // ✅ Now sending rejection reason
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingEvents((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error("Failed to reject event", err);
  }
};
```

### Issue 2: Incorrect Character Limit
**Problem:** The rejection textarea showed "X/10" characters but the backend expects up to 500 characters.

**Location:** `frontend/app/pendingrequest/page.tsx`

**Before:**
```tsx
<textarea
  placeholder="Please provide a reason for rejection..."
  value={denialReasons[event._id] || ""}
  onChange={(e) =>
    setDenialReasons((prev) => ({ ...prev, [event._id]: e.target.value }))
  }
  // ❌ No maxLength
  autoFocus
/>
<div className="absolute top-2 right-2">
  <span className={`text-xs ${denialReasons[event._id]?.length > 10 ? 'text-green-500' : 'text-red-400'}`}>
    {denialReasons[event._id]?.length || 0}/10  {/* ❌ Wrong limit */}
  </span>
</div>
```

**After:**
```tsx
<textarea
  placeholder="Please provide a reason for rejection (minimum 10 characters)..."
  value={denialReasons[event._id] || ""}
  onChange={(e) =>
    setDenialReasons((prev) => ({ ...prev, [event._id]: e.target.value }))
  }
  maxLength={500}  // ✅ Added 500 character limit
  autoFocus
/>
<div className="absolute top-2 right-2">
  <span className={`text-xs ${
    (denialReasons[event._id]?.length || 0) >= 10 
      ? 'text-green-500' 
      : 'text-red-400'
  }`}>
    {denialReasons[event._id]?.length || 0}/500  {/* ✅ Correct limit */}
  </span>
</div>
```

## Files Modified

### 1. `frontend/contexts/admin-context.tsx`
**Changes:**
- Updated `handleDeny` to send `rejectionReason` in the API request body
- Now properly includes the reason parameter when rejecting events

### 2. `frontend/app/pendingrequest/page.tsx`
**Changes:**
- Added `maxLength={500}` to rejection textarea
- Updated character counter from "X/10" to "X/500"
- Updated placeholder text to mention minimum 10 characters
- Fixed color logic for character counter (green when >= 10)

## Feature Flow

### 1. Admin Rejects Event
1. Admin navigates to `/pendingrequest`
2. Views pending events in table
3. Clicks "Reject Event" button
4. Inline textarea appears asking for reason

### 2. Admin Enters Reason
1. Types rejection reason (minimum 10 characters)
2. Character counter shows progress (X/500)
3. Counter turns green when >= 10 characters
4. Cannot exceed 500 characters (enforced by textarea)

### 3. Admin Submits Rejection
1. Clicks "Submit Rejection" button (disabled if < 10 chars)
2. Confirmation modal appears showing:
   - Event title
   - Entered rejection reason
   - Warning about notifying organizer
3. Admin confirms rejection

### 4. Backend Receives Rejection
1. Request sent to `PUT /api/v1/event/status/:eventId`
2. Body includes:
   ```json
   {
     "status": "rejected",
     "rejectionReason": "Event location is not properly verified..."
   }
   ```
3. Backend saves rejection reason to database

### 5. Entity Sees Rejection
1. Entity logs into their dashboard
2. Sees rejection banner with reason
3. Views event modal with full rejection reason
4. Understands why event was rejected

## Validation Rules

### Minimum Requirement
- **10 characters minimum** - ensures meaningful feedback
- Submit button disabled until requirement met
- Character counter red until >= 10 characters

### Maximum Limit
- **500 characters maximum** - consistent with backend model
- Textarea enforces limit with `maxLength={500}`
- Counter shows current/max: "X/500"

### Whitespace Handling
- Empty/whitespace-only input prevented
- Reason is trimmed before sending: `reason.trim()`
- Submit button checks: `!denialReasons[event._id]?.trim()`

## User Experience Improvements

### Visual Feedback
✅ **Character Counter**: Real-time feedback on input length
✅ **Color Coding**: Red when invalid, green when valid
✅ **Disabled State**: Submit button disabled until valid input
✅ **Placeholder Text**: Clear instructions with minimum requirement

### Error Prevention
✅ **Max Length**: Textarea prevents typing beyond 500 chars
✅ **Min Length**: Button disabled until 10 characters entered
✅ **Whitespace Check**: Trim validation prevents empty submissions
✅ **Loading State**: Prevents double submission

### Confirmation Flow
✅ **Confirmation Modal**: Shows reason before final submission
✅ **Cancel Option**: Can abort at any stage
✅ **Clear Messaging**: Explains organizer will be notified

## Testing Scenarios

### Happy Path
1. ✅ Click "Reject Event" - textarea appears
2. ✅ Type 9 characters - submit button disabled, counter red
3. ✅ Type 10th character - submit button enables, counter green
4. ✅ Click "Submit Rejection" - confirmation modal appears
5. ✅ Modal shows entered reason correctly
6. ✅ Click "Yes, Reject Event" - rejection processed
7. ✅ Event removed from pending list
8. ✅ Entity sees rejection reason in their dashboard

### Validation Tests
1. ✅ Empty input - submit button disabled
2. ✅ Whitespace only - submit button disabled
3. ✅ Exactly 10 characters - submit button enabled
4. ✅ Type 501 characters - prevented by textarea
5. ✅ Exactly 500 characters - allowed, submission works

### Edge Cases
1. ✅ Click cancel - textarea hidden, reason cleared
2. ✅ Cancel in confirmation modal - rejection aborted
3. ✅ Network error - error logged, event stays pending
4. ✅ Multiple rejections in sequence - each starts fresh

## Backend Integration

### API Endpoint
- **URL:** `PUT /api/v1/event/status/:eventId`
- **Method:** PUT
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "status": "rejected",
    "rejectionReason": "Detailed reason here..."
  }
  ```

### Event Model
```javascript
{
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, "Rejection reason cannot exceed 500 characters"]
  }
}
```

## Display Locations

### Entity Dashboard (`/entity-dashboard`)
**Banner:**
```tsx
{rejectedEvents.length > 0 && (
  <Alert variant="destructive">
    <strong>{event.title}</strong> got rejected by admin for{" "}
    <strong>{event.rejectionReason}</strong>
  </Alert>
)}
```

### Event Modal
**Alert Box:**
```tsx
{selectedEvent.status === "rejected" && (
  <Alert variant="destructive">
    <AlertTitle>Event Rejected</AlertTitle>
    <AlertDescription>
      This event was rejected by the admin.
      <div className="mt-2">
        <strong>Reason:</strong> {selectedEvent.rejectionReason}
      </div>
    </AlertDescription>
  </Alert>
)}
```

## Comparison: Two Admin Interfaces

### `/pendingrequest` Page
- **Style:** Inline textarea in table row
- **Flow:** Click Reject → Textarea appears → Type → Submit → Confirm
- **Character Limit:** 10 minimum, 500 maximum
- **Visual:** Minimal, integrated into table
- **Context:** admin-context.tsx

### `/admin` Page (Modal Dialog)
- **Style:** Modal dialog overlay
- **Flow:** Click Reject → Modal opens → Type → Submit
- **Character Limit:** Required field, 500 maximum
- **Visual:** Full modal with dialog components
- **Context:** events-context.tsx

**Both now properly send rejection reasons to backend!**

## Success Criteria

### Feature Complete When:
✅ Admin can enter rejection reason on `/pendingrequest`
✅ Rejection reason sent to backend API
✅ Rejection reason saved to database
✅ Entity sees rejection reason in dashboard banner
✅ Entity sees rejection reason in event modal
✅ Validation enforces 10-500 character range
✅ Character counter shows correct limit (500)
✅ Submit button disabled until valid input
✅ Confirmation modal shows entered reason
✅ No console errors
✅ No TypeScript errors

## Related Documentation

- **`EVENT_REJECTION_REASON_COMPLETE_IMPLEMENTATION.md`** - Full feature overview
- **`ADMIN_REJECTION_REASON_INPUT.md`** - `/admin` page dialog implementation
- **`REJECTION_REASON_DEBUG_GUIDE.md`** - Debugging instructions
- **`EVENT_REJECTION_REASON_FEATURE.md`** - Backend implementation

## Key Takeaway

The `/pendingrequest` page already had a great UI for entering rejection reasons, but the backend integration was broken. This fix ensures that the reason entered by the admin is actually sent to and saved in the database, completing the rejection reason workflow for this admin interface.

**Before Fix:** Admin enters reason → Reason discarded → Entity sees no reason ❌

**After Fix:** Admin enters reason → Reason sent to backend → Entity sees reason ✅
