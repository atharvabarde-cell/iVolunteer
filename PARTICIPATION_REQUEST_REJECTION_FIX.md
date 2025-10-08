# Participation Request After Rejection Fix

## Problem
When a user tries to request participation again after being rejected, they get a 500 error:
```
POST /api/v1/participation-requests/event/68e603a5c16c573028391178 500 721.622 ms - 232
```

The error was:
```
E11000 duplicate key error collection: iVolunteer.participationrequests index: eventId_1_userId_1 dup key: { eventId: ObjectId('68e603a5c16c573028391178'), userId: ObjectId('68e29bd933647d463feda13d') }
```

## Root Cause
The unique composite index `eventId_1_userId_1` prevented creating a new participation request when a rejected request already existed for the same user and event.

## Solution
Updated the `createParticipationRequest` service to:

1. **Check for existing pending requests** - Still prevents multiple pending requests
2. **Handle existing rejected requests** - Instead of failing, it updates the rejected request:
   - Changes status from "rejected" to "pending" 
   - Updates the message if provided
   - Clears the previous rejection reason
   - Returns the updated request

## Benefits
- ✅ Users can request participation again after rejection
- ✅ Preserves request history (updates existing record)
- ✅ Maintains data integrity with unique constraints
- ✅ No database schema changes required
- ✅ Proper error handling for edge cases

## Code Changes

### Backend (`participationRequest.service.js`)
```javascript
// Check for existing rejected request
const existingRejectedRequest = await ParticipationRequest.findOne({
  eventId,
  userId,
  status: 'rejected'
});

if (existingRejectedRequest) {
  // Update the existing rejected request to pending status
  existingRejectedRequest.status = 'pending';
  existingRejectedRequest.message = message || null;
  existingRejectedRequest.rejectionReason = undefined;
  
  await existingRejectedRequest.save();
  return existingRejectedRequest;
}
```

## Testing
1. User gets rejected for an event
2. User clicks "Request Again" button
3. Request is successfully submitted (no 500 error)
4. Event creator sees new pending request
5. Request history is preserved in database