# Event Type Feature Implementation

## Summary
Added an "Event Type" field to the event creation form with three options:
- Community Event
- Virtual Event
- In-Person Event

This field is now stored in the database and required for all new events.

## Changes Made

### Backend Changes

#### 1. Database Model (`backend/src/models/Event.js`)
- Added new `eventType` field to the Event schema
- Field type: String (enum)
- Allowed values: `community`, `virtual`, `in-person`
- Default value: `community`
- Required: Yes

```javascript
eventType: {
  type: String,
  enum: {
    values: ["community", "virtual", "in-person"],
    message: "{VALUE} is not a valid event type",
  },
  required: [true, "Event type is required"],
  default: "community",
}
```

#### 2. Service Layer (`backend/src/services/ngoEvent.service.js`)
- Updated `createEvent` function to accept and process `eventType` parameter
- Added default value `"community"` if not provided
- Included `eventType` in the event creation

#### 3. Validation (`backend/src/validators/community.validators.js`)
- Added validation for `eventType` field in `createEventValidator`
- Validates that the value is one of: `community`, `virtual`, or `in-person`
- Field is optional (falls back to default)

### Frontend Changes

#### 1. Form Component (`frontend/app/add-event/page.tsx`)
- Added `eventType` to TypeScript type definition `EventFormData`
- Added default value `"community"` in form initialization
- Added new select field in the Event Details section with three options:
  - Community Event
  - Virtual Event
  - In-Person Event
- Updated form submission to include `eventType` in the data sent to backend
- Updated grid layout from 2 columns to 3 columns to accommodate the new field
- Adjusted image field to span 3 columns (md:col-span-3)

#### 2. Form Layout
The Event Details section now displays fields in a 3-column grid on medium+ screens:
- Row 1: Category | Event Status | Event Type
- Row 2: Max Participants | Points Offered
- Row 3: Event Image (spans all 3 columns)

## Usage

When creating a new event:
1. Navigate to the event creation page
2. Fill in all required fields
3. Select the Event Type from the dropdown:
   - **Community Event**: For community-based volunteer activities
   - **Virtual Event**: For online/remote volunteer opportunities
   - **In-Person Event**: For physical, on-site volunteer events
4. Submit the form

The event type will be stored in the database and can be used for:
- Filtering events by type
- Displaying appropriate icons/badges
- Sending targeted notifications
- Analytics and reporting

## Database Migration Note

For existing events in the database that don't have an `eventType`:
- The schema has a default value of `"community"`
- Existing events will automatically use this default when accessed
- No manual migration script is required

## Future Enhancements

Potential improvements:
1. Add event type filter on event listing pages
2. Display event type badges/icons on event cards
3. Add statistics/analytics based on event types
4. Allow users to search/filter by event type
5. Add appropriate icons for each event type (e.g., globe for virtual, location pin for in-person)
