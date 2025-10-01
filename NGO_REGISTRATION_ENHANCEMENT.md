# NGO Registration Enhancement

## Overview
This document outlines the enhancements made to the NGO registration system to collect comprehensive organization information during signup with real-time validation.

## New NGO Registration Fields

### Required Fields (when role = "ngo")
- **Organization Name**: Name of the NGO/organization (instead of "Full Name")
- **Organization Type**: Non-profit, Charity, Foundation, Trust, Society, Other
- **Contact Number**: Valid phone number with minimum 10 digits
- **Address**: Complete address including street, city, state, zip, and country
- **Organization Description**: Detailed description with minimum 10 words (10-1000 characters)
- **Focus Areas**: At least one area from the predefined list
- **Organization Size**: Number of employees/volunteers (1-10, 11-50, 51-100, 101-500, 500+)

### Optional Fields
- **Website or Social Media URL**: Organization's website or social media link (can be left empty)
- **Year Established**: Year when the organization was founded (1800 - current year validation)

### Focus Areas Options
- Environment
- Education  
- Health
- Poverty
- Children
- Elderly
- Animal Welfare
- Disaster Relief
- Community Development
- Women Empowerment
- Skill Development
- Other

## Backend Changes

### 1. User Model Updates (`backend/src/models/User.js`)
Added new fields to the User schema:
- `organizationType`: Enum field with validation
- `websiteUrl`: URL validation
- `yearEstablished`: Number validation (1800 - current year)
- `contactNumber`: Phone number validation
- `address`: Nested object with street, city, state, zip, country
- `ngoDescription`: Text field with length validation
- `focusAreas`: Array of predefined focus areas
- `organizationSize`: Enum for organization size ranges

All NGO-specific fields are conditionally required based on role.

### 2. Auth Service Updates (`backend/src/services/auth.service.js`)
Enhanced the `register` function to:
- Handle additional NGO-specific fields during user creation
- Maintain existing functionality for other user roles
- Include all new fields in the user data object when role is 'ngo'

### 3. Validation Schema Updates (`backend/src/validators/auth.validators.js`)
Enhanced the `registerSchema` with:
- **Relaxed password requirements**: Removed the requirement for numbers and letters
- **Truly optional websiteUrl**: Allows empty strings and validates only when provided
- **Flexible URL validation**: Accepts both website URLs and social media URLs
- Conditional validation using Joi.when() for NGO-specific fields
- Proper validation rules for each new field type
- Comprehensive error messages for better user experience
- Role-based field requirements

### 4. Route Validation (`backend/src/routes/auth.routes.js`)
Added validation middleware to registration and login routes:
- Import validation middleware and auth validators
- Apply `registerSchema` validation to the `/register` endpoint
- Apply `loginSchema` validation to the `/login` endpoint

## Frontend Changes

### 1. Form Type Updates (`frontend/app/auth/page.tsx`)
Extended the `FormValues` interface to include:
- All new NGO-specific fields
- Proper TypeScript typing for nested objects and arrays
- Optional field markers for non-required fields

### 2. Dynamic Form Fields
Added conditional form sections that appear when "NGO" role is selected:
- **Organization Type**: Dropdown with predefined options
- **Website or Social Media URL**: URL input that accepts empty values
- **Year Established & Contact Number**: Side-by-side inputs
- **Address**: Multi-field address form with street, city, state, zip, country
- **Organization Description**: Textarea with character limit
- **Focus Areas**: Checkbox grid with all available focus areas
- **Organization Size**: Dropdown with size ranges

### 3. Form Validation
Implemented comprehensive real-time client-side validation:
- **Organization Name**: Dynamic label changes based on role selection
- **Year Established**: Real-time validation against current year (1800-current year)
- **Contact Number**: Real-time validation for minimum 10 digits with proper format
- **ZIP Code**: India-specific validation (6 digits) vs international formats
- **Description**: Real-time word count with minimum 10 words requirement
- **Character Limits**: Visual feedback for description length
- **URL Validation**: Format validation for website/social media URLs only when provided

