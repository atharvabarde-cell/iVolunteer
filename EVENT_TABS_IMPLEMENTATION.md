# Event Tabs Implementation

## Overview
This document describes the implementation of tabbed sections in the events page (volunteer page) to categorize events by type: Virtual, In-Person, and Community.

## Changes Made

### Frontend Changes

#### File: `frontend/app/volunteer/page.tsx`

##### 1. Import Updates
- Added `useMemo` for memoized filtering
- Added new icons: `Video`, `Building`, `Globe`, `RefreshCcw`
- Added `Button` component from UI library

```typescript
import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  UserPlus,
  Video,
  Building,
  Globe,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
```

##### 2. State Management
Added new state variables for tab management:

```typescript
const [activeTab, setActiveTab] = useState<'virtual' | 'in-person' | 'community'>('virtual');
const [isRefreshing, setIsRefreshing] = useState(false);
```

##### 3. Event Filtering Logic
Implemented memoized filtering based on active tab:

```typescript
// Filter events based on active tab
const filteredEvents = useMemo(() => {
  return events.filter(event => {
    const eventType = event.eventType?.toLowerCase() || 'community';
    return eventType === activeTab;
  });
}, [events, activeTab]);
```

##### 4. Event Count Statistics
Added event counts for each category:

```typescript
const eventCounts = useMemo(() => {
  return {
    virtual: events.filter(e => (e.eventType?.toLowerCase() || 'community') === 'virtual').length,
    'in-person': events.filter(e => (e.eventType?.toLowerCase() || 'community') === 'in-person').length,
    community: events.filter(e => (e.eventType?.toLowerCase() || 'community') === 'community').length,
  };
}, [events]);
```

##### 5. Refresh Handler
Implemented refresh functionality for events:

```typescript
const handleRefresh = async () => {
  setIsRefreshing(true);
  await fetchAvailableEvents();
  setTimeout(() => setIsRefreshing(false), 500);
};
```

##### 6. Tab Navigation UI
Created tabbed navigation matching the posts page design:

```tsx
<div className="flex justify-center mb-8">
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-primary/10">
    <div className="flex gap-2">
      <button
        onClick={() => setActiveTab('virtual')}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === 'virtual'
            ? 'bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg'
            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Video className="w-4 h-4 inline mr-2" />
        Virtual
      </button>
      <button
        onClick={() => setActiveTab('in-person')}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === 'in-person'
            ? 'bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg'
            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Building className="w-4 h-4 inline mr-2" />
        In-Person
      </button>
      <button
        onClick={() => setActiveTab('community')}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          activeTab === 'community'
            ? 'bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg'
            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Globe className="w-4 h-4 inline mr-2" />
        Community
      </button>
    </div>
  </div>
</div>
```

##### 7. Stats Section
Added visual statistics cards for each event type:

```tsx
<section className="mb-12 flex gap-4 justify-center flex-wrap">
  <div className="flex-1 max-w-xs flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform duration-300">
    <Video className="w-6 h-6 mb-2" />
    <span className="text-xl font-bold">{eventCounts.virtual}</span>
    <span className="text-sm uppercase">Virtual Events</span>
  </div>
  <div className="flex-1 max-w-xs flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:scale-105 transition-transform duration-300">
    <Building className="w-6 h-6 mb-2" />
    <span className="text-xl font-bold">{eventCounts['in-person']}</span>
    <span className="text-sm uppercase">In-Person Events</span>
  </div>
  <div className="flex-1 max-w-xs flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg hover:scale-105 transition-transform duration-300">
    <Globe className="w-6 h-6 mb-2" />
    <span className="text-xl font-bold">{eventCounts.community}</span>
    <span className="text-sm uppercase">Community Events</span>
  </div>
</section>
```

##### 8. Refresh Button
Added refresh button for manual event reload:

```tsx
<div className="flex justify-center mb-8">
  <Button
    variant="outline"
    size="sm"
    onClick={handleRefresh}
    disabled={loading || isRefreshing}
    className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all duration-300"
  >
    <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    Refresh Events
  </Button>
</div>
```

