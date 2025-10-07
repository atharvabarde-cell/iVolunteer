# Troubleshooting: Event Image and Time Display Issues

## Issue
Event image and AM/PM time format not showing in event detail page.

## Root Causes Identified

### 1. Time Display Issue
**Problem**: The `event.time` field stores time as a string in 24-hour format (e.g., "14:30"), but the code was just displaying it as-is without converting to 12-hour format with AM/PM.

**Solution Applied**: Added conversion logic to transform 24-hour time string to 12-hour format with AM/PM.

### 2. Image Not Saving
**Problem**: The backend service wasn't extracting the `image` field from the request data when creating events.

**Solution Applied**: Updated `createEvent` function in `ngoEvent.service.js` to include the `image` field.

## Changes Made

### Backend Fix

#### File: `backend/src/services/ngoEvent.service.js`

**Before**:
```javascript
const createEvent = async (data, organizationId, organizationName) => {
  let {
    title,
    description,
    // ... other fields
    eventType = "community",
    images = [],  // Only images array, no single image
  } = data;

  const event = new Event({
    // ... fields
    images,  // Only images array
    status: "pending"
  });
```

**After**:
```javascript
const createEvent = async (data, organizationId, organizationName) => {
  let {
    title,
    description,
    // ... other fields
    eventType = "community",
    image,        // Added single image field
    images = [],
  } = data;

  const event = new Event({
    // ... fields
    image,        // Added to event creation
    images,
    status: "pending"
  });
```

### Frontend Fix

#### File: `frontend/app/volunteer/[eventId]/page.tsx`

**Before** (time display):
```typescript
{event.time || (event.date ? new Date(event.date).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}) : "Time not specified")}
```
This would display `event.time` as-is (e.g., "14:30") if it exists, without AM/PM conversion.

**After** (time display):
```typescript
{event.time ? (() => {
  // Convert 24-hour format time string (e.g., "14:30") to 12-hour with AM/PM
  const [hours, minutes] = event.time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
})() : (event.date ? new Date(event.date).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}) : "Time not specified")}
```

**Added Debug Logging**:
```typescript
console.log('Event image:', responseData.event.image);
console.log('Event time:', responseData.event.time);
```

## Testing Steps

### 1. Test Existing Events

Open browser console and navigate to an event detail page. Check the console logs:

```javascript
// You should see:
Event fetched successfully: {...}
Event image: { url: "...", caption: "...", publicId: "..." }  // or undefined
Event time: "14:30"  // or whatever time format
```

**If image is undefined**: The event was created before the fix. Create a new event with an image.

### 2. Test New Event Creation

1. Go to Create Event page
2. Fill out all fields
3. Upload an image
4. Click "Upload Image" button (wait for success badge)
5. Submit the form
6. Navigate to the created event's detail page
7. Check:
   - ✅ Image should be visible at the top
   - ✅ Time should show with AM/PM (e.g., "2:30 PM")

### 3. Test Time Conversion

Different time inputs and expected outputs:

| Input Time | Expected Display |
|------------|------------------|
| "09:30"    | "9:30 AM"        |
| "12:00"    | "12:00 PM"       |
| "14:30"    | "2:30 PM"        |
| "00:00"    | "12:00 AM"       |
| "23:45"    | "11:45 PM"       |

## Common Issues & Solutions

### Issue 1: Image Still Not Showing

**Possible Causes**:
1. Event was created before the backend fix
2. Image wasn't uploaded before form submission
3. Cloudinary upload failed

**Solution**:
- Create a new event with an image after deploying the fix
- Check browser console for upload errors
- Verify Cloudinary credentials in backend

### Issue 2: Time Shows as "Time not specified"

**Possible Causes**:
1. `event.time` field is null/undefined
2. `event.date` field is also missing

**Solution**:
- Ensure time is being saved when creating event
- Check form validation in create event page
- Verify backend is accepting the `time` field

### Issue 3: Time Conversion Error

**Possible Causes**:
1. Time format is different than expected (not "HH:MM")
2. Invalid time string

**Solution**:
- Add validation in the time conversion logic
- Add try-catch around the conversion:

```typescript
{event.time ? (() => {
  try {
    const [hours, minutes] = event.time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return event.time;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (e) {
    return event.time; // Fallback to original
  }
})() : "Time not specified"}
```

## Verification Checklist

After deploying:

- [ ] Backend service includes `image` field in createEvent
- [ ] Event model has `image` field with url, caption, publicId
- [ ] Upload endpoint `/v1/event/upload-event-image` is working
- [ ] Frontend upload UI shows preview correctly
- [ ] Upload button uploads to Cloudinary successfully
- [ ] Form submission includes image data
- [ ] Event detail page displays uploaded image
- [ ] Time converts from 24-hour to 12-hour format with AM/PM
- [ ] Console logs show correct image and time data

## Database Check

If you have existing events without images, you can verify the schema:

```javascript
// In MongoDB shell or Compass
db.events.findOne({}, { image: 1, time: 1, _id: 1 })

// Expected output:
{
  "_id": "...",
  "time": "14:30",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "caption": "Event Image",
    "publicId": "iVolunteer_events/event_..."
  }
}
```

## Quick Fix Checklist

If image or time still not working:

1. **Clear browser cache** - Ctrl+Shift+Delete
2. **Hard refresh** - Ctrl+F5
3. **Check console** - F12 → Console tab
4. **Restart backend server** - Ensure latest code is running
5. **Create new test event** - Don't rely on old events
6. **Verify upload** - Check Cloudinary dashboard for uploaded images
7. **Check network tab** - Verify API responses include image data

## Expected Behavior

### With Image:
- Image displays at top of event detail page (1200x630px optimized)
- Event title overlaid on image with gradient
- Image caption in alt text

### Without Image:
- Gradient background (blue to purple)
- Icon placeholder
- Event title and organization name centered

### Time Display:
- Always shows 12-hour format
- Always includes AM/PM
- Properly handles midnight (12:00 AM) and noon (12:00 PM)
- Single-digit hours don't have leading zero (e.g., "9:30 AM" not "09:30 AM")

## File Reference

Files modified to fix these issues:

1. `backend/src/services/ngoEvent.service.js` - Added image field extraction
2. `frontend/app/volunteer/[eventId]/page.tsx` - Fixed time conversion and added debug logs
3. `backend/src/models/Event.js` - Added image field schema (already done)
4. `backend/src/controllers/ngoEvent.controller.js` - Added uploadEventImage (already done)
5. `backend/src/routes/event.routes.js` - Added upload route (already done)
6. `frontend/app/add-event/page.tsx` - Image upload UI (already done)
