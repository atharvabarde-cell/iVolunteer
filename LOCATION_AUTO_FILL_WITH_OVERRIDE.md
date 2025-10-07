# Event Location - Auto-Fill with Override Feature

## Summary
Enhanced the event creation system to **automatically pre-fill the location field** with the organization's city from their profile, while **allowing users to change it** if needed for specific venues or addresses.

## User Experience

### How It Works:
1. User opens the event creation form
2. Location field automatically loads with their organization's city
3. User can:
   - **Keep the default** city as the location
   - **Edit/change** the location to a specific venue or address
   - **Type freely** in the location field

### Visual Indicator:
The location field label shows: `Location (Pre-filled with your city, can be changed)`

## Implementation Details

### Backend Changes

#### 1. Controller (`backend/src/controllers/ngoEvent.controller.js`)

**New `getDefaultLocation` Endpoint:**
```javascript
// Get user's default location (city) for event creation
const getDefaultLocation = asyncHandler(async (req, res) => {
  let defaultCity;
  if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    defaultCity = req.user.address?.city;
  } else {
    defaultCity = req.user.city;
  }

  if (!defaultCity) {
    return res.status(404).json({
      success: false,
      message: "No city information found in your profile. Please update your profile.",
    });
  }

  res.status(200).json({
    success: true,
    defaultLocation: defaultCity,
  });
});
```

**Updated `addEvent` Controller:**
```javascript
export const addEvent = asyncHandler(async (req, res) => {
  const organizationId = req.user._id;
  const organizationName = req.user.name;
  
  // Get default city from the user's profile based on their role
  let defaultCity;
  if (req.user.role === 'ngo' || req.user.role === 'corporate') {
    defaultCity = req.user.address?.city;
  } else {
    defaultCity = req.user.city;
  }

  // Use location from request body if provided, otherwise use default city
  const location = req.body.location || defaultCity;

  // Ensure location exists
  if (!location) {
    return res.status(400).json({
      success: false,
      message: "Location is required. Please update your profile with city information or provide a location.",
    });
  }

  const eventData = {
    ...req.body,
    organizationId,
    organization: organizationName,
    location, // Use provided location or default to organization's city
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
- Accepts `location` from request body (user input)
- Falls back to organization's city if not provided
- Validates that location exists before proceeding
- Clear error messages for missing location/city

#### 2. Routes (`backend/src/routes/event.routes.js`)

Added new route:
```javascript
// Get user's default location for event creation
eventRouter.get(
  "/default-location",
  authMiddleware,
  ngoEventController.getDefaultLocation
);
```

**Endpoint:** `GET /v1/event/default-location`
**Authentication:** Required (Bearer token)
**Response:**
```json
{
  "success": true,
  "defaultLocation": "Mumbai"
}
```

### Frontend Changes

#### 1. Form Component (`frontend/app/add-event/page.tsx`)

**Added State & Effect:**
```typescript
const [loadingLocation, setLoadingLocation] = useState(true);

// Fetch default location from user's profile
useEffect(() => {
  const fetchDefaultLocation = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      const response = await api.get("/v1/event/default-location", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const data = response.data as { success: boolean; defaultLocation: string };
      if (data.success && data.defaultLocation) {
        setValue("location", data.defaultLocation);
      }
    } catch (err) {
      console.error("Failed to fetch default location:", err);
      // Don't show error to user, just leave location empty for manual entry
    } finally {
      setLoadingLocation(false);
    }
  };

  fetchDefaultLocation();
}, [setValue]);
```

**Location Field UI:**
```tsx
{/* Location */}
<motion.div variants={itemVariants} className="group">
  <label className="block text-xs font-medium text-gray-700 mb-1.5">
    Location
    <span className="text-gray-500 text-xs ml-1 font-normal">
      (Pre-filled with your city, can be changed)
    </span>
  </label>
  <div className="relative">
    <input
      type="text"
      {...register("location", {
        required: "Location is required",
      })}
      disabled={loadingLocation}
      className="w-full rounded-xl border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-400 focus:!outline-none px-10 py-2.5 shadow-sm placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-wait"
      placeholder={loadingLocation ? "Loading your city..." : "Enter event location"}
    />
    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
  </div>
  {errors.location && (
    <p className="text-red-500 text-xs mt-1">
      {errors.location.message}
    </p>
  )}