##### 9. Empty State per Tab
Implemented empty state for each tab when no events are available:

```tsx
{filteredEvents.length === 0 && (
  <div className="text-center py-12">
    <div className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
      <div className="text-gray-400 text-5xl mb-4">
        {activeTab === 'virtual' ? '💻' : activeTab === 'in-person' ? '🏢' : '🌍'}
      </div>
      <h2 className="text-gray-600 text-xl font-semibold mb-2">
        No {activeTab === 'virtual' ? 'Virtual' : activeTab === 'in-person' ? 'In-Person' : 'Community'} Events
      </h2>
      <p className="text-gray-500">
        There are currently no {activeTab} events available. Check other tabs or come back later.
      </p>
    </div>
  </div>
)}
```

##### 10. Events Grid Update
Updated events grid to use `filteredEvents` instead of `events`:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredEvents.map((event) => {
    // ... existing event card code
  })}
</div>
```

##### 11. UI Enhancements
- Updated background gradient: `bg-gradient-to-br from-blue-50 via-white to-emerald-50`
- Modernized header title with gradient text
- Updated "My Events" button with gradient and hover effects
- Added backdrop blur effects to cards
- Improved loading spinner color to use primary color

## Features

### Automatic Event Categorization
Events are automatically filtered into three tabs based on their `eventType` field:
- **Virtual Events**: Events with `eventType: "virtual"`
- **In-Person Events**: Events with `eventType: "in-person"`
- **Community Events**: Events with `eventType: "community"`

### Default Tab
- The page opens with the **Virtual** tab selected by default
- Users can switch between tabs to view different event categories

### Event Statistics
Each tab shows:
- Total count of events in that category
- Color-coded stats cards:
  - Blue gradient for Virtual events (💻)
  - Green gradient for In-Person events (🏢)
  - Purple gradient for Community events (🌍)

### Refresh Functionality
- Manual refresh button to reload events
- Animated spinner during refresh
- Disabled state during loading

### Empty States
- Each tab has a customized empty state when no events are available
- Emoji icons differentiate between event types
- Helpful message guides users to check other tabs

## User Experience

### Tab Selection
1. User clicks on a tab (Virtual, In-Person, or Community)
2. Active tab is highlighted with gradient background
3. Events are automatically filtered to show only that type
4. Stats cards update to show current counts
5. Empty state appears if no events of that type exist

### Visual Feedback
- Active tab: Gradient background (primary to emerald-600)
- Inactive tabs: Gray text with hover effects
- Smooth transitions (300ms duration)
- Hover scale effect on stats cards (1.05x)
- Refresh button shows spinning icon during operation

## Design Pattern
This implementation follows the same design pattern as the posts page:
- Similar tab navigation structure
- Matching color schemes and gradients
- Consistent button styles
- Similar empty state designs
- Same backdrop blur and shadow effects

## Data Flow
1. All events are fetched from backend via `fetchAvailableEvents()`
2. Events are stored in context state (`events` array)
3. `filteredEvents` is computed based on `activeTab` state
4. Event counts are computed for all three categories
5. UI displays filtered events and statistics

## Dependencies
- React hooks: `useState`, `useEffect`, `useMemo`
- Lucide React icons: `Video`, `Building`, `Globe`, `RefreshCcw`, etc.
- Contexts: `auth-context`, `ngo-context`
- UI components: `Button` from shadcn/ui
- Next.js router for navigation

## Benefits
1. **Better Organization**: Events are clearly categorized by type
2. **Improved UX**: Users can easily find the type of event they're looking for
3. **Visual Clarity**: Stats cards provide quick overview of available events
4. **Automatic Filtering**: No manual filtering required - events are automatically categorized
5. **Consistent Design**: Matches existing posts page tab pattern
6. **Performance**: Memoized filtering prevents unnecessary re-computations

## Notes
- Default eventType fallback is 'community' for backward compatibility
- Case-insensitive eventType comparison (using `toLowerCase()`)
- Tab state is client-side only (not persisted)
- Empty states guide users to explore other tabs
- Responsive design maintained across all screen sizes
