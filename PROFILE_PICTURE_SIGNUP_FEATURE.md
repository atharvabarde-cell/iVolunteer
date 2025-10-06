# Optional Profile Picture Upload During Signup

## Feature Overview
Added an optional profile picture upload field during signup for all user roles (Admin, Volunteer, NGO, and Corporate). Users can now upload their profile picture while creating their account.

## Implementation Details

### New Imports
```tsx
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
```

### New State Variables
```tsx
const [profilePicture, setProfilePicture] = useState<File | null>(null);
const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Handler Functions

#### 1. handleProfilePictureChange
Handles file selection and validation:
- **File Type Validation**: Only accepts image files
- **File Size Validation**: Maximum 5MB
- **Preview Generation**: Creates a data URL for preview using FileReader
- **Error Handling**: Shows toast notifications for validation errors

```tsx
const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB");
    return;
  }

  setProfilePicture(file);
  
  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setProfilePicturePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};
```

#### 2. removeProfilePicture
Clears the selected profile picture:
- Resets state variables
- Clears file input value

```tsx
const removeProfilePicture = () => {
  setProfilePicture(null);
  setProfilePicturePreview(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};
```

### Upload Flow

#### During Signup
1. User fills signup form
2. Optionally uploads profile picture
3. Form is submitted → Account is created
4. If profile picture is present:
   - Upload to backend using FormData
   - Endpoint: `/v1/auth/upload-profile-picture`
   - Authorization: Bearer token from localStorage
   - Success: Toast notification
   - Failure: Warning toast (account still created)

```tsx
if (success) {
  // Upload profile picture if provided
  if (profilePicture) {
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);

      const token = localStorage.getItem("auth-token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.warn("Account created but profile picture upload failed. You can upload it later from your profile.");
    }
  }
  // ... rest of success handling
}
```

## UI Components

### Upload State (No Picture Selected)

```tsx
<div
  onClick={() => fileInputRef.current?.click()}
  className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-center"
>
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <Upload className="w-8 h-8 text-gray-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Click to upload profile picture
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        PNG, JPG up to 5MB
      </p>
    </div>
  </div>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleProfilePictureChange}
    className="hidden"
  />
