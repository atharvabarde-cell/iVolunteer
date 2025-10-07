# Event Management Modal Feature

## Overview
Implemented a comprehensive event management system in the Ngoeventtable component that allows NGOs to view, edit, withdraw, and delete their events through an interactive modal interface.

## Features Implemented

### 1. **Clickable "Manage" Button**
- Every event in the table now has a functional "Manage" button
- Clicking opens a detailed modal showing all event information
- Modal displays different options based on event status (pending/approved/rejected)

### 2. **Smooth Scroll to Table**
- Banner click now scrolls smoothly to the events table
- Uses `scrollIntoView` with smooth behavior
- Automatically filters to pending events
- Better user experience and navigation

### 3. **Event Details Modal**
Shows comprehensive event information:
- Event title and description
- Category and event type
- Location and detailed address
- Date, time, and duration
- Max participants and current participant count
- Points offered
- Sponsorship details
- Status badge (Pending/Approved/Rejected)

### 4. **Edit Mode for Pending Events**
- "Edit Event" button available for pending events
- All fields become editable in edit mode
- Form fields with proper validation
- "Save Changes" button to update event
- "Cancel" button to discard changes
- Real-time updates to the event list

**Editable Fields:**
- Title
- Description
- Category (dropdown)
- Event Type (dropdown)
- Location
- Detailed Address
- Date (date picker)
- Time (time picker)
- Duration (1-12 hours)
- Max Participants
- Points Offered
- Sponsorship Required (yes/no)
- Sponsorship Amount (if required)

### 5. **Withdraw Request Feature**
- Available for pending events only
- "Withdraw Request" button removes event from admin review
- Confirmation dialog before withdrawal
- Deletes the event from the system
- Toast notification on success/failure
- Automatically refreshes event list

### 6. **Delete Event Feature**
- "Delete Event" button available for all events
- Confirmation dialog before deletion
- Permanently removes event from database
- Toast notification on success/failure
- Automatically refreshes event list

## Implementation Details

### State Management
```typescript
const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
const [isEditMode, setIsEditMode] = useState(false);
const [editedEvent, setEditedEvent] = useState<EventItem | null>(null);
const tableRef = useRef<HTMLElement>(null);
```

### New Event Interface
```typescript
interface EventItem {
  _id: string;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  filled: number;
  status: "pending" | "approved" | "rejected";
  displayStatus: "Open" | "Ongoing" | "Full";
  progress: number;
  eventStatus?: string;
  participants?: any[];
  description?: string;
  time?: string;
  duration?: number;
  category?: string;
  pointsOffered?: number;
  requirements?: string[];
  sponsorshipRequired?: boolean;
  sponsorshipAmount?: number;
  detailedAddress?: string;
  eventType?: string;
}
```

### Key Functions

#### 1. Handle Manage Click
```typescript
const handleManageClick = (event: EventItem) => {
  setSelectedEvent(event);
  setEditedEvent({ ...event });
  setIsEditMode(false);
};
```

#### 2. Handle Edit Save
```typescript
const handleSaveEdit = async () => {
  // Prepares event data
  // Makes PUT request to /v1/event/:id
  // Shows success/error toast
  // Refreshes event list
};
```

#### 3. Handle Withdraw Request
```typescript
const handleWithdrawRequest = async () => {
  // Shows confirmation dialog
  // Makes DELETE request to /v1/event/:id
  // Shows success/error toast
  // Closes modal and refreshes list
};
```

#### 4. Scroll to Table
```typescript
const scrollToTable = () => {
  if (tableRef.current) {
    tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
```

## User Flow

### Viewing Event Details
1. NGO navigates to Entity Dashboard (Ngoeventtable)
2. Clicks "Manage" button on any event
3. Modal opens showing complete event details
4. Status badge indicates current approval state
5. Can close modal with X button

### Editing Pending Event
1. Open event details modal for pending event
2. Click "Edit Event" button
3. All fields become editable form inputs
4. Make desired changes
5. Click "Save Changes" to update
6. Or click "Cancel" to discard changes
7. Event updates in database and list refreshes

### Withdrawing Pending Event
1. Open event details modal for pending event
2. Click "Withdraw Request" button
3. Confirm action in dialog
4. Event is deleted from system
5. Toast notification confirms withdrawal
6. Modal closes and list refreshes

### Deleting Any Event
1. Open event details modal
2. Click "Delete Event" button (red, bottom right)
3. Confirm action in dialog
4. Event is permanently deleted
5. Toast notification confirms deletion
6. Modal closes and list refreshes

### Banner to Events Navigation
1. NGO sees yellow pending events alert banner
2. Hovers over banner (background lightens)
3. Clicks banner
4. **Page smoothly scrolls to events table**
5. **Filter automatically set to "pending"**
6. Only pending events displayed in table

## Visual Design

### Modal Layout
- **Header**: Title, status badge, close button
- **Alert** (for pending): Yellow info box with edit/withdraw instructions
- **Content**: Two-column grid layout for event fields
- **Footer**: Action buttons (Edit/Save/Cancel/Withdraw/Delete)

### Colors and States
- **Edit Mode**: Blue buttons, form inputs visible
- **Withdraw**: Yellow button (warning action)
- **Delete**: Red button (destructive action)
- **Save**: Green button (confirm action)
- **Cancel**: Gray button (neutral action)

### Responsive Design
- Modal is responsive and scrollable
- Max height 90vh with overflow-y-auto
- Grid adapts to mobile (1 column) and desktop (2 columns)
- Buttons wrap on smaller screens

## Backend Integration

### API Endpoints Used

1. **Update Event**
   ```
   PUT /v1/event/:eventId
   Headers: Authorization: Bearer {token}
   Body: { title, description, location, ... }
   ```

2. **Delete Event**
   ```
   DELETE /v1/event/:eventId
   Headers: Authorization: Bearer {token}
   ```

3. **Fetch Events**
   ```
   GET /v1/event/organization
   Headers: Authorization: Bearer {token}
   ```

## Security & Validation

### Authorization
- All API calls include auth token
- Token retrieved from localStorage
- 401 errors handled with appropriate messages

### Validation
- Confirmation dialogs for destructive actions
- Form validation for edit mode
- Min/max values for numeric inputs
- Required fields enforced

### Error Handling
- Try-catch blocks for all async operations
- Toast notifications for success/failure
- User-friendly error messages
- Auto-refresh on successful actions

## Toast Notifications

Uses `react-toastify` for user feedback:
- ✅ "Event updated successfully!"
- ✅ "Event request withdrawn successfully"
- ✅ "Event deleted successfully"
- ❌ "Failed to update event"
- ❌ "Failed to withdraw event"
- ❌ "Failed to delete event"
- ❌ "Authentication required"

## Accessibility Features

- Keyboard navigation (Esc to close modal - future)
- Semantic HTML structure
- Clear button labels
- Visual feedback on hover/focus
- Confirmation dialogs prevent accidental actions

## Testing Checklist

- [x] "Manage" button opens modal for each event
- [x] Modal displays all event information correctly
- [x] Status badge shows correct status
- [x] Close button (X) closes modal
- [x] "Edit Event" button enables edit mode (pending only)
- [x] All fields are editable in edit mode
- [x] "Save Changes" updates event successfully
- [x] "Cancel" discards changes
- [x] "Withdraw Request" deletes pending event
- [x] "Delete Event" removes any event
- [x] Confirmation dialogs appear for destructive actions
- [x] Toast notifications show appropriate messages
- [x] Event list refreshes after actions
- [x] Modal closes after successful actions
- [x] Banner click scrolls to table smoothly
- [x] Banner click filters to pending events
- [x] No console errors
- [x] Responsive on mobile/tablet/desktop

## Future Enhancements

1. **Keyboard Support**
   - Esc key to close modal
   - Enter to confirm in edit mode
   - Tab navigation through form fields

2. **Advanced Features**
   - Image upload/edit in modal
   - Requirements list editor
   - Preview mode before saving
   - Change history/audit log

3. **Improved UX**
   - Loading states during API calls
   - Optimistic UI updates
   - Undo functionality
   - Bulk actions

4. **Accessibility**
   - ARIA labels
   - Screen reader support
   - Focus management
   - High contrast mode

## Related Files

- `frontend/components/Ngoeventtable.tsx` - Main component with modal
- `frontend/lib/api.ts` - API client configuration
- Backend event routes and controllers

## Dependencies

- **react-toastify**: Toast notifications
- **lucide-react**: Icons (Edit2, Trash2, XCircle, etc.)
- **framer-motion**: Table animations
- **Tailwind CSS**: Styling

## Summary

This feature transforms the Ngoeventtable from a simple display table into a comprehensive event management interface. NGOs can now:
- View complete event details in a polished modal
- Edit pending events before admin approval
- Withdraw pending requests they no longer want to pursue
- Delete any event they've created
- Navigate seamlessly from alert banner to events table

The implementation prioritizes user experience with smooth animations, clear visual feedback, confirmation dialogs for safety, and toast notifications for transparency. All actions are properly secured with authentication and validated to prevent errors.
