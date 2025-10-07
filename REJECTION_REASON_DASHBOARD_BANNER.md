# Rejection Reason Dashboard Banner Feature

## Overview
Enhanced the event rejection system by adding prominent dashboard banners that display rejected events with their rejection reasons. Now NGOs can see exactly which events were rejected and why, directly from their dashboard before even opening the event details.

## Problem Statement
Previously:
- NGOs only saw rejection reasons after clicking "Manage" on a rejected event
- No dashboard-level notification about rejected events
- Had to manually check each event to find rejected ones
- Missing immediate visibility of rejection reasons

## Solution Implemented

### Dashboard Banners for Rejected Events

#### 1. **NGO Dashboard Banner** (`frontend/app/ngo-dashboard/page.tsx`)

Added a prominent red alert banner showing all rejected events with their reasons:

```tsx
{rejectedEvents.length > 0 && (
  <div 
    onClick={() => setActiveTab("rejected")}
    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-red-100 transition-colors"
  >
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-red-900 mb-1">
          {rejectedEvents.length} Event{rejectedEvents.length > 1 ? 's' : ''} Rejected
        </h4>
        <div className="text-sm text-red-800 space-y-2">
          {rejectedEvents.map((event, index) => (
            <div key={event.id} className={index > 0 ? "mt-2 pt-2 border-t border-red-200" : ""}>
              <p className="font-medium">
                "{event.title}" was rejected by admin
                {event.rejectionReason && (
                  <span className="font-normal"> for: <span className="italic">"{event.rejectionReason}"</span></span>
                )}
              </p>
            </div>
          ))}
          <p className="font-semibold mt-2">Click to view and manage rejected events.</p>
        </div>
      </div>
    </div>
  </div>
)}
```

**Features**:
- ✅ Red alert styling for high visibility
- ✅ AlertCircle icon indicates rejection
- ✅ Shows count of rejected events
- ✅ Lists each rejected event by name
- ✅ Displays rejection reason inline (if provided)
- ✅ Clickable - navigates to "rejected" tab
- ✅ Hover effect for interactivity
- ✅ Responsive design

#### 2. **Entity Dashboard Banner** (`frontend/components/Ngoeventtable.tsx`)

Similar banner for the Entity Dashboard with XCircle icon:

```tsx
{rejectedEvents.length > 0 && (
  <div 
    onClick={handleRejectedBannerClick}
    className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 cursor-pointer hover:bg-red-100 transition-colors"
  >
    <div className="flex items-start gap-3">
      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-red-900 mb-1">
          {rejectedEvents.length} Event{rejectedEvents.length > 1 ? 's' : ''} Rejected
        </h4>
        <div className="text-sm text-red-800 space-y-2">
          {rejectedEvents.map((event, index) => (
            <div key={event._id} className={index > 0 ? "mt-2 pt-2 border-t border-red-200" : ""}>
              <p className="font-medium">
                "{event.title}" was rejected by admin
                {event.rejectionReason && (
                  <span className="font-normal"> for: <span className="italic">"{event.rejectionReason}"</span></span>
                )}
              </p>
            </div>
          ))}
          <p className="font-semibold mt-2">Click to view and manage rejected events.</p>
        </div>
      </div>
    </div>
  </div>
)}
```

**Handler Function**:
```typescript
const handleRejectedBannerClick = () => {
  setFilter("rejected");
  scrollToTable();
};
```

#### 3. **Event Interface Update** (`frontend/contexts/events-context.tsx`)

Added `rejectionReason` to Event interface:

```typescript
export interface Event {
  id: string;
  title: string;
  // ... other fields
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string; // NEW FIELD
}
```

## Visual Design