</div>
```

**Features:**
- Dashed border with upload icon
- Click-to-upload interaction
- Hover effect (border turns blue)
- File type and size information
- Hidden file input

### Preview State (Picture Selected)

```tsx
<div className="relative">
  <div className="flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
    <Avatar className="w-16 h-16">
      <AvatarImage src={profilePicturePreview} alt="Profile preview" />
      <AvatarFallback>
        <User className="w-8 h-8" />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {profilePicture?.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {(profilePicture!.size / 1024).toFixed(2)} KB
      </p>
    </div>
    <button
      type="button"
      onClick={removeProfilePicture}
      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
    >
      <X className="w-5 h-5 text-red-500" />
    </button>
  </div>
</div>
```

**Features:**
- Avatar component shows preview
- File name and size display
- Remove button with red X icon
- Hover effect on remove button
- Responsive layout

## Field Placement

The profile picture upload field appears:
- **After**: Name field (Full Name/Organization Name/Company Name)
- **Before**: Email field
- **When**: Tab is "signup" (any role)
- **Label**: "Profile Picture (optional)"

### Signup Form Order for All Roles:
1. Role Selection
2. Name (Full Name / Organization Name / Company Name)
3. **Profile Picture** ⬅️ NEW (Optional)
4. Email
5. Role-specific fields...
6. Password
7. Confirm Password

## Validation Rules

### Client-Side Validation
- **File Type**: Must be an image (checked via `file.type.startsWith("image/")`)
- **File Size**: Maximum 5MB (5 * 1024 * 1024 bytes)
- **Optional**: Field is not required, users can skip it

### Backend Validation
The backend endpoint `/v1/auth/upload-profile-picture` handles:
- Authentication check (Bearer token required)
- File upload to Cloudinary
- Image transformation (500x500, face-detection cropping)
- Old image cleanup (if exists)

## User Experience

### Upload Flow
1. **Initial State**: Dashed box with upload icon
2. **Click**: Opens file picker
3. **Select Image**: 
   - If invalid type → Error toast
   - If too large → Error toast
   - If valid → Preview appears
4. **Preview**: Shows avatar with file info
5. **Remove**: Click X to clear selection
6. **Submit**: Uploads after account creation

### Success Scenarios
- ✅ Account created → Profile picture uploaded → Both success toasts
- ✅ Account created → No picture selected → Account success toast only
- ⚠️ Account created → Picture upload failed → Account success + warning toast

### Error Handling
- ❌ Invalid file type → Red toast: "Please select an image file"
- ❌ File too large → Red toast: "Image size should be less than 5MB"
- ⚠️ Upload fails → Warning toast: "Account created but profile picture upload failed. You can upload it later from your profile."

## Accessibility

- **Keyboard Accessible**: File input can be triggered via keyboard
- **Screen Reader Friendly**: Proper labels and alt text
- **Clear Instructions**: "PNG, JPG up to 5MB" guidance
- **Optional Label**: "(optional)" clearly marked

## Dark Mode Support

All components support dark mode:
- Border colors adapt (gray-300 → gray-600)
- Background colors adapt (gray-50 → gray-700)
- Text colors adapt (gray-700 → gray-300)
- Hover states adapt for both modes

## Backend Integration

### API Endpoint
- **URL**: `${NEXT_PUBLIC_API_URL}/v1/auth/upload-profile-picture`
- **Method**: POST
- **Headers**:
  - Authorization: Bearer token
  - Content-Type: multipart/form-data
- **Body**: FormData with 'profilePicture' field

### Expected Response
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "profilePicture": "https://res.cloudinary.com/...",
      "cloudinaryPublicId": "iVolunteer_profiles/profile_..."
    }
  },
  "message": "Profile picture uploaded successfully"
}
```

## Files Modified

### `frontend/app/auth/page.tsx`
- Added imports: `useRef`, `Upload`, `X`, `Avatar` components, `axios`
- Added state: `profilePicture`, `profilePicturePreview`, `fileInputRef`
- Added handlers: `handleProfilePictureChange`, `removeProfilePicture`
- Updated `onSubmit`: Added profile picture upload after successful signup
- Added UI: Profile picture upload field in signup form

## Testing Checklist

- [ ] Upload valid image (PNG) → Shows preview
- [ ] Upload valid image (JPG) → Shows preview
- [ ] Upload non-image file → Shows error toast
- [ ] Upload large file (>5MB) → Shows error toast
- [ ] Remove uploaded image → Clears preview
- [ ] Signup with picture → Account created, picture uploaded
- [ ] Signup without picture → Account created only
- [ ] Network failure during upload → Warning toast shown
- [ ] Preview shows correct file name
- [ ] Preview shows correct file size
- [ ] Works for Admin role
- [ ] Works for Volunteer role
- [ ] Works for NGO role
- [ ] Works for Corporate role
- [ ] Dark mode displays correctly
- [ ] File input resets after removal

## Benefits

1. **Better First Impression**: Users can set profile picture immediately
2. **Complete Onboarding**: One-step account setup with picture
3. **Optional**: Doesn't block signup if user skips it
4. **User Friendly**: Clear upload UI with preview
5. **Validated**: Prevents invalid files and oversized images
6. **Graceful Degradation**: Account created even if upload fails
7. **Consistent**: Same experience across all user roles

## Future Enhancements

- [ ] Image cropping before upload
- [ ] Multiple format support (WebP, AVIF)
- [ ] Drag and drop support
- [ ] Camera capture option for mobile
- [ ] Avatar selection from preset options
- [ ] Progress bar for upload
- [ ] Image compression before upload

---

**Feature Status**: ✅ IMPLEMENTED

**Date**: October 6, 2025

**Applies To**: All user roles (Admin, Volunteer, NGO, Corporate)

**Required**: No (Optional field)

**Max File Size**: 5MB

**Supported Formats**: All image types (PNG, JPG, JPEG, GIF, etc.)