</motion.div>
```

**Features:**
- Shows loading state while fetching default city
- Disabled input while loading (prevents typing during load)
- Informative placeholder text
- User can freely edit after loading
- MapPin icon for visual clarity
- Field remains required with validation

#### 2. TypeScript Types

**Form Data:**
```typescript
type EventFormData = {
  title: string;
  description: string;
  location: string; // Required field
  date: string;
  time: string;
  duration: number;
  category: string;
  maxParticipants: number;
  pointsOffered: number;
  requirements: string;
  sponsorshipRequired: boolean;
  sponsorshipAmount: number;
  imageUrl: string;
  imageCaption: string;
  eventStatus: string;
  eventType: string;
};
```

**Context Types Updated:**
- `ngo-context.tsx`: `location: string` (required)
- `events-context.tsx`: `location: string` (required)
- `corporate-context.tsx`: `location: string` (required)

#### 3. Form Submission

Location is included in the submitted data:
```typescript
const formattedData = {
  title: data.title,
  description: data.description,
  location: data.location, // User-entered or default city
  date: new Date(`${data.date}T${data.time}`).toISOString(),
  time: data.time,
  // ... other fields
};
```

## User Flow Examples

### Scenario 1: Using Default Location
1. Organization: "Green Earth NGO" (City: Mumbai)
2. User opens event creation form
3. Location field loads with "Mumbai"
4. User submits without changing location
5. Event created with location: "Mumbai"

### Scenario 2: Custom Location
1. Organization: "Green Earth NGO" (City: Mumbai)
2. User opens event creation form
3. Location field loads with "Mumbai"
4. User changes to "Gateway of India, Mumbai"
5. User submits
6. Event created with location: "Gateway of India, Mumbai"

### Scenario 3: No City in Profile
1. Organization has no city in profile
2. User opens event creation form
3. Location field remains empty (no default loaded)
4. User manually enters location
5. If user submits without location → Error: "Location is required..."
6. User enters location and submits → Event created

## Error Handling

### Frontend Errors:
- **Loading fails**: Field remains empty, user can manually enter
- **No default city**: Field remains empty, user must enter manually
- **Empty submission**: Validation error: "Location is required"

### Backend Errors:
- **No location provided & no city in profile**:
  ```json
  {
    "success": false,
    "message": "Location is required. Please update your profile with city information or provide a location."
  }
  ```

## Benefits

✅ **Convenience**: Auto-fills with sensible default (organization's city)
✅ **Flexibility**: Users can change to specific venue/address
✅ **Accuracy**: Reduces typos with pre-filled value
✅ **Speed**: Faster event creation for events in org's city
✅ **User Control**: Full override capability when needed
✅ **Consistency**: Events from same org likely in same city
✅ **Validation**: Still ensures location is always provided

## Use Cases

### When Default Works:
- Community events in the organization's city
- Regular meetups at standard locations
- Events without specific venue yet

### When Users Override:
- Specific venue addresses (e.g., "123 Main St, Mumbai")
- Landmark-based locations (e.g., "India Gate, New Delhi")
- Online/Virtual events (e.g., "Virtual - Zoom")
- Events in different cities than org headquarters

## Future Enhancements

Potential improvements:
1. **Google Places API** - Autocomplete for location suggestions
2. **Recent Locations** - Dropdown of recently used locations
3. **Saved Venues** - Save favorite venues for quick selection
4. **Map Integration** - Show location on map preview
5. **Location Templates** - Pre-saved location templates per organization
6. **Coordinates** - Add latitude/longitude for mapping
7. **Virtual Event Toggle** - Auto-fill "Virtual" for online events

## Related Files Modified

### Backend
- `backend/src/controllers/ngoEvent.controller.js`
- `backend/src/routes/event.routes.js`

### Frontend
- `frontend/app/add-event/page.tsx`
- `frontend/contexts/ngo-context.tsx`
- `frontend/contexts/events-context.tsx`
- `frontend/contexts/corporate-context.tsx`

## API Documentation

### Get Default Location
**Endpoint:** `GET /v1/event/default-location`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "defaultLocation": "Mumbai"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No city information found in your profile. Please update your profile."
}
```

### Create Event
**Endpoint:** `POST /v1/event/add-event`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Beach Cleanup Drive",
  "description": "Join us for a beach cleanup...",
  "location": "Juhu Beach, Mumbai", // Can be custom or default city
  "date": "2025-11-15T10:00:00.000Z",
  "time": "10:00",
  "duration": 3,
  "category": "environmental",
  "maxParticipants": 50,
  "pointsOffered": 100,
  "eventType": "in-person",
  // ... other fields
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": { /* event object */ }
}
```

## Testing Checklist

- [x] NGO with city creates event with default location
- [x] NGO with city creates event with custom location
- [x] Corporate with city creates event with default location
- [x] Corporate with city creates event with custom location
- [x] User without city sees empty location field
- [x] User without city can manually enter location
- [x] Location field shows loading state
- [x] Location field becomes editable after loading
- [x] Form validation requires location
- [x] API returns correct default location
- [x] Backend accepts custom location
- [x] Backend falls back to city if no location provided
