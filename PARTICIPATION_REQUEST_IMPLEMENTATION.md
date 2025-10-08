# Participation Request System Implementation

## Overview
Implemented a comprehensive participation request system that allows users to request participation in events instead of direct participation. Event creators (NGOs) can then approve or reject these requests, similar to the existing event approval/rejection flow for admins.

## Implementation Date
October 2025

## Complete Data Flow

```
User clicks "Request Participation" → Frontend Context → Backend API → Database
                                                                          ↓
NGO Dashboard ← Frontend Display ← API Response ← Database Query ←─┘
```

## Backend Implementation

### 1. ParticipationRequest Model
**Location:** `backend/src/models/ParticipationRequest.js`

```javascript
const participationRequestSchema = new mongoose.Schema({
  eventId: { type: ObjectId, ref: "Event", required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  eventCreatorId: { type: ObjectId, ref: "User", required: true },
  status: { enum: ["pending", "accepted", "rejected"], default: "pending" },
  rejectionReason: { type: String, maxlength: 500 },
  message: { type: String, maxlength: 500 }
});
```

**Features:**
- Composite index prevents duplicate requests
- Virtual fields for populated data
- Instance methods for accept/reject operations
- Static methods for querying by creator/user/event
- Pre-save validation hooks

### 2. ParticipationRequest Service
**Location:** `backend/src/services/participationRequest.service.js`

**Key Functions:**
- `createParticipationRequest(eventId, userId, message)`
- `getParticipationRequestsByCreator(eventCreatorId, status)`
- `getParticipationRequestsByUser(userId, status)`
- `updateParticipationRequestStatus(requestId, status, rejectionReason, eventCreatorId)`
- `cancelParticipationRequest(requestId, userId)`
- `getParticipationRequestStats(eventCreatorId)`

### 3. ParticipationRequest Controller
**Location:** `backend/src/controllers/participationRequest.controller.js`

**Endpoints:**
- `POST /api/v1/participation-requests/event/:eventId` - Create request
- `GET /api/v1/participation-requests/my-requests` - Get incoming requests (for NGOs)
- `GET /api/v1/participation-requests/user-requests` - Get user's requests
- `PUT /api/v1/participation-requests/:requestId/status` - Accept/reject request
- `DELETE /api/v1/participation-requests/:requestId` - Cancel request
- `GET /api/v1/participation-requests/stats` - Get statistics

### 4. Additional Event Controller Method
**Location:** `backend/src/controllers/ngoEvent.controller.js`

Added `requestParticipation` function that integrates with the participation request service:
```javascript
const requestParticipation = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id;
  const { message } = req.body;
  
  const participationRequest = await participationRequestService.createParticipationRequest(
    eventId, userId, message
  );
  
  res.status(201).json({
    success: true,
    message: "Participation request submitted successfully!",
    participationRequest
  });
});
```

## Frontend Implementation

### 1. ParticipationRequest Context
**Location:** `frontend/contexts/participation-request-context.tsx`

**Context Features:**
- Manages incoming requests for NGOs
- Manages user's sent requests
- Provides helper functions for request status checking
- Handles real-time updates
- Toast notifications for user feedback

**Key Functions:**
- `createParticipationRequest(eventId, message)`
- `acceptRequest(requestId)`
- `rejectRequest(requestId, rejectionReason)`
- `cancelRequest(requestId)`
- `hasRequestedParticipation(eventId)`
- `getPendingRequestForEvent(eventId)`

### 2. Updated Volunteer Page
**Location:** `frontend/app/volunteer/page.tsx`

**Changes:**
- Replaced direct participation with participation requests
- Updated button states to show:
  - "Request Participation" (default)
  - "Requested Participation" (pending request)
  - "Already Participating" (accepted request)
- Added ParticipationRequestBanner component

### 3. Participation Request Banner
**Location:** `frontend/components/ParticipationRequestBanner.tsx`

**Features:**
- Shows pending requests with event details
- Displays recent status updates (accepted/rejected)
- Shows rejection reasons when applicable
- Auto-hides after 24 hours for status updates

### 4. NGO Dashboard Integration
**Location:** `frontend/components/PendingParticipationRequests.tsx`

**Features:**
- Displays pending participation requests
- Shows participant details and request message
- Accept/reject buttons with confirmation
- Rejection reason input with validation
- Real-time statistics
- Loading states and empty states

### 5. Updated Event Details Page
**Location:** `frontend/app/volunteer/[eventId]/page.tsx`

**Changes:**
- Replaced direct participation with participation requests
- Added cancel request functionality
- Updated button states and messaging
- Proper handling of request status display

## User Experience Flow

### For Users (Volunteers)

1. **Browse Events**: Users see available events on `/volunteer` page
2. **Request Participation**: Click "Request Participation" button
3. **Status Display**: Button changes to "Requested Participation"
4. **Banner Notification**: Yellow banner appears showing pending request
5. **Status Updates**: Green/red banners show acceptance/rejection
6. **Cancel Option**: Can cancel pending requests from event details page

