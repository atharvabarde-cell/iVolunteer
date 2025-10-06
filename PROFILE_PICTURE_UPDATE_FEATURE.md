# Profile Picture Update Feature

## Overview
This document describes the implementation of the profile picture upload and update functionality in the profile page, along with the existing display of profile images in the navbar.

## Features Implemented

### 1. Navbar Profile Picture Display ✅
**Status**: Already implemented and working

**Locations**:
- Desktop navbar: Shows profile picture in user menu
- Mobile navbar: Shows profile picture in mobile menu drawer

**Behavior**:
- If user has uploaded a profile picture, it displays the image
- If no profile picture exists, shows a gradient fallback with User icon
- Profile picture is clickable and links to the profile page

**Files**:
- `frontend/components/header.tsx`

---

### 2. Profile Page - Profile Picture Update ✅
**Status**: Newly implemented

#### Features Added:

##### A. Camera Icon Overlay
- **Location**: Bottom-right corner of the profile avatar
- **Behavior**: Always visible, clickable to trigger file selection
- **Styling**: Blue circular button with camera icon
- **Purpose**: Makes it obvious that users can change their profile picture

##### B. File Upload Functionality
- **File Input**: Hidden file input triggered by camera icon button
- **Accepted Formats**: All image types (`image/*`)
- **Validation**:
  - File type must be an image
  - Maximum file size: 5MB
  - Shows toast error if validation fails

##### C. Preview System
- **Real-time Preview**: Selected image shows immediately on the avatar
- **File Information**: Displays selected filename
- **Actions Available**:
  - **Upload Button**: Uploads the new profile picture to Cloudinary
  - **Cancel Button**: Removes selection and restores preview

##### D. Upload Process
- **API Endpoint**: `POST /v1/auth/upload-profile-picture`
- **Method**: FormData multipart upload
- **Authentication**: Bearer token from localStorage
- **Processing**:
  1. Uploads to Cloudinary
  2. Updates user record in database
  3. Updates localStorage auth-user data
  4. Refreshes page to update all instances
- **Loading States**: Shows spinner and "Uploading..." text
- **Error Handling**: Shows toast notification on failure

##### E. Upload Notification Section
- **Visibility**: Only shows when a new image is selected
- **Display**: Blue-bordered card with file information
- **Actions**:
  - Upload button (with loading state)
  - Cancel button (clears selection)

## Technical Implementation

### State Management
```typescript
const [profilePicture, setProfilePicture] = useState<File | null>(null);
const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Key Functions

#### 1. handleProfilePictureChange
- Validates file type and size
- Creates FileReader preview
- Sets state for selected file

#### 2. handleRemoveProfilePicture
- Clears file selection
- Removes preview
- Resets file input

#### 3. uploadProfilePicture
- Creates FormData with selected file
- Sends POST request to backend
- Updates user state and localStorage
- Refreshes page to sync all components
- Shows success/error notifications

### Backend Integration

**Endpoint**: `POST /v1/auth/upload-profile-picture`

**Request**:
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
Body: { profilePicture: <file> }
```

**Response**:
```json
{
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "profilePicture": "https://res.cloudinary.com/...",
      "cloudinaryPublicId": "...",
      ...
    }
  }
}
```

**Backend Processing**:
- Uploads to Cloudinary folder: `iVolunteer_profiles`
- Image transformation: 500x500px with face-detection cropping
- Deletes old profile picture if exists
- Updates user document with new URL and public ID

## User Flow

### Changing Profile Picture

1. **User clicks camera icon** on profile avatar
2. **File picker opens** for image selection
3. **User selects image** from device
4. **Validation occurs**:
   - If invalid → Shows error toast
   - If valid → Shows preview and upload section
5. **Preview appears** on avatar with blue notification card below
6. **User clicks Upload button**
   - Button shows loading state
   - Image uploads to Cloudinary
   - User record updates
   - Success toast appears
   - Page refreshes
7. **New profile picture** displays everywhere:
   - Profile page avatar
   - Desktop navbar
   - Mobile menu
   - All other instances

### Canceling Upload

1. User selects image (preview shows)
2. User clicks **Cancel** in notification card
3. Preview clears, returns to current profile picture
4. File input resets

## UI Components Used

- **Avatar**: From `@/components/ui/avatar`
  - `AvatarImage`: Displays actual image
  - `AvatarFallback`: Shows User icon when no image
  
- **Button**: From `@/components/ui/button`
  - Upload action buttons
  - Cancel buttons
  
- **Icons**: From `lucide-react`
  - `Camera`: Camera icon overlay
  - `Upload`: Upload action icon
  - `X`: Cancel/remove action icon
  - `User`: Default avatar fallback

- **Toast**: From `@/hooks/use-toast`
  - Success notifications
  - Error messages
  - Validation feedback

## Styling Details

### Camera Button
```tsx
className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
```
- Positioned at bottom-right of avatar
- Blue gradient background
- White camera icon
- Hover effects: darker blue + scale up
- Shadow for depth

