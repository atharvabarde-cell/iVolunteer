# User Profile Page Implementation

## Overview
Added a comprehensive user profile page that allows users to view and edit their profile information. The profile page is accessible by clicking on the profile image/name in the header navbar.

## Changes Made

### Frontend Changes

#### 1. Profile Page (`frontend/app/profile/page.tsx`)
- **New file created**: Complete profile page with view and edit capabilities
- **Features**:
  - Displays user avatar with first letter of name
  - Shows user stats (Points, Coins, Volunteered Hours) for volunteers
  - Profile information display and editing based on user role
  - Role-specific fields:
    - **Volunteers (users)**: age, city, profession
    - **NGOs**: organization type, website, contact number, description, focus areas
    - **Corporates**: company type, industry sector, contact number, company description
  - Edit mode with form validation
  - Save/Cancel functionality
  - Responsive design with gradient background

#### 2. Header Component Updates (`frontend/components/header.tsx`)
- Made profile image clickable - links to `/profile` page
- Made user name clickable - links to `/profile` page
- Added hover effects on profile image
- Added tooltip "View Profile" on profile image
- Updated mobile menu - entire user card now clickable and links to profile
- Maintained existing logout functionality

### Backend Changes

#### 1. Auth Routes (`backend/src/routes/auth.routes.js`)
- Added new route: `PUT /api/auth/profile` for updating user profile
- Protected with authentication middleware

#### 2. Auth Controller (`backend/src/controllers/auth.controller.js`)
- Added `updateProfile` function
- Validates and filters update data (removes sensitive fields like password, role, email, points, coins)
- Returns updated user data

#### 3. Auth Service (`backend/src/services/auth.service.js`)
- Added `updateProfile` service method
- Role-based field validation:
  - Only allows updating fields relevant to user's role
  - Handles address updates for NGOs and Corporates
- Returns user without password field

#### 4. Password Utils Import
- Added `generateToken` import to auth service (was missing)

## User Flow

1. **Access Profile**:
   - User clicks on profile image or name in header (desktop)
   - User clicks on profile card in mobile menu
   - Redirects to `/profile` page

2. **View Profile**:
   - User sees their profile information
   - Stats displayed for volunteers (points, coins, hours)
   - Role-specific fields shown based on user type
   - Account creation date displayed

3. **Edit Profile**:
   - Click "Edit Profile" button
   - Form fields become editable
   - Can modify allowed fields (email is read-only)
   - Click "Save" to update or "Cancel" to discard changes
   - Success/error toast notifications shown
   - Page refreshes to sync with auth context

## API Endpoint

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>

Request Body:
{
  "name": "Updated Name",
  "age": 25,
  "city": "New City",
  "profession": "Software Engineer",
  // ... other role-specific fields
}

Response:
{
  "statusCode": 200,
  "data": {
    "user": { /* updated user object */ }
  },
  "message": "Profile updated successfully",
  "success": true
}
```

## Security Features

1. **Protected Route**: Profile page requires authentication
2. **Server-side Validation**: 
   - Removes sensitive fields (password, role, email, points, coins)
   - Only updates fields allowed for user's role
3. **Token-based Authentication**: Uses JWT token from localStorage
4. **Auto-redirect**: Redirects to login if not authenticated

## Design Features

- Gradient background (blue to purple)
- Card-based layout with shadows
- Responsive grid layout
- Icon-based information display
- Smooth transitions and hover effects
- Color-coded role badges
- Stats cards with visual icons

## Notes

- Email cannot be changed through profile (security measure)
- Points, coins, and completed events are read-only
- Profile updates refresh the page to sync with auth context
- All changes are validated on both frontend and backend
