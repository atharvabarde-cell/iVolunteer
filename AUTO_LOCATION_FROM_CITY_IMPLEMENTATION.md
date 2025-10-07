# Auto-populate Event Location from Organization City

## Summary
Modified the event creation system to automatically use the city from the organization's profile as the event location, instead of requiring users to manually enter it.

## Changes Made

### Backend Changes

#### 1. Controller Update (`backend/src/controllers/ngoEvent.controller.js`)
Updated the `addEvent` controller to automatically extract and use the city from the user's profile:

```javascript
export const addEvent = asyncHandler(async (req, res) => {
  const organizationId = req.user._id;
  const organizationName = req.user.name;
  
  // Get city from the user's profile based on their role
  let city;
  if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    city = req.user.address?.city;
  } else {
    city = req.user.city;
  }

  // Ensure city exists
  if (!city) {
    return res.status(400).json({
      success: false,
      message: "City information not found in your profile. Please update your profile with city information.",
    });
  }

  const eventData = {
    ...req.body,
    organizationId,
    organization: organizationName,
    location: city, // Automatically set location to the organization's city
  };

  const event = await ngoEventService.createEvent(
    eventData,
    organizationId,
    organizationName
  );

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});
```

**Key Features:**
- Automatically detects user role (NGO/Corporate vs. regular user)
- For NGO/Corporate: Uses `address.city` field
- For regular users: Uses `city` field
- Validates that city exists before proceeding
- Returns clear error message if city is not found in profile

#### 2. Database Model (`backend/src/models/Event.js`)
No changes needed. The `location` field remains in the schema and will be populated by the backend.

### Frontend Changes

#### 1. Form Component (`frontend/app/add-event/page.tsx`)
- **Removed** the Location input field from the UI
- **Removed** `location` from the `EventFormData` TypeScript type
- **Removed** location validation from form
- **Removed** `MapPin` icon import (no longer needed)
- **Removed** location from form submission data

The location is now automatically handled by the backend, so users don't see or interact with this field.

#### 2. Context Types Updated

**a. NGO Context (`frontend/contexts/ngo-context.tsx`)**
```typescript
export type EventData = {
  _id?: string; 
  title: string;
  description: string;
  location?: string; // Made optional - auto-populated from organization city
  date: string;
  time: string;
  duration: number;
  category: string;
  participants: string[];
  maxParticipants: number;
  pointsOffered: number;
  requirements: string[];
  sponsorshipRequired: boolean;
  sponsorshipAmount: number;
  image?: { url: string; caption: string };
  eventStatus: string;
  eventType?: string;
  organization?: string;
  organizationId?: { ... };
};
```

**b. Events Context (`frontend/contexts/events-context.tsx`)**
```typescript
export interface Event {
  id: string;
  title: string;
  organization: string;
  organizationId: string;
  location?: string; // Made optional
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  coins: number;
  description: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  applications: string[];
  eventType?: string;
}
```

**c. Corporate Context (`frontend/contexts/corporate-context.tsx`)**
```typescript
interface Opportunity {
  title: string;
  description: string;
  image: string;
  date: string;
  location?: string; // Made optional
  participants: string;
  goal: string;
  category: string;
  featured: boolean;
  eventType?: string;
}
```

## User Flow

### Before (Old Flow)
1. User navigates to event creation form
2. Fills in all fields including **Location**
3. Submits the form
4. Location is stored as entered

### After (New Flow)
1. User navigates to event creation form
2. Fills in all fields (Location field is **not visible**)
3. Submits the form
4. Backend automatically:
   - Extracts city from user's profile
   - Validates city exists
   - Sets event location to that city
   - Creates the event

## Error Handling

If a user tries to create an event but doesn't have city information in their profile:

**Error Response:**
```json
{
  "success": false,
  "message": "City information not found in your profile. Please update your profile with city information."
}
```

**User Action Required:**
1. Update their profile
2. Add city information:
   - For NGO/Corporate: Fill in `address.city`
   - For regular users: Fill in `city`
3. Try creating the event again

## Database Structure

### User Model - City Fields

**For Regular Users (Volunteers):**
```javascript
city: {
  type: String,
  required: function() { return this.role === 'user'; },
  trim: true,
  minlength: [2, "City name must be at least 2 characters"],
  maxlength: [100, "City name cannot exceed 100 characters"]
}
```

**For NGO/Corporate:**
```javascript
address: {
  street: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  city: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  state: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  zip: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  country: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; }, default: "India" }
}
```

### Event Model - Location Field
```javascript
location: {
  type: String,
  required: [true, "Event location is required"],
  trim: true,
}
```

The location field remains required in the Event model but is now automatically populated by the backend.

## Benefits

1. **Consistency**: All events from an organization will have consistent location (their city)
2. **Simplicity**: Reduced form complexity for users
3. **Data Integrity**: Location always matches the organization's registered city
4. **User Experience**: Fewer fields to fill = faster event creation
5. **Accuracy**: Eliminates typos or inconsistent location entries

## Future Enhancements

Potential improvements:
1. Allow adding specific venue/address while keeping the city from profile
2. Add a "Virtual Event" option that doesn't require physical location
3. Display organization's city on the form as informational text
4. Allow override for special cases (with admin approval)
5. Add location-based event filtering using the organization's city

## Testing Checklist

- [ ] NGO user creates event (location should be from address.city)
- [ ] Corporate user creates event (location should be from address.city)
- [ ] Regular user creates event (location should be from city field)
- [ ] User without city tries to create event (should show error)
- [ ] Event displays correct location on frontend
- [ ] Existing events with manual locations still work
- [ ] Location filtering works correctly

## Migration Notes

**For Existing Events:**
- No migration needed
- Existing events retain their manually entered locations

**For New Events:**
- All new events will automatically use the organization's city
- Organizations must have city in their profile to create events

## Related Files Modified

### Backend
- `backend/src/controllers/ngoEvent.controller.js`

### Frontend
- `frontend/app/add-event/page.tsx`
- `frontend/contexts/ngo-context.tsx`
- `frontend/contexts/events-context.tsx`
- `frontend/contexts/corporate-context.tsx`
