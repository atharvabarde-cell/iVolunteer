# Event Update & Delete API Endpoints Fix

## Issue Description
When trying to update or delete events from the frontend modal, the API calls were returning 404 errors:
- `PUT /api/v1/event/:eventId` - 404 Not Found
- `DELETE /api/v1/event/:eventId` - 404 Not Found

## Root Cause
The backend was missing the PUT and DELETE route handlers for updating and deleting individual events. While the backend had routes for:
- Creating events (`POST /add-event`)
- Getting events (`GET /organization`, `GET /:eventId`)
- Admin status updates (`PUT /status/:eventId`)

It was missing routes for organization owners to update or delete their own events.

## Solution Implemented

### 1. Added Controller Methods

**File**: `backend/src/controllers/ngoEvent.controller.js`

#### Update Event Method
```javascript
const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  // Find the event
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if the user is the owner of the event
  if (event.organizationId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this event");
  }

  // Update the event with new data
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    event: updatedEvent,
  });
});
```

**Features**:
- ✅ Validates event exists
- ✅ Checks user authorization (must be event owner)
- ✅ Updates event with request body data
- ✅ Runs schema validators
- ✅ Returns updated event object

#### Delete Event Method
```javascript
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  // Find the event
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if the user is the owner of the event
  if (event.organizationId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  // Delete the event
  await Event.findByIdAndDelete(eventId);

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});
```

**Features**:
- ✅ Validates event exists
- ✅ Checks user authorization (must be event owner)
- ✅ Deletes event from database
- ✅ Returns success confirmation

#### Exported Controllers
```javascript
export const ngoEventController = {
  // ... existing methods
  updateEvent,
  deleteEvent,
};
```

### 2. Added Route Definitions

**File**: `backend/src/routes/event.routes.js`

```javascript
// Update event (for organization owners)
eventRouter.put("/:eventId", authMiddleware, ngoEventController.updateEvent);

// Delete event (for organization owners)
eventRouter.delete("/:eventId", authMiddleware, ngoEventController.deleteEvent);
```

**Route Details**:
- **Path**: `/:eventId` - Uses event ID as URL parameter
- **Middleware**: `authMiddleware` - Requires authentication
- **Position**: After GET `/:eventId` route, before participation routes
- **Methods**: PUT for updates, DELETE for deletions

## Security & Authorization

### Authentication
- Both routes protected by `authMiddleware`
- Requires valid JWT token in Authorization header
- Token must contain valid user ID

### Authorization
- Only event owner can update/delete
- Ownership verified by comparing `event.organizationId` with `req.user._id`
- Returns 403 Forbidden if user is not the owner

### Validation
- Event existence checked before operations
- Returns 404 Not Found if event doesn't exist
- Update method runs Mongoose schema validators
- Prevents unauthorized modifications

## API Endpoints

### Update Event
```
PUT /api/v1/event/:eventId
Headers:
  Authorization: Bearer <token>
Body: {
  title?: string,
  description?: string,
  location?: string,
  detailedAddress?: string,
  date?: string,
  time?: string,
  duration?: number,
  category?: string,
  maxParticipants?: number,
  pointsOffered?: number,
  sponsorshipRequired?: boolean,
  sponsorshipAmount?: number,
  eventType?: string
}
Response 200: {
  success: true,
  message: "Event updated successfully",
  event: <updated event object>
}
Response 403: {
  success: false,
  message: "You are not authorized to update this event"
}
Response 404: {
  success: false,
  message: "Event not found"
}
```

### Delete Event
```
DELETE /api/v1/event/:eventId
Headers:
  Authorization: Bearer <token>
Response 200: {
  success: true,
  message: "Event deleted successfully"
}
Response 403: {
  success: false,
  message: "You are not authorized to delete this event"
}
Response 404: {
  success: false,
  message: "Event not found"
}
```

## Frontend Integration

The frontend components already have the correct API calls:

**Update Event** (`Ngoeventtable.tsx`):
```typescript
await api.put(`/v1/event/${editedEvent._id}`, updateData, {
  headers: { Authorization: `Bearer ${token}` },
});
```

**Delete Event** (`Ngoeventtable.tsx`):
```typescript
await api.delete(`/v1/event/${selectedEvent._id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

These will now work correctly with the new backend routes!

## Testing Checklist

### Update Event
- [x] Backend controller method created
- [x] Backend route registered
- [x] Authentication required
- [x] Authorization check (owner only)
- [x] Event existence validation
- [x] Schema validation on update
- [x] Returns updated event object
- [ ] Frontend successfully updates event
- [ ] Toast notification appears
- [ ] Event list refreshes with new data

### Delete Event
- [x] Backend controller method created
- [x] Backend route registered
- [x] Authentication required
- [x] Authorization check (owner only)
- [x] Event existence validation
- [x] Event removed from database
- [x] Returns success message
- [ ] Frontend successfully deletes event
- [ ] Toast notification appears
- [ ] Event removed from list
- [ ] Modal closes automatically

### Security Tests
- [ ] Unauthorized user cannot update event (403)
- [ ] Unauthorized user cannot delete event (403)
- [ ] Non-existent event returns 404
- [ ] Missing auth token returns 401
- [ ] Invalid event ID returns 400/404

## Error Handling

### Client Errors (4xx)
- **400 Bad Request**: Invalid event ID format
- **401 Unauthorized**: Missing or invalid auth token
- **403 Forbidden**: User is not the event owner
- **404 Not Found**: Event doesn't exist

### Server Errors (5xx)
- **500 Internal Server Error**: Database connection issues, unexpected errors
- Handled by `asyncHandler` wrapper
- Errors logged for debugging

## Impact on Existing Features

### No Breaking Changes
- Existing routes remain unchanged
- Admin routes still work (`PUT /status/:eventId`)
- Event creation still works (`POST /add-event`)
- Event fetching still works (`GET /organization`, `GET /:eventId`)

### Enhanced Features
- NGOs can now edit their pending events
- NGOs can withdraw pending event requests
- NGOs can delete their events
- Full CRUD operations for event owners

## Next Steps

1. **Restart Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Test Update Functionality**
   - Login as NGO user
   - Create or find an event
   - Click "Manage" → "Edit Event"
   - Modify fields
   - Click "Save Changes"
   - Verify update succeeds

3. **Test Delete Functionality**
   - Login as NGO user
   - Find an event you own
   - Click "Manage" → "Delete Event"
   - Confirm deletion
   - Verify event is removed

4. **Test Authorization**
   - Try to update/delete another NGO's event
   - Should receive 403 Forbidden error

## Files Modified

1. **backend/src/controllers/ngoEvent.controller.js**
   - Added `updateEvent` method
   - Added `deleteEvent` method
   - Exported new methods in controller object

2. **backend/src/routes/event.routes.js**
   - Added `PUT /:eventId` route
   - Added `DELETE /:eventId` route

## Related Documentation

- EVENT_MANAGEMENT_MODAL.md - Frontend modal implementation
- MODAL_DATA_POPULATION_FIX.md - Data population fix
- Backend API documentation

## Summary

This fix implements the missing backend API endpoints for updating and deleting events. The frontend was already correctly calling these endpoints, but they didn't exist in the backend, resulting in 404 errors. Now with proper route handlers and authorization checks, NGOs can:

- ✅ Update their pending events before admin approval
- ✅ Delete any event they've created
- ✅ Have full control over their event lifecycle
- ✅ Receive proper error messages for unauthorized actions

The implementation follows REST conventions, includes proper authentication/authorization, and maintains security by ensuring only event owners can modify their events.
