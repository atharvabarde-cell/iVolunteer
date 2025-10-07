# Entity Dashboard - Pending Events Status Display

## Quick Summary
Updated the **Entity Dashboard (Ngoeventtable component)** to display pending/approved/rejected status for all events created by the NGO.

## Changes Made

### Component: `frontend/components/Ngoeventtable.tsx`

#### 1. Updated Interface
```typescript
// BEFORE
interface EventItem {
  status: "Open" | "Ongoing" | "Full" | "pending" | "approved" | "rejected";
}

// AFTER
interface EventItem {
  status: "pending" | "approved" | "rejected";  // Admin approval status
  displayStatus: "Open" | "Ongoing" | "Full";   // Event state for approved events
}
```

#### 2. Added Icons
```typescript
import { 
  CheckCircle, Clock, Users, ChevronDown, Search, Filter, Calendar, 
  AlertCircle,  // 🆕 For pending status
  XCircle       // 🆕 For rejected status
} from "lucide-react";
```

#### 3. Added Pending Events Alert Banner
```tsx
{pendingCount > 0 && (
  <div 
    onClick={() => setFilter("pending")}
    className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors"
  >
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-yellow-900 mb-1">
          {pendingCount} Event{pendingCount > 1 ? 's' : ''} Awaiting Approval
        </h4>
        <p className="text-sm text-yellow-800">
          You have {pendingCount} event{pendingCount > 1 ? 's' : ''} pending admin approval.
          <span className="font-semibold ml-1">Click to view details.</span>
        </p>
      </div>
    </div>
  </div>
)}
```
- **Interactive**: Clicking the banner filters the table to show only pending events
- **Visual feedback**: Hover effect (`hover:bg-yellow-100`) indicates it's clickable
- **Clear CTA**: "Click to view details" text prompts user action

#### 4. Updated Status Badge Rendering
```tsx
// Priority order: pending → rejected → approved (Full/Ongoing/Open)
<td className="p-4">
  {event.status === "pending" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
      <AlertCircle className="w-3.5 h-3.5" /> Pending
    </span>
  ) : event.status === "rejected" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
      <XCircle className="w-3.5 h-3.5" /> Rejected
    </span>
  ) : event.displayStatus === "Full" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
      <CheckCircle className="w-3.5 h-3.5" /> Full
    </span>
  ) : event.displayStatus === "Ongoing" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
      <Clock className="w-3.5 h-3.5" /> Ongoing
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
      <Users className="w-3.5 h-3.5" /> Open
    </span>
  )}
</td>
```

#### 5. Filter Buttons
The component already had filter buttons for:
- **All** - Shows all events
- **Open** - Shows only open approved events
- **Pending** - Shows only pending events
- **Approved** - Shows only approved events
- **Rejected** - Shows only rejected events

These now work correctly with the updated status system.

## Visual Status Indicators

### Status Badges:
1. 🟡 **Pending** - Yellow badge with AlertCircle icon
2. 🔴 **Rejected** - Red badge with XCircle icon
3. 🟢 **Full** - Green badge with CheckCircle icon (approved & at capacity)
4. 🔵 **Ongoing** - Blue badge with Clock icon (approved & currently happening)
5. 🟢 **Open** - Emerald badge with Users icon (approved & accepting volunteers)

### Alert Banner:
- Yellow background with border
- Shows count of pending events
- Explains approval requirement
- **Clickable** - filters to pending events when clicked
- **Hover effect** - visual feedback showing interactivity
- Only displays when there are pending events

## User Experience

### Before:
- Events showed "Open", "Ongoing", or "Full" status
- No clear indication of admin approval status
- Pending events mixed with approved events
- No visual alert for pending events

### After:
- Clear status hierarchy: Approval status takes priority
- **Clickable yellow alert banner** when pending events exist
- **Click banner** to automatically filter to pending events
- Color-coded status badges for quick identification
- Filter buttons work correctly with approval status
- NGOs can easily see which events need admin approval
- Seamless navigation from alert to event details

## Testing

✅ Pending events show yellow "Pending" badge
✅ Rejected events show red "Rejected" badge  
✅ Approved events show appropriate status (Open/Ongoing/Full)
✅ Alert banner appears when pending events exist
✅ **Alert banner is clickable with hover effect**
✅ **Clicking banner filters table to pending events**
✅ Filter buttons correctly filter by status
✅ Status badges have correct colors and icons
✅ Navigation between banner and events is seamless

## Integration

This component is used in:
- **Entity Dashboard** (`frontend/app/dashboard/page.tsx` - NGODashboard section)
- Displays all events created by the logged-in NGO
- Works alongside the NGO Dashboard (`frontend/app/ngo-dashboard/page.tsx`)

Both dashboards now properly display pending/approved/rejected status for event creators!
