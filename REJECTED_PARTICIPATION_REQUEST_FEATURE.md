# Rejected Participation Request Feature Implementation

## Overview
This feature allows users to see when their participation request has been rejected and view the rejection reason in a dialog box. Users can also request participation again after being rejected.

## Changes Made

### 1. Frontend Context Updates (`participation-request-context.tsx`)

#### Added new interface methods:
```typescript
getRejectedRequestForEvent: (eventId: string) => ParticipationRequest | null;
hasRejectedRequest: (eventId: string) => boolean;
```

#### Implemented helper functions:
- `getRejectedRequestForEvent()` - Returns the rejected request for a specific event
- `hasRejectedRequest()` - Checks if user has a rejected request for an event

### 2. Event Detail Page Updates (`app/volunteer/[eventId]/page.tsx`)

#### Added imports:
- Dialog components from `@/components/ui/dialog`
- `AlertCircle` icon from lucide-react
- New helper functions from participation context

#### Added state:
```typescript
const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
```

#### Updated participation button logic:
- Added check for rejected requests
- Display "Participation Rejected" button when request is rejected
- Show rejection reason in a dialog when button is clicked
- Allow users to "Request Again" after rejection

### 3. UI/UX Features

#### Rejected Status Button:
- Red background (`bg-red-100 text-red-700`)
- AlertCircle icon
- Clickable to show rejection dialog
- Hover effect for better UX

#### Rejection Reason Dialog:
- Modal popup showing rejection details
- Clean layout with title and description
- Rejection reason displayed in a gray box
- Close button to dismiss dialog

#### Request Again Functionality:
- Secondary button allowing users to resubmit
- Same functionality as initial participation request
- Appropriate loading states and feedback

## User Flow

1. **Initial Request**: User clicks "Request Participation"
2. **Admin Reviews**: Event creator reviews and rejects with reason
3. **User Sees Rejection**: Button changes to "Participation Rejected"
4. **View Reason**: User clicks button to see rejection reason in dialog
5. **Request Again**: User can click "Request Again" to submit new request

## Technical Implementation Details

### Backend Logic:
- Only checks for pending requests (not rejected ones)
- Allows new requests after rejection
- Stores rejection reason in database
- Proper validation and error handling

### Frontend Logic:
- Fetches all user requests (pending, accepted, rejected)
- Helper functions identify request status per event
- Conditional rendering based on request status
- Dialog state management for rejection details

### Database Schema:
- `rejectionReason` field already exists in ParticipationRequest model
- No database changes required

## Error Handling
- Proper validation for missing rejection reasons
- Fallback text when no specific reason provided
- Loading states for all async operations
- Toast notifications for user feedback

## Benefits
1. **Transparency**: Users know why their request was rejected
2. **Second Chance**: Users can improve and resubmit requests
3. **Better UX**: Clear visual feedback and intuitive interactions
4. **Admin Efficiency**: Rejection reasons help reduce repeated unsuitable requests