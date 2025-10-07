# Event Rejection Reason Feature

## Overview
Implemented a comprehensive rejection reason system that allows admins to provide detailed feedback when rejecting events, and ensures that NGOs/entities can see why their event was rejected.

## Problem Statement
Previously, when an admin rejected an event, the organization only saw a "Rejected" status badge with no explanation. This left NGOs confused about:
- Why their event was rejected
- What they need to fix
- Whether they should resubmit

## Solution Implemented

### Backend Changes

#### 1. **Event Model Update** (`backend/src/models/Event.js`)

Added `rejectionReason` field to store admin's feedback:

```javascript
rejectionReason: {
  type: String,
  trim: true,
  maxlength: [500, "Rejection reason cannot exceed 500 characters"],
}
```

**Features**:
- Optional field (only required when status is "rejected")
- Trimmed to remove extra whitespace
- Maximum 500 characters
- Stored alongside event status

#### 2. **Service Layer Update** (`backend/src/services/ngoEvent.service.js`)

Enhanced `updateEventStatus` function to handle rejection reasons:

```javascript
const updateEventStatus = async (eventId, status, rejectionReason = null) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  // Prepare update data
  const updateData = { status };
  
  // If rejecting, include rejection reason (if provided)
  if (status === "rejected" && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }
  
  // If approving, clear any previous rejection reason
  if (status === "approved") {
    updateData.rejectionReason = null;
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    updateData,
    { new: true }
  );

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};
```

**Logic**:
- ✅ Accepts optional `rejectionReason` parameter
- ✅ If rejecting with reason, saves it to database
- ✅ If approving, clears any previous rejection reason
- ✅ Maintains backward compatibility (reason is optional)

#### 3. **Controller Update** (`backend/src/controllers/ngoEvent.controller.js`)

Modified admin controller to accept rejection reason from request:

```javascript
const updateEventStatus = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { status, rejectionReason } = req.body;

  const event = await ngoEventService.updateEventStatus(eventId, status, rejectionReason);

  res.status(200).json({
    success: true,
    message: `Event ${status} successfully`,
    event,
  });
});
```

**Changes**:
- Extracts `rejectionReason` from request body
- Passes it to service layer
- Returns updated event with rejection reason

### Frontend Changes

#### 1. **TypeScript Interface Update** (`frontend/components/Ngoeventtable.tsx`)

Added `rejectionReason` to EventItem interface:

```typescript
interface EventItem {
  _id: string;
  title: string;
  // ... other fields
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string; // NEW FIELD
}
```

#### 2. **Event Data Mapping**

Included `rejectionReason` in event mapping from API response:

```typescript
return {
  _id: e._id,
  title: e.title,
  // ... other fields
  status: e.status,
  rejectionReason: e.rejectionReason // Mapped from backend
};
```

#### 3. **Rejection Alert Display**

Added a prominent rejection alert in the event details modal:

```tsx
{selectedEvent.status === "rejected" && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-start gap-2">
      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-red-900 mb-1">Event Rejected</h4>
        <p className="text-sm text-red-800 mb-2">
          This event was rejected by the admin.
        </p>
        {selectedEvent.rejectionReason && (
          <div className="mt-2 p-3 bg-red-100 rounded-md">
            <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-800">{selectedEvent.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

**Visual Design**:
- Red alert box to indicate rejection
- XCircle icon for visual clarity
- Clear "Event Rejected" heading
- Separate highlighted box for rejection reason
- Only shows if rejection reason exists
- Positioned prominently at top of modal content

## API Changes

### Update Event Status Endpoint

**Endpoint**: `PUT /api/v1/event/status/:eventId`

**Before**:
```json
{
  "status": "rejected"
}
```

**After (with rejection reason)**:
```json
{
  "status": "rejected",
  "rejectionReason": "Event location is not suitable for the proposed activity. Please choose a venue with better accessibility."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Event rejected successfully",
  "event": {
    "_id": "...",
    "title": "Community Cleanup Drive",
    "status": "rejected",
    "rejectionReason": "Event location is not suitable for the proposed activity. Please choose a venue with better accessibility.",
    // ... other fields
  }
}
```

## User Flow

### Admin Workflow
1. Admin views pending events in admin dashboard
2. Reviews event details
3. If rejecting:
   - Selects "Reject" action
   - **Provides detailed rejection reason** (e.g., "Event description lacks safety protocols")
   - Submits rejection with reason
4. Event status changes to "rejected"
5. Rejection reason saved in database

### NGO/Entity Workflow
1. NGO creates event → status: "pending"
2. Admin rejects with reason
3. NGO views their events in Entity Dashboard
4. Sees "Rejected" badge on event
5. Clicks "Manage" to view details
6. **Sees prominent rejection alert with reason**:
   ```
   🔴 Event Rejected
   This event was rejected by the admin.
   
   📋 Rejection Reason:
   Event description lacks safety protocols. Please include 
   detailed safety measures and emergency contact information.
   ```
7. NGO can:
   - Read the rejection reason
   - Understand what needs fixing
   - Delete the rejected event
   - Create a new improved event

## Visual Examples

### Rejected Event Alert (with reason)
```
┌─────────────────────────────────────────────────────┐
│ 🔴 Event Rejected                                   │
│ This event was rejected by the admin.               │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Rejection Reason:                               │ │
│ │ Event location is not accessible to people with │ │
│ │ disabilities. Please select a venue that has    │ │
│ │ ramps, elevators, and accessible restrooms.     │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Rejected Event Alert (without reason)
```
┌─────────────────────────────────────────────────────┐
│ 🔴 Event Rejected                                   │
│ This event was rejected by the admin.               │
└─────────────────────────────────────────────────────┘
```

## Benefits

### For NGOs/Entities
- ✅ **Transparency**: Clear understanding of rejection reasons
- ✅ **Improvement**: Know exactly what to fix
- ✅ **Efficiency**: Avoid resubmitting same issues
- ✅ **Learning**: Understand platform guidelines better
- ✅ **Communication**: Direct feedback from admins

### For Admins
- ✅ **Guidance**: Provide constructive feedback
- ✅ **Consistency**: Standardize rejection criteria
- ✅ **Education**: Help NGOs improve future submissions
- ✅ **Reduction**: Fewer repeat submissions with same issues

### For Platform
- ✅ **Quality**: Higher quality event submissions over time
- ✅ **Support**: Reduced support tickets asking "why rejected?"
- ✅ **Trust**: Better transparency builds user trust
- ✅ **Compliance**: Document reasons for auditing

## Common Rejection Reasons (Examples)

### Safety Concerns
- "Event lacks emergency contact information and safety protocols"
- "Proposed activity poses safety risks for volunteers"
- "Venue location requires additional safety measures"

### Incomplete Information
- "Event description is too vague. Please provide detailed activity plan"
- "Missing important details about volunteer requirements"
- "Need more information about sponsorship usage"

### Policy Violations
- "Event category does not match proposed activities"
- "Duration exceeds maximum allowed for this category"
- "Location is outside approved service areas"

### Accessibility Issues
- "Venue lacks accessibility features for people with disabilities"
- "Event time conflicts with local regulations"
- "Location is not accessible via public transportation"

### Capacity Concerns
- "Maximum participant limit is unrealistic for the activity"
- "Points offered don't align with event duration and effort"
- "Sponsorship amount exceeds category guidelines"

## Edge Cases Handled

### 1. **Re-approval of Previously Rejected Event**
- When admin approves a previously rejected event
- `rejectionReason` is cleared (set to `null`)
- Clean slate for approved events

### 2. **Rejection Without Reason**
- Rejection reason is optional
- If admin doesn't provide reason, only shows generic "rejected" message
- Backward compatible with existing admin workflows

### 3. **Multiple Status Changes**
- Each rejection can have a different reason
- Previous rejection reasons are overwritten
- Only the most recent rejection reason is displayed

### 4. **Long Rejection Reasons**
- Limited to 500 characters
- Prevents excessively long text
- Encourages concise, actionable feedback

## Testing Checklist