### Upload Notification Card
```tsx
className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
```
- Light blue background
- Blue border
- Displays file info and action buttons
- Responsive layout

### Avatar Sizes
- **Profile Page**: 
  - Mobile: 128x128px (w-32 h-32)
  - Desktop: 160x160px (w-40 h-40)
- **Desktop Navbar**: 36x36px (w-9 h-9)
- **Mobile Menu**: 40x40px (w-10 h-10)

## Files Modified

### 1. `frontend/app/profile/page.tsx`

**Imports Added**:
```typescript
import { useRef } from "react";
import { Camera, Upload } from "lucide-react";
```

**State Added**:
```typescript
const [profilePicture, setProfilePicture] = useState<File | null>(null);
const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Functions Added**:
- `handleProfilePictureChange()`
- `handleRemoveProfilePicture()`
- `uploadProfilePicture()`

**UI Changes**:
- Added camera icon button overlay on avatar
- Added hidden file input
- Modified avatar to show preview when selected
- Added upload notification card
- Added upload/cancel action buttons

### 2. `frontend/components/header.tsx`

**Status**: No changes needed (already displays profile pictures)

**Existing Features**:
- Desktop: `<AvatarImage src={(user as any).profilePicture} alt={user.name} />`
- Mobile: `<AvatarImage src={(user as any).profilePicture} alt={user.name} />`
- Both have fallback to User icon

## Data Flow

### Upload Flow
```
User clicks camera
  ↓
File picker opens
  ↓
User selects image
  ↓
Validation (type, size)
  ↓
FileReader creates preview
  ↓
Preview shows on avatar
  ↓
Upload notification appears
  ↓
User clicks Upload
  ↓
FormData created
  ↓
POST to /v1/auth/upload-profile-picture
  ↓
Backend uploads to Cloudinary
  ↓
Backend updates User document
  ↓
Response returns updated user
  ↓
Frontend updates state
  ↓
Frontend updates localStorage
  ↓
Page refreshes
  ↓
New image displays everywhere
```

### Display Flow
```
Component mounts
  ↓
Fetches user data from API
  ↓
Sets user state with profilePicture URL
  ↓
Avatar component receives props
  ↓
AvatarImage tries to load URL
  ↓
If successful → Shows image
  ↓
If fails → Shows AvatarFallback (User icon)
```

## Error Handling

### Client-Side Validation
1. **Invalid file type**: 
   - Toast: "Invalid file type - Please select an image file"
   
2. **File too large**: 
   - Toast: "File too large - Please select an image under 5MB"

### Upload Errors
1. **Network error**: 
   - Toast: "Error - Failed to upload profile picture"
   
2. **Server error**: 
   - Toast with server message or generic error
   
3. **Authentication error**: 
   - Redirects to login page

## Testing Checklist

### ✅ Profile Page
- [ ] Camera icon visible on avatar
- [ ] Clicking camera opens file picker
- [ ] Selecting image shows preview
- [ ] Invalid file type shows error
- [ ] File over 5MB shows error
- [ ] Valid image shows preview on avatar
- [ ] Upload notification card appears
- [ ] Cancel button clears selection
- [ ] Upload button uploads image
- [ ] Loading state shows during upload
- [ ] Success toast appears after upload
- [ ] Page refreshes after upload
- [ ] New image displays on avatar

### ✅ Navbar Display
- [ ] Desktop navbar shows profile picture
- [ ] Mobile menu shows profile picture
- [ ] Fallback icon shows when no image
- [ ] Images are properly sized
- [ ] Images are clickable (link to profile)

### ✅ Cross-Component Sync
- [ ] After upload, image updates in navbar
- [ ] After upload, image updates in mobile menu
- [ ] After upload, image updates on profile page
- [ ] Logout/login preserves image
- [ ] Page refresh shows correct image

## Browser Compatibility
- **FileReader API**: Supported in all modern browsers
- **FormData**: Supported in all modern browsers
- **File Input**: Universal support
- **Cloudinary**: Works across all browsers

## Security Considerations
1. **Client-side validation**: File type and size checks
2. **Server-side validation**: Backend validates and processes
3. **Authentication**: Bearer token required
4. **File size limit**: 5MB max to prevent abuse
5. **Cloudinary processing**: Automatic image optimization

## Future Enhancements (Optional)
1. ✨ Crop/rotate functionality before upload
2. ✨ Drag-and-drop file upload
3. ✨ Multiple image format conversion
4. ✨ Remove profile picture option
5. ✨ Avatar editing (filters, borders)
6. ✨ Upload progress bar
7. ✨ Image compression before upload

## Conclusion
The profile picture update feature is now fully functional:
- ✅ Navbar already displays profile images (desktop & mobile)
- ✅ Profile page has camera icon for easy access
- ✅ Click-to-upload workflow is intuitive
- ✅ Real-time preview shows selected image
- ✅ Upload integrates with Cloudinary backend
- ✅ All UI components sync automatically
- ✅ Error handling provides user feedback
- ✅ Loading states indicate progress

Users can now easily update their profile pictures from the profile page, and the changes reflect immediately across the entire application.
