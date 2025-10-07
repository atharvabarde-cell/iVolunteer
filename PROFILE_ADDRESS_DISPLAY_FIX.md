# Profile Page Address Display Fix

## Issue
The profile page was only displaying the `city` field for volunteers (users with role `"user"`), but NGO and Corporate profiles did not show their address information even though it exists in their user model under the `address` object (with fields: street, city, state, zip, country).

## Solution
Added complete address display and editing functionality for NGO and Corporate profiles in the profile page.

## Changes Made

### Frontend (`frontend/app/profile/page.tsx`)

#### 1. Form Data Initialization
Added address fields to the form data state:

```typescript
setFormData({
  name: userData.name || "",
  email: userData.email || "",
  age: userData.age || "",
  city: userData.city || "",
  profession: userData.profession || "",
  // NGO fields
  organizationType: userData.organizationType || "",
  websiteUrl: userData.websiteUrl || "",
  contactNumber: userData.contactNumber || "",
  ngoDescription: userData.ngoDescription || "",
  // Corporate fields
  companyType: userData.companyType || "",
  industrySector: userData.industrySector || "",
  companyDescription: userData.companyDescription || "",
  // Address fields (for NGO and Corporate)
  addressStreet: userData.address?.street || "",
  addressCity: userData.address?.city || "",
  addressState: userData.address?.state || "",
  addressZip: userData.address?.zip || "",
  addressCountry: userData.address?.country || "India",
});
```

#### 2. NGO Profile - Address Section
Added a complete address display section after the NGO description:

```tsx
{/* Address Section for NGO */}
<div>
  <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <MapPin className="w-4 h-4 text-blue-600" />
    Organization Address
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Street Address (full width) */}
    {/* City, State, ZIP, Country fields */}
  </div>
</div>
```

**Fields Displayed:**
- Street Address (full width)
- City
- State
- ZIP Code
- Country

#### 3. Corporate Profile - Address Section
Added the same address display section for corporate profiles:

```tsx
{/* Address Section for Corporate */}
<div>
  <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <MapPin className="w-4 h-4 text-blue-600" />
    Company Address
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Street Address (full width) */}
    {/* City, State, ZIP, Country fields */}
  </div>
</div>
```

#### 4. Header Section - City Display
Updated the header badge to show city for all user types:

**Before:**
```tsx
{user.city && (
  <span className="inline-flex items-center...">
    <MapPin className="w-3 h-3 mr-1" />
    {user.city}
  </span>
)}
```

**After:**
```tsx
{((user.role === 'user' && user.city) || 
  ((user.role === 'ngo' || user.role === 'corporate') && user.address?.city)) && (
  <span className="inline-flex items-center...">
    <MapPin className="w-3 h-3 mr-1" />
    {user.role === 'user' ? user.city : user.address?.city}
  </span>
)}
```

#### 5. Save Function Update
Modified the `handleSave` function to properly format address data:

```typescript
const handleSave = async () => {
  setIsSaving(true);
  try {
    const token = localStorage.getItem("auth-token");
    
    // Prepare the data to send - format address fields for NGO and Corporate
    const dataToSend = { ...formData };
    
    if (user.role === 'ngo' || user.role === 'corporate') {
      // Convert flat address fields to nested address object
      dataToSend.address = {
        street: formData.addressStreet,
        city: formData.addressCity,
        state: formData.addressState,
        zip: formData.addressZip,
        country: formData.addressCountry,
      };
      
      // Remove the flat address fields from the data
      delete dataToSend.addressStreet;
      delete dataToSend.addressCity;
      delete dataToSend.addressState;
      delete dataToSend.addressZip;
      delete dataToSend.addressCountry;
    }
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/profile`,
      dataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // ... rest of the function
  }
};
```

**Key Logic:**
- For NGO and Corporate users, converts flat form fields (`addressStreet`, `addressCity`, etc.) into a nested `address` object
- Removes the flat fields before sending to backend
- Backend expects `address` as an object with nested properties

#### 6. Cancel Button Update
Updated the cancel button to reset address fields:

```typescript
onClick={() => {
  setIsEditing(false);
  setFormData({
    // ... other fields
    addressStreet: user.address?.street || "",
    addressCity: user.address?.city || "",
    addressState: user.address?.state || "",
    addressZip: user.address?.zip || "",
    addressCountry: user.address?.country || "India",
  });
}}
```

## User Model Structure

### Volunteer (role: "user")
```javascript
{
  city: String, // Direct field
  // ... other fields
}
```

### NGO / Corporate (role: "ngo" | "corporate")
```javascript
{
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  // ... other fields
}
```

## UI Features

### View Mode
- Address fields displayed in a 2-column grid (on medium+ screens)
- Street address spans full width
- Each field has an appropriate icon (MapPin for location fields, Globe for country)
- Shows "Not specified" for empty fields
- Gray background for read-only display

### Edit Mode
- All address fields become editable input fields
- Street address remains full width
- City, State, ZIP in first row (2 columns)
- Country in second row
- Input placeholders guide users
- Real-time updates with controlled inputs

## Visual Layout

### NGO/Corporate Profile Address Section:
```
┌────────────────────────────────────────────────┐
│ 📍 Organization/Company Address                │
├────────────────────────────────────────────────┤
│ Street Address: [123 Main Street           ]   │ (Full width)
├────────────────────┬───────────────────────────┤
│ City: [Mumbai    ] │ State: [Maharashtra   ]   │
├────────────────────┼───────────────────────────┤
│ ZIP: [400001     ] │ Country: [India       ]   │
└────────────────────┴───────────────────────────┘
```

## Benefits

✅ **Consistency**: All user types now display location information
✅ **Completeness**: Full address displayed for NGOs and Corporates
✅ **Editable**: Users can update all address fields
✅ **Visual Clarity**: Organized grid layout with icons
✅ **Data Integrity**: Proper formatting when saving to backend
✅ **User Experience**: Clear labels and placeholders

## Testing Checklist

- [x] NGO user can view complete address in profile
- [x] Corporate user can view complete address in profile
- [x] NGO user can edit address fields
- [x] Corporate user can edit address fields
- [x] Address fields save correctly to backend
- [x] Address fields reset correctly on cancel
- [x] City badge displays in header for NGO/Corporate
- [x] Empty address fields show "Not specified"
- [x] Form validation works for address fields
- [x] Address updates reflect immediately after save

## Backend Compatibility

The backend already supports the `address` object structure in the User model:

```javascript
address: {
  street: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  city: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  state: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  zip: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; } },
  country: { type: String, required: function() { return this.role === 'ngo' || this.role === 'corporate'; }, default: "India" }
}
```

No backend changes were required for this fix.

## Related Files

### Modified
- `frontend/app/profile/page.tsx` - Main profile page component

### No Changes Required
- `backend/src/models/User.js` - Already has address structure
- `backend/src/controllers/auth.controller.js` - Already handles address updates

## Future Enhancements

Potential improvements:
1. **Address Validation** - Validate ZIP code format, state names
2. **Address Autocomplete** - Google Places API integration
3. **Map Preview** - Show location on a map
4. **Address Verification** - Verify address exists
5. **Multi-language** - Support for addresses in different countries
6. **Format Templates** - Country-specific address formats
