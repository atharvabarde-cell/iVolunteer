# Pending Events Display for Event Creators

## Summary
Implemented a feature that allows NGOs/event creators to see their events in different states (pending, approved, rejected) on both the **NGO Dashboard** and the **Entity Dashboard (Ngoeventtable component)**. Event creators can now track the approval status of their events before they go live.

## Problem
Previously, when an NGO created an event, it would go to the admin for approval but the event creator couldn't easily see which events were still pending approval versus which were approved and live.

## Solution
Enhanced both the NGO Dashboard and Entity Dashboard with:
1. **Tabbed interface** (NGO Dashboard) to organize events by status
2. **Visual status indicators** with color-coded badges
3. **Clickable alert banners** at the top when there are pending events
4. **Filter buttons** to view events by status
5. **Clear status differentiation** between pending/approved/rejected
6. **Interactive navigation** - clicking the banner automatically shows pending events

## Changes Made

### Frontend Changes

#### 1. File: `frontend/app/ngo-dashboard/page.tsx`

**Added:**
- Import for `AlertCircle` icon and `Tabs` component
- Event filtering by status (pending, approved, rejected)
- State management for active tab (`activeTab`)
- Tabbed navigation with 4 tabs:
  - **All Events**: Shows all events regardless of status
  - **Pending**: Shows only events awaiting admin approval
  - **Approved**: Shows only approved/live events
  - **Rejected**: Shows only rejected events
- **Clickable alert banner** at the top of the page when there are pending events
- Alert message within each pending event card
- Disabled "View Applications" button for pending events

**Key Features:**

1. **Clickable Alert Banner**
   ```tsx
   {pendingEvents.length > 0 && (
     <div 
       onClick={() => setActiveTab("pending")}
       className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-yellow-100 transition-colors"
     >
       <div className="flex items-start gap-3">
         <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
         <div className="flex-1">
           <h4 className="font-semibold text-yellow-900 mb-1">
             {pendingEvents.length} Event{pendingEvents.length > 1 ? 's' : ''} Pending Approval
           </h4>
           <p className="text-sm text-yellow-800">
             You have {pendingEvents.length} event{pendingEvents.length > 1 ? 's' : ''} waiting for admin approval.
             <span className="font-semibold ml-1">Click to view details.</span>
           </p>
         </div>
       </div>
     </div>
   )}
   ```
   - **Interactive**: Clicking switches to "Pending" tab
   - **Visual feedback**: Hover effect shows it's clickable
   - **Clear CTA**: Text indicates "Click to view details"

2. **Controlled Tabs with State**
   ```tsx
   const [activeTab, setActiveTab] = useState("all")
   
   <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
   ```
   - Tabs are controlled via state
   - Banner click updates the active tab
   - Seamless navigation experience

3. **Tabbed Interface**
   - Shows count of events in each category
   - Easy navigation between different event statuses
   - Clear visual separation

4. **Per-Event Status Indicators**
   - Status badges (Pending/Approved/Rejected) with color coding
   - Yellow alert box in pending event cards
   - Disabled application viewing for pending events

#### 2. File: `frontend/components/Ngoeventtable.tsx`

**Added:**
- Import for `AlertCircle` and `XCircle` icons
- Separated `status` (pending/approved/rejected) from `displayStatus` (Open/Ongoing/Full)
- **Clickable alert banner** at the top showing pending events count
- Updated status badge rendering to prioritize approval status
- Enhanced status badge with proper icons and colors

**Key Features:**

1. **Clickable Alert Banner**
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
   - **Interactive**: Clicking filters to show only pending events
   - **Visual feedback**: Hover effect shows it's clickable
   - **Clear CTA**: Text indicates "Click to view details"

2. **Dual Status System**
   ```typescript
   interface EventItem {
     status: "pending" | "approved" | "rejected";  // Admin approval status
     displayStatus: "Open" | "Ongoing" | "Full";   // Event state (for approved events)
     // ... other fields
   }
   ```

3. **Status Badge Hierarchy**
   - First checks if event is `pending` or `rejected`
   - Then shows `displayStatus` (Open/Ongoing/Full) for approved events
   - Color-coded badges:
     - 🟡 **Pending** (yellow) - Awaiting admin approval
     - 🔴 **Rejected** (red) - Rejected by admin
     - 🟢 **Full** (green) - Approved and at capacity
     - 🔵 **Ongoing** (blue) - Approved and currently happening
     - 🟢 **Open** (emerald) - Approved and accepting volunteers

4. **Filter Buttons with Interactive Banner**
   - Filter buttons for: all, open, pending, approved, rejected
   - Banner click automatically sets filter to "pending"
   - Filters events based on approval status

## User Flow

### For Event Creators (NGOs):

1. **Create Event**
   - NGO creates an event through the event creation form
   - Event is saved with `status: "pending"`
   - Event appears in the "Pending" tab on NGO Dashboard

2. **View Pending Events**
   - NGO sees a **clickable yellow alert banner** indicating pending events
   - **Click the banner** to automatically switch to "Pending" tab (NGO Dashboard) or filter to pending events (Entity Dashboard)
   - Can also manually navigate to "Pending" tab or click the "Pending" filter button
   - Each pending event shows a yellow alert: "This event is awaiting admin approval"
   - "View Applications" button is disabled for pending events (NGO Dashboard)

3. **After Admin Approval**
   - Once admin approves, event moves to "Approved" tab
   - Event becomes visible to volunteers on the public events page
   - NGO can now view applications for the event

4. **If Rejected**
   - Rejected events appear in "Rejected" tab
   - NGO can see which events were not approved

## Backend Flow (Existing - No Changes)

The backend already supports this workflow:
1. Event creation sets `status: "pending"`
2. Admin can approve/reject via `/v1/event/status/:eventId`
3. Only `status: "approved"` events are shown on public events page
4. NGOs can fetch all their events (regardless of status) via `/v1/event/organization`

## Visual Design

### Status Badge Colors:
- **Pending**: Yellow background (`bg-yellow-100 text-yellow-700`)
- **Rejected**: Red background (`bg-red-100 text-red-700`)
- **Approved (Full)**: Green background (`bg-green-100 text-green-700`)
- **Approved (Ongoing)**: Blue background (`bg-blue-100 text-blue-700`)
- **Approved (Open)**: Emerald background (`bg-emerald-100 text-emerald-700`)

### Alert Banners:
- Background: `bg-yellow-50`
- Border: `border-yellow-200`
- Icon and text: Yellow tones for consistency

## Benefits

1. **Transparency**: Event creators can see exactly which events are pending approval on both dashboards
2. **Better UX**: Clear separation and filtering of events by status
3. **Reduced Confusion**: NGOs understand why their event isn't visible to volunteers yet
4. **Easy Monitoring**: Quick glance at pending count in tabs and alert banners
5. **Professional**: Clean, organized interface with proper visual hierarchy
6. **Flexible Views**: Two different dashboard views (tabbed and table) for different use cases

## Future Enhancements (Optional)

1. Add timestamps showing when event was submitted for approval
2. Add ability to edit pending events
3. Add notifications when event status changes
4. Show rejection reasons if admin provides them
5. Add ability to resubmit rejected events

## Testing Checklist

- [x] Pending events appear in "Pending" tab
- [x] Approved events appear in "Approved" tab
- [x] Rejected events appear in "Rejected" tab
- [x] All events appear in "All Events" tab
- [x] Alert banner shows when pending events exist
- [x] Alert banner doesn't show when no pending events
- [x] Status badges show correct colors
- [x] "View Applications" is disabled for pending events
- [x] Tab counts are accurate
- [x] Empty state messages show correctly for each tab