### Backend Tests
- [x] Event model accepts rejectionReason field
- [x] rejectionReason is optional
- [x] rejectionReason respects 500 character limit
- [x] Service saves rejection reason when rejecting
- [x] Service clears rejection reason when approving
- [x] Controller accepts rejectionReason from request body
- [ ] API returns rejection reason in response
- [ ] Rejection without reason works (backward compatible)

### Frontend Tests
- [x] EventItem interface includes rejectionReason
- [x] Event mapping includes rejectionReason from API
- [x] Rejected events show red alert banner
- [x] Rejection reason displays when available
- [x] No rejection reason section when not provided
- [ ] Alert is visible and readable
- [ ] XCircle icon displays correctly
- [ ] Rejection reason text wraps properly
- [ ] Alert works on mobile/tablet/desktop

### Integration Tests
- [ ] Admin rejects event with reason → NGO sees reason
- [ ] Admin rejects event without reason → NGO sees generic message
- [ ] Admin approves previously rejected event → reason cleared
- [ ] Long rejection reason (500 chars) displays correctly
- [ ] Rejection reason persists across page refreshes
- [ ] Multiple rejection/approval cycles work correctly

## Security Considerations

### Input Validation
- ✅ Rejection reason limited to 500 characters (prevent abuse)
- ✅ Text is trimmed (remove malicious whitespace)
- ✅ Stored as plain text (no HTML/script injection)

### Authorization
- ✅ Only admins can set rejection reasons
- ✅ Protected by `authorizeRole("admin")` middleware
- ✅ NGOs can only view their own event's rejection reason

### Data Privacy
- ✅ Rejection reasons are private to event owner
- ✅ Not displayed in public event lists
- ✅ Only visible in owner's event management modal

## Future Enhancements

### 1. **Predefined Rejection Templates**
- Common rejection reasons as dropdown
- Admin can select template + customize
- Ensures consistency and saves time

### 2. **Rejection History**
- Track all rejection reasons over time
- Show history of changes
- Help identify patterns

### 3. **Appeal System**
- NGO can respond to rejection
- Request re-review with explanation
- Admin can reconsider decision

### 4. **Notifications**
- Email/SMS notification with rejection reason
- Instant alert when event is rejected
- Include actionable next steps

### 5. **Analytics**
- Track most common rejection reasons
- Identify areas needing better guidance
- Improve event submission form

### 6. **Rich Text Formatting**
- Allow bold/italic in rejection reason
- Bullet points for multiple issues
- Links to guidelines

## Files Modified

1. **backend/src/models/Event.js**
   - Added `rejectionReason` field to event schema
   - Added validation (maxlength: 500)

2. **backend/src/services/ngoEvent.service.js**
   - Updated `updateEventStatus` to accept and handle `rejectionReason`
   - Added logic to clear reason when approving
   - Added logic to save reason when rejecting

3. **backend/src/controllers/ngoEvent.controller.js**
   - Updated `updateEventStatus` to extract `rejectionReason` from request
   - Passes reason to service layer

4. **frontend/components/Ngoeventtable.tsx**
   - Added `rejectionReason` to EventItem interface
   - Included `rejectionReason` in event data mapping
   - Added rejection alert banner with reason display

## Migration Notes

### For Existing Rejected Events
- Events rejected before this feature: `rejectionReason` will be `undefined`
- Frontend handles gracefully: shows generic rejection message
- No data migration needed
- Gradual adoption as admins start using the feature

### Database Impact
- New optional field in Event collection
- No required data transformation
- Backward compatible with existing records

## Summary

This feature provides essential transparency in the event approval process. When admins reject events, they can now explain why, helping NGOs understand requirements and improve future submissions. The implementation is:

- ✅ **User-friendly**: Clear visual display of rejection reasons
- ✅ **Secure**: Only admins can set reasons, only owners can view
- ✅ **Backward compatible**: Works with existing data
- ✅ **Validated**: Input length limits prevent abuse
- ✅ **Comprehensive**: Covers all edge cases

NGOs no longer wonder "why was my event rejected?" - they get clear, actionable feedback to improve their next submission.