### For NGOs (Event Creators)

1. **View Requests**: See pending participation requests on NGO dashboard
2. **Request Details**: View participant information and request message
3. **Accept Request**: Click accept to add user as participant
4. **Reject Request**: Provide rejection reason and reject request
5. **Statistics**: See total pending/accepted/rejected request counts

## Button State Logic

### Volunteer Page & Event Details
```
if (userParticipating) → "Already Participating" (green, disabled)
else if (hasRequested) → "Requested Participation" (yellow, disabled)
else if (eventFull) → "Event Full" (red, disabled)
else → "Request Participation" (blue, clickable)
```

### NGO Dashboard
```
- Accept button → Adds user to event participants
- Reject button → Opens dialog for rejection reason
- Statistics badge → Shows pending request count
```

## Database Schema Updates

### ParticipationRequest Collection
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Event),
  userId: ObjectId (ref: User),
  eventCreatorId: ObjectId (ref: User),
  status: "pending" | "accepted" | "rejected",
  rejectionReason: String (optional),
  message: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- Composite unique index on `{ eventId, userId }`
- Individual indexes on `eventCreatorId`, `userId`, `eventId`

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/participation-requests/event/:eventId` | Create participation request | User |
| GET | `/api/v1/participation-requests/my-requests` | Get incoming requests (NGO) | NGO |
| GET | `/api/v1/participation-requests/user-requests` | Get user's requests | User |
| PUT | `/api/v1/participation-requests/:requestId/status` | Accept/reject request | NGO |
| DELETE | `/api/v1/participation-requests/:requestId` | Cancel request | User |
| GET | `/api/v1/participation-requests/stats` | Get request statistics | NGO |
| POST | `/api/v1/event/request-participation/:eventId` | Alternative request endpoint | User |

## Security Features

### Backend Validation
- ✅ Only event creators can accept/reject requests
- ✅ Only request creators can cancel requests
- ✅ Prevents duplicate requests
- ✅ Validates event availability and capacity
- ✅ Prevents self-participation in owned events
- ✅ Input validation for rejection reasons (500 char limit)

### Authorization Checks
- ✅ JWT token validation for all endpoints
- ✅ User role verification (NGO vs regular user)
- ✅ Event ownership verification for request management
- ✅ Request ownership verification for cancellation

## Error Handling

### Backend Errors
- Event not found
- User already participating
- Event full
- Duplicate request
- Invalid status values
- Unauthorized access

### Frontend Error Handling
- Toast notifications for all errors
- Loading states during API calls
- Graceful fallbacks for missing data
- Retry mechanisms for failed requests

## Success Criteria

### Feature Complete When:
✅ Users can request participation in events  
✅ Requests are sent to event creators  
✅ Event creators can accept/reject requests  
✅ Users see request status in real-time  
✅ Banners display on user homepage  
✅ NGO dashboard shows pending requests  
✅ Rejection reasons are captured and displayed  
✅ Request statistics are available  
✅ All UI states work correctly  
✅ No console errors or TypeScript errors  

## Related Features

### Connected Implementations
- **Event Management**: Integration with existing event system
- **User Authentication**: Leverages existing auth context
- **NGO Dashboard**: Extends existing dashboard functionality
- **Toast Notifications**: Uses existing notification system
- **Event Participation**: Replaces direct participation flow

## Future Enhancements

### Potential Improvements
1. **Email Notifications**: Send emails for request status changes
2. **Batch Operations**: Accept/reject multiple requests at once
3. **Request Analytics**: Detailed analytics for NGOs
4. **Request Templates**: Pre-defined rejection reasons
5. **Participant Messaging**: Communication between users and NGOs
6. **Request Expiration**: Auto-expire old pending requests
7. **Waitlist System**: Queue system when events are full

## Testing Recommendations

### Manual Testing Checklist
- [ ] Create participation request as user
- [ ] Verify request appears on NGO dashboard
- [ ] Accept request and verify user becomes participant
- [ ] Reject request with reason and verify user sees reason
- [ ] Cancel pending request as user
- [ ] Test all button states on volunteer page
- [ ] Verify banners appear correctly
- [ ] Test request statistics accuracy
- [ ] Verify authorization restrictions
- [ ] Test error handling scenarios

### Automated Testing
- Unit tests for service layer functions
- Integration tests for API endpoints
- Component tests for UI elements
- End-to-end tests for complete user flows

## Documentation Files Created

1. `PARTICIPATION_REQUEST_IMPLEMENTATION.md` - This comprehensive guide
2. Backend models, services, and controllers
3. Frontend contexts and components
4. Updated existing pages with new functionality

This implementation provides a complete participation request system that mirrors the existing event approval workflow, giving NGOs control over who participates in their events while maintaining a user-friendly experience for volunteers.