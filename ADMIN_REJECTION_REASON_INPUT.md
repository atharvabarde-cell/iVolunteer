# Admin Rejection Reason Input Feature

## Overview
This feature adds a rejection reason input dialog to the admin panel, allowing admins to provide specific reasons when rejecting volunteer events. The rejection reason is then displayed to the NGO/entity that created the event.

## Implementation Date
January 2025

## Components Modified

### 1. Frontend Context (`frontend/contexts/events-context.tsx`)

#### Updated Interface
```typescript
interface EventsContextType {
  // ... other properties
  rejectEvent: (eventId: string, rejectionReason?: string) => Promise<boolean>;
}
```

#### Updated Function
```typescript
const rejectEvent = async (eventId: string, rejectionReason?: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('auth-token');
    const response = await fetch(
      `http://localhost:5000/api/v1/event/status/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: "rejected",
          rejectionReason: rejectionReason || ""
        })
      }
    );
    // ... rest of function
  }
};
```

**Changes:**
- Added optional `rejectionReason` parameter to function signature
- Updated interface to reflect the new parameter
- Sends `rejectionReason` in the request body to the backend API

### 2. Admin Panel (`frontend/app/admin/page.tsx`)

#### New Imports
```typescript
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
```

#### New State Variables
```typescript
const [showRejectDialog, setShowRejectDialog] = useState(false)
const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
const [rejectionReason, setRejectionReason] = useState("")
const [isSubmitting, setIsSubmitting] = useState(false)
```

#### Updated Reject Handler
```typescript
const handleReject = (eventId: string) => {
  setSelectedEventId(eventId)
  setRejectionReason("")
  setShowRejectDialog(true)
}
```

**Flow:**
1. Admin clicks "Reject" button on an event
2. Dialog opens asking for rejection reason
3. Admin enters reason (required, max 500 characters)
4. Admin clicks "Reject Event" to confirm or "Cancel" to abort
5. If confirmed, `rejectEvent` is called with the reason
6. Dialog closes on success

#### New Confirm Handler
```typescript
const handleRejectConfirm = async () => {
  if (!selectedEventId) return
  
  if (!rejectionReason.trim()) {
    alert("Please provide a reason for rejection")
    return
  }
  
  setIsSubmitting(true)
  const success = await rejectEvent(selectedEventId, rejectionReason.trim())
  setIsSubmitting(false)
  
  if (success) {
    setShowRejectDialog(false)
    setSelectedEventId(null)
    setRejectionReason("")
  } else {
    alert("Failed to reject event. Please try again.")
  }
}
```

#### New Cancel Handler
```typescript
const handleRejectCancel = () => {
  setShowRejectDialog(false)
  setSelectedEventId(null)
  setRejectionReason("")
}
```

#### Rejection Dialog UI
```tsx
<Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Reject Event</DialogTitle>
      <DialogDescription>
        Please provide a reason for rejecting this event. This will be visible to the event organizer.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="rejection-reason">Rejection Reason *</Label>
        <Textarea
          id="rejection-reason"
          placeholder="e.g., Event does not meet community guidelines, Incomplete event details, etc."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="min-h-[100px]"
          maxLength={500}
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          {rejectionReason.length}/500 characters
        </p>
      </div>
    </div>
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={handleRejectCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={handleRejectConfirm}
        disabled={isSubmitting || !rejectionReason.trim()}
      >
        {isSubmitting ? "Rejecting..." : "Reject Event"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## User Flow

### Admin Workflow
1. Admin navigates to Admin Panel (`/admin`)
2. Views pending events in the "Pending" tab
3. Clicks "Reject" button on an event
4. **Rejection dialog appears** with:
   - Title: "Reject Event"
   - Description explaining the reason will be visible to organizer
   - Required textarea for rejection reason (max 500 chars)
   - Character counter showing current/max characters
   - Cancel button (closes dialog without action)
   - Reject Event button (disabled until reason is entered)
5. Admin types rejection reason
6. Admin clicks "Reject Event"
7. System sends rejection with reason to backend
8. Event status updates to "rejected" with the reason stored
9. Dialog closes automatically on success
10. Event moves to "Rejected" tab

### NGO/Entity Sees Rejection
1. NGO logs into their dashboard
2. Sees rejection banner: "{Event Name} got rejected by admin for {Rejection Reason}"
3. Clicks on event to view details
4. Modal shows rejection alert with full reason
5. NGO can see exactly why their event was rejected

## Validation

### Client-Side
- Rejection reason is **required** (cannot be empty or whitespace only)
- Maximum 500 characters enforced by textarea
- "Reject Event" button disabled until valid reason is entered
- Character counter shows real-time feedback

### Backend
- `rejectionReason` field in Event model has 500 char limit
- Field is trimmed to remove leading/trailing whitespace
- Empty strings are accepted but frontend prevents sending them

## Features

### User Experience
- **Clear Communication**: Admin dialog explains reason will be shown to organizer
- **Character Counter**: Shows remaining characters (e.g., "0/500 characters")
- **Loading State**: "Rejecting..." button text during submission
- **Error Handling**: Alert shown if rejection fails
- **Validation Feedback**: Button disabled until valid input
- **Cancel Option**: Admin can abort rejection without penalty

### Technical Features
- **Optional Parameter**: `rejectionReason` is optional in function signature (backward compatible)
- **State Management**: Uses React hooks for dialog and form state
- **Loading States**: Prevents double-submission with `isSubmitting` flag
- **Clean Reset**: Dialog state resets after successful rejection
- **Error Recovery**: Keeps dialog open on failure so admin can retry

## Integration

### Backend API
- Endpoint: `PUT /api/v1/event/status/:eventId`
- Request Body:
  ```json
  {
    "status": "rejected",
    "rejectionReason": "Your detailed reason here"
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

### Display Components
- `frontend/components/Ngoeventtable.tsx` - Shows rejection reason in modal and banners
- `frontend/app/ngo-dashboard/page.tsx` - Shows rejection banner with reasons

## UI Components Used

### shadcn/ui Components
- `Dialog` - Modal overlay for rejection form
- `DialogContent` - Main dialog container
- `DialogHeader` - Dialog title and description area
- `DialogTitle` - "Reject Event" heading
- `DialogDescription` - Explanation text
- `DialogFooter` - Action buttons container
- `Textarea` - Multi-line input for rejection reason
- `Label` - Accessible label for textarea
- `Button` - Action buttons (Cancel, Reject Event)

### Styling
- Uses Tailwind CSS classes
- Red destructive variant for reject button
- Disabled states for loading/validation
- Character counter with muted text

## Testing Checklist

### Admin Panel Tests
- [ ] Click "Reject" button opens dialog
- [ ] Dialog title is "Reject Event"
- [ ] Description mentions reason will be visible to organizer
- [ ] Textarea is empty initially
- [ ] Character counter shows "0/500"
- [ ] "Reject Event" button is disabled when textarea is empty
- [ ] "Reject Event" button is disabled when only whitespace entered
- [ ] Typing enables "Reject Event" button
- [ ] Character counter updates in real-time
- [ ] Cannot exceed 500 characters
- [ ] "Cancel" button closes dialog without action
- [ ] "Reject Event" button shows "Rejecting..." during submission
- [ ] All inputs disabled during submission
- [ ] Dialog closes on successful rejection
- [ ] Alert shown on rejection failure
- [ ] Dialog stays open on failure (can retry)
- [ ] Event moves to "Rejected" tab after rejection
- [ ] Can reject multiple events in sequence

### NGO Dashboard Tests
- [ ] Rejection banner shows event name
- [ ] Rejection banner shows rejection reason
- [ ] Banner format: "{Event} got rejected by admin for {Reason}"
- [ ] Clicking banner navigates to rejected tab
- [ ] Event modal shows rejection alert
- [ ] Modal displays full rejection reason
- [ ] Rejection reason wraps properly in modal
- [ ] No rejection reason shows fallback message

### Backend Integration Tests
- [ ] API receives rejectionReason in request body
- [ ] Rejection reason saved to database
- [ ] Rejection reason persists across sessions
- [ ] Rejection reason appears in API responses
- [ ] 500 character limit enforced by backend
- [ ] Empty string handled gracefully
- [ ] Rejection reason cleared when event approved

## Error Handling

### Scenarios
1. **Network Error**: Alert shown, dialog stays open, can retry
2. **API Error**: Alert shown, dialog stays open, can retry
3. **Empty Reason**: Client-side validation prevents submission
4. **Whitespace Only**: Trimmed and validated, prevents submission
5. **Exceeds 500 Chars**: Textarea prevents input beyond limit

## Future Enhancements

### Potential Improvements
- Toast notifications instead of alerts
- Predefined rejection reason templates/quick picks
- Rejection reason history/analytics for admins
- Email notification to NGO with rejection reason
- Rich text editor for formatted rejection reasons
- Rejection reason categories/tags
- Ability to edit rejection reason after submitting

## Related Files

### Frontend
- `frontend/app/admin/page.tsx` - Admin panel with rejection dialog
- `frontend/contexts/events-context.tsx` - Context with updated rejectEvent function
- `frontend/components/Ngoeventtable.tsx` - Displays rejection reasons to NGOs
- `frontend/app/ngo-dashboard/page.tsx` - Dashboard with rejection banner

### Backend
- `backend/src/models/Event.js` - Event model with rejectionReason field
- `backend/src/services/ngoEvent.service.js` - Service handling rejection
- `backend/src/controllers/ngoEvent.controller.js` - Controller processing requests
- `backend/src/routes/event.routes.js` - API routes

### Documentation
- `EVENT_REJECTION_REASON_FEATURE.md` - Backend implementation
- `REJECTION_REASON_DASHBOARD_BANNER.md` - Dashboard display
- `EVENT_MANAGEMENT_MODAL.md` - Modal implementation
- `REJECTION_REASON_DEBUG_GUIDE.md` - Debugging guide
- `ADMIN_REJECTION_REASON_INPUT.md` - This document

## Summary

This feature completes the rejection reason workflow by adding the critical admin input step. Admins can now provide detailed, specific feedback when rejecting events, ensuring NGOs understand why their events weren't approved. The feature includes proper validation, user-friendly UI, error handling, and integrates seamlessly with existing backend and frontend display components.

The implementation follows best practices:
- ✅ Required field validation
- ✅ Character limits (500 chars)
- ✅ Loading states
- ✅ Error handling
- ✅ Accessible UI (labels, descriptions)
- ✅ Clean state management
- ✅ Backward compatible API
- ✅ User feedback (character counter, button states)