### Banner Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 2 Events Rejected                                             │
│                                                                  │
│ "Community Cleanup Drive" was rejected by admin for:            │
│ "Event location lacks accessibility features for people with    │
│  disabilities. Please select an accessible venue."              │
│ ─────────────────────────────────────────────────────────────── │
│ "Tree Planting Event" was rejected by admin for:                │
│ "Event description lacks safety protocols and emergency         │
│  contact information."                                           │
│                                                                  │
│ Click to view and manage rejected events.                       │
└──────────────────────────────────────────────────────────────────┘
```

### Color Scheme
- **Background**: `bg-red-50` - Light red for attention
- **Border**: `border-red-200` - Subtle red border
- **Text**: `text-red-800` - Dark red for readability
- **Heading**: `text-red-900` - Bold dark red
- **Hover**: `hover:bg-red-100` - Slightly darker on hover
- **Icon**: `text-red-600` - Red icon color

### Multiple Events Display
- Each event separated by border divider
- Event title in quotes for clarity
- Rejection reason in italic for distinction
- Clean spacing between events

### Single Event Display
```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 1 Event Rejected                                              │
│                                                                  │
│ "Community Cleanup Drive" was rejected by admin for:            │
│ "Event location lacks accessibility features."                  │
│                                                                  │
│ Click to view and manage rejected events.                       │
└──────────────────────────────────────────────────────────────────┘
```

### Event Without Rejection Reason
```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 1 Event Rejected                                              │
│                                                                  │
│ "Community Cleanup Drive" was rejected by admin                 │
│                                                                  │
│ Click to view and manage rejected events.                       │
└──────────────────────────────────────────────────────────────────┘
```

## User Flow

### NGO Logs Into Dashboard
1. NGO logs in and lands on NGO Dashboard
2. **Immediately sees red rejection banner** (if any events rejected)
3. Banner shows:
   - Count of rejected events
   - Each event name
   - Rejection reason for each (if provided)
4. NGO reads rejection reasons without opening event
5. Clicks banner to view all rejected events in detail
6. Tab switches to "rejected" automatically
7. Can manage/delete rejected events

### Banner Interaction
1. **Hover**: Background color lightens (red-50 → red-100)
2. **Click**: 
   - NGO Dashboard: `setActiveTab("rejected")` - switches to rejected tab
   - Entity Dashboard: `setFilter("rejected")` + smooth scroll to table
3. Cursor changes to pointer indicating clickability

## Implementation Details

### State Management

**NGO Dashboard**:
```typescript
const pendingEvents = myEvents.filter((event) => event.status === "pending");
const rejectedEvents = myEvents.filter((event) => event.status === "rejected");
```

**Entity Dashboard**:
```typescript
const rejectedEvents = events.filter(e => e.status === "rejected");
```

### Click Handlers

**NGO Dashboard**:
```typescript
// Banner click navigates to rejected tab
onClick={() => setActiveTab("rejected")}
```

**Entity Dashboard**:
```typescript
const handleRejectedBannerClick = () => {
  setFilter("rejected");
  scrollToTable();
};
```

### Conditional Rendering

Both banners only show when there are rejected events:
```typescript
{rejectedEvents.length > 0 && (
  <div>...</div>
)}
```

### Dynamic Text

Singular/plural handling:
```typescript
{rejectedEvents.length} Event{rejectedEvents.length > 1 ? 's' : ''}
```

## Message Format

### With Rejection Reason
```
"{eventTitle}" was rejected by admin for: "{rejectionReason}"
```

**Example**:
```
"Community Cleanup Drive" was rejected by admin for: "Event location lacks accessibility features."
```

### Without Rejection Reason
```
"{eventTitle}" was rejected by admin
```

**Example**:
```
"Community Cleanup Drive" was rejected by admin
```

## Benefits

### Immediate Visibility
- ✅ No need to click through events
- ✅ Rejection reasons visible on dashboard
- ✅ Quick understanding of issues
- ✅ Saves time and clicks

### Clear Communication
- ✅ Event name in quotes for clarity
- ✅ Reason in italic for distinction
- ✅ Admin attribution clear
- ✅ Actionable feedback upfront

### Better UX
- ✅ Red color indicates urgency
- ✅ Clickable banner for more details
- ✅ Smooth navigation to rejected events
- ✅ Responsive across devices

### Reduced Support Tickets
- ✅ NGOs see reasons immediately
- ✅ Don't need to ask "why rejected?"
- ✅ Self-service information access
- ✅ Transparent process

## Edge Cases Handled

### 1. **No Rejected Events**
- Banner doesn't render at all
- Clean dashboard without unnecessary alerts
- Conditional rendering: `{rejectedEvents.length > 0 && ...}`

### 2. **Multiple Rejected Events**
- All events listed with dividers
- Each gets its own line with reason
- Proper spacing and readability
- Border separators between events

### 3. **Long Rejection Reasons**
- Text wraps naturally
- Maintains readability
- Container expands to fit content
- No text truncation

### 4. **Events Without Rejection Reasons**
- Shows generic message
- No empty space or "undefined"
- Graceful fallback
- Backward compatible

### 5. **Mixed: Some with Reasons, Some Without**
```tsx
{event.rejectionReason && (
  <span>... reason display ...</span>
)}
```
Only shows reason if it exists for that specific event.

## Responsive Design

### Mobile View
- Banner takes full width
- Text wraps appropriately
- Icon remains visible
- Padding adjusted for touch targets

### Tablet View
- Similar to mobile with better spacing
- Multi-column layout if needed
- Maintains readability

### Desktop View
- Full banner width
- Optimal spacing
- Clear visual hierarchy
- Hover effects work smoothly

## Accessibility

### Visual Indicators
- ✅ Red color for rejection (universal warning color)
- ✅ Icon for non-color-dependent indication
- ✅ Bold text for headings
- ✅ Clear font sizing

### Interactive Elements
- ✅ Cursor pointer on hover
- ✅ Focus states (can be enhanced)
- ✅ Click handler for navigation
- ✅ Semantic HTML structure

### Screen Readers
- AlertCircle/XCircle icons provide context
- Clear text descriptions
- Proper heading hierarchy
- Can be enhanced with ARIA labels

## Testing Checklist

### Visual Tests
- [x] Banner displays when events rejected
- [x] Banner hidden when no rejected events
- [x] Red color scheme applied
- [x] Icon displays correctly
- [x] Text is readable
- [x] Multiple events show with dividers
- [ ] Hover effect works
- [ ] Responsive on mobile/tablet/desktop

### Functional Tests
- [x] Banner click navigates to rejected tab (NGO Dashboard)
- [x] Banner click filters and scrolls (Entity Dashboard)
- [x] Rejection reasons display correctly
- [x] Events without reasons show generic message
- [ ] Long reasons wrap properly
- [ ] Multiple events all visible

### Integration Tests
- [ ] Banner appears immediately after event rejection
- [ ] Banner disappears when all rejected events deleted
- [ ] Banner updates when event re-approved
- [ ] Rejection reasons sync from backend
- [ ] Click navigation works smoothly

## Files Modified

1. **frontend/app/ngo-dashboard/page.tsx**
   - Added `rejectedEvents` filter
   - Added rejection banner with reasons
   - Added click handler to switch to rejected tab

2. **frontend/components/Ngoeventtable.tsx**
   - Added `rejectedEvents` filter
   - Added rejection banner with reasons
   - Added `handleRejectedBannerClick` function
   - Smooth scroll integration

3. **frontend/contexts/events-context.tsx**
   - Added `rejectionReason?: string` to Event interface

## Related Features

### Existing Modal Display
The modal still shows rejection reason (from previous implementation):
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

Now NGOs see rejection information in **two places**:
1. **Dashboard Banner** - Immediate overview
2. **Event Modal** - Detailed view with full context

## Future Enhancements

### 1. **Dismissible Banners**
- Add close button to banner
- Store dismissed state in localStorage
- Don't show again for specific events
- Re-show if new rejections occur

### 2. **Action Buttons in Banner**
- "Delete All Rejected" button
- "View Details" for quick navigation
- "Appeal" button (if appeal system added)

### 3. **Grouped Notifications**
- Group by rejection reason category
- Show common reasons together
- Help identify patterns

### 4. **Animation**
- Slide-in animation when banner appears
- Fade-out when dismissed
- Smooth transitions

### 5. **Email Integration**
- "Email me these details" button
- Auto-send rejection summary
- Keep record of rejections

### 6. **Learning Resources**
- Link to guidelines based on rejection reason
- "Learn More" buttons
- Help articles for common issues

## Summary

This enhancement transforms the rejection notification system from a passive display to an active, informative dashboard feature. NGOs now see:

**Dashboard Level**:
- 🔴 Red alert banner with count
- 📋 List of all rejected events
- 💬 Rejection reason for each event
- 🖱️ Clickable for quick navigation

**Modal Level** (unchanged):
- 📄 Detailed rejection information
- 🎨 Highlighted reason box
- 📝 Full event context

The implementation provides:
- ✅ **Immediate visibility** - See rejections on dashboard load
- ✅ **Clear communication** - Reasons shown inline with event names
- ✅ **Easy navigation** - Click banner to view/manage rejected events
- ✅ **Better UX** - No need to check each event individually
- ✅ **Transparency** - Full disclosure of admin decisions
- ✅ **Actionable** - NGOs know exactly what to fix

NGOs can now efficiently manage rejected events with full context about why they were rejected, leading to faster improvements and resubmissions.