### 4. Auth Context Updates (`frontend/contexts/auth-context.tsx`)
Modified the signup function to:
- Accept a single data object instead of individual parameters
- Handle the new NGO-specific fields
- Maintain backward compatibility

## Database Structure

### User Collection Schema
```javascript
{
  // Existing fields
  email: String,
  name: String,
  password: String,
  role: String,
  coins: Number,
  points: Number,
  // ... other existing fields
  
  // New NGO-specific fields
  organizationType: String, // required for NGOs
  websiteUrl: String, // optional
  yearEstablished: Number, // optional
  contactNumber: String, // required for NGOs
  address: { // required for NGOs
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  ngoDescription: String, // required for NGOs
  focusAreas: [String], // required for NGOs
  organizationSize: String // required for NGOs
}
```

## Testing

### Test Script (`test-ngo-registration.mjs`)
Created a comprehensive test script that:
- Tests NGO registration with all new fields
- Verifies successful registration and coin bonus
- Tests login functionality
- Retrieves and validates saved user data
- Confirms all fields are properly stored

### Test Data Example
```javascript
{
  name: "Green Earth Foundation",
  email: "ngo_test@example.com",
  password: "password123",
  role: "ngo",
  organizationType: "foundation",
  websiteUrl: "https://greenearth.org",
  yearEstablished: 2010,
  contactNumber: "+919876543210",
  address: {
    street: "123 Green Street",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India"
  },
  ngoDescription: "Environmental conservation organization...",
  focusAreas: ["environment", "community-development", "education"],
  organizationSize: "11-50"
}
```

## API Endpoints

### Registration Endpoint
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "NGO Name",
  "email": "ngo@example.com", 
  "password": "password123",
  "role": "ngo",
  "organizationType": "foundation",
  "contactNumber": "+919876543210",
  "address": {
    "street": "123 Street",
    "city": "City", 
    "state": "State",
    "zip": "123456",
    "country": "India"
  },
  "ngoDescription": "Organization description...",
  "focusAreas": ["environment", "education"],
  "organizationSize": "11-50",
  "websiteUrl": "https://example.org", // optional
  "yearEstablished": 2010 // optional
}
```

### Response Format
```json
{
  "user": {
    "userId": "user_id",
    "email": "ngo@example.com",
    "name": "NGO Name", 
    "role": "ngo",
    "coins": 50
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "User registered successfully! You've been awarded 50 coins as a welcome bonus!"
}
```

## Error Handling

### Validation Errors
The system provides detailed validation error messages for:
- Missing required fields for NGO role
- Invalid email formats
- Invalid URL formats
- Invalid year ranges
- Invalid phone number formats
- Invalid organization types
- Invalid focus areas
- Invalid organization sizes

### Example Error Response
```json
{
  "success": false,
  "message": "Validation error: Organization type is required for NGOs, Contact number is required for NGOs",
  "statusCode": 400
}
```

## Security Considerations

- All inputs are validated and sanitized
- Password requirements remain unchanged
- JWT token-based authentication
- Input length limits prevent data overflow
- XSS protection through input validation

## Future Enhancements

Potential future improvements:
- File upload for organization certificates
- Integration with government databases for verification
- Enhanced address validation with postal APIs
- Geolocation-based service area mapping
- Advanced NGO verification workflows

## Migration Notes

- Existing users are not affected
- New fields are only required for new NGO registrations
- Backward compatibility maintained for existing API consumers
- Database indexes may need updating for performance optimization

## Files Modified

### Backend
- `backend/src/models/User.js`
- `backend/src/services/auth.service.js` 
- `backend/src/validators/auth.validators.js`
- `backend/src/routes/auth.routes.js`

### Frontend
- `frontend/app/auth/page.tsx`
- `frontend/contexts/auth-context.tsx`

### Testing
- `test-ngo-registration.mjs` (new file)
- `NGO_REGISTRATION_ENHANCEMENT.md` (this document)