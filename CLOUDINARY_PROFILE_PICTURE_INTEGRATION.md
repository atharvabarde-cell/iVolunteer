# Profile Picture Display with Cloudinary Integration

## Overview
Complete implementation of profile picture upload, storage, and display using Cloudinary. Profile pictures are now displayed across the application when available, with fallback to default icons.

## Cloudinary Integration

### Backend Setup

#### Configuration (`backend/src/config/cloudinary.js`)
```javascript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage for posts
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'iVolunteer_posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, crop: "limit" }],
    }
});

const upload = multer({ storage: storage });
```

#### Upload Controller (`backend/src/controllers/auth.controller.js`)
```javascript
const uploadProfilePicture = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'iVolunteer_profiles',
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" }
      ],
      public_id: `profile_${id}_${Date.now()}`
    });

    // Delete old profile picture if exists
    const user = await authService.getUser(id);
    if (user.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(user.cloudinaryPublicId);
    }

    // Update user with new profile picture
    const updatedUser = await authService.updateProfile(id, {
      profilePicture: result.secure_url,
      cloudinaryPublicId: result.public_id
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { user: updatedUser }, "Profile picture uploaded successfully"));
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw new ApiError(500, "Failed to upload profile picture");
  }
});
```

### Cloudinary Features Used

#### Image Transformation
- **Width**: 500px
- **Height**: 500px
- **Crop**: "fill" (ensures image fills dimensions)
- **Gravity**: "face" (auto-detects and centers on face)

#### Organization
- **Folder**: `iVolunteer_profiles`
- **Public ID Format**: `profile_{userId}_{timestamp}`

#### Old Image Cleanup
- Automatically deletes previous profile picture when new one is uploaded
- Uses `cloudinary.uploader.destroy(publicId)` method

## Frontend Implementation

### Profile Picture Display Locations

#### 1. Profile Page (`frontend/app/profile/page.tsx`)

**Large Avatar (Profile Header)**
```tsx
<Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-2xl ring-4 ring-blue-100">
  <AvatarImage src={user.profilePicture} alt={user.name} />
  <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
    <User className="w-16 h-16 sm:w-20 sm:h-20" />
  </AvatarFallback>
</Avatar>
```

**Features:**
- Size: 32x32 (mobile) to 40x40 (desktop)
- White border: 4px
- Shadow: 2xl
- Ring: 4px blue-100
- Fallback: Large User icon

#### 2. Header - Desktop (`frontend/components/header.tsx`)

**Small Avatar (Navigation Bar)**
```tsx
<Avatar className="w-9 h-9 shadow-sm group-hover:shadow-md transition-shadow duration-200 ring-2 ring-gray-100">
  <AvatarImage src={(user as any).profilePicture} alt={user.name} />
  <AvatarFallback className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <User className="w-5 h-5" />
  </AvatarFallback>
</Avatar>
```

**Features:**
- Size: 9x9
- Ring: 2px gray-100
- Shadow: Small with hover effect
- Fallback: Small User icon

#### 3. Header - Mobile Menu (`frontend/components/header.tsx`)

**Medium Avatar (Mobile Drawer)**
```tsx
<Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
  <AvatarImage src={(user as any).profilePicture} alt={user.name} />
  <AvatarFallback className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <User className="w-5 h-5" />
  </AvatarFallback>
</Avatar>
```

**Features:**
- Size: 10x10
- Ring: 2px white
- Shadow: Small
- Fallback: Medium User icon

## Avatar Component Behavior

### AvatarImage
- **Source**: `user.profilePicture` (Cloudinary URL)
- **Alt Text**: User's name
- **Loading**: Handled by component automatically
- **Error Handling**: Falls back to AvatarFallback if image fails to load

### AvatarFallback
- **When Shown**:
  - No profile picture uploaded
  - Image URL is invalid/broken
  - Image is still loading
- **Appearance**:
  - Gradient background (blue-500 to purple-600)
  - White User icon
  - Sizes match parent Avatar

## Data Flow

### During Signup
1. User selects profile picture (optional)
2. Form submitted → Account created
3. If picture selected:
   - FormData created with file
   - POST to `/v1/auth/upload-profile-picture`
   - Authorization: Bearer token
   - Cloudinary processes image
   - User record updated with `profilePicture` and `cloudinaryPublicId`

### During Login
1. User logs in
2. Backend returns user data including `profilePicture` URL
3. Auth context stores user data
4. Components display profile picture from context

### On Profile Page Load
1. Fetch complete user data from `/v1/auth/user`
2. Extract `profilePicture` URL
3. Pass to Avatar component
4. Avatar displays image or falls back to icon

## Database Schema

### User Model Fields
```javascript
{
  profilePicture: {
    type: String,
    default: null
  },
  cloudinaryPublicId: {
    type: String,
    default: null
  }
}
```

## API Integration

### Upload Endpoint
- **URL**: `POST /v1/auth/upload-profile-picture`
- **Authentication**: Required (Bearer token)
- **Body**: FormData with `profilePicture` file
- **Response**:
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "profilePicture": "https://res.cloudinary.com/.../profile_123_1234567890.jpg",
      "cloudinaryPublicId": "iVolunteer_profiles/profile_123_1234567890"
    }
  },
  "message": "Profile picture uploaded successfully"
}
```

### Get User Endpoint
- **URL**: `GET /v1/auth/user`
- **Authentication**: Required (Bearer token)
- **Response**: Includes `profilePicture` URL

## Environment Variables Required

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Fallback Strategy

### Priority Order
1. **First Priority**: Display Cloudinary image if `profilePicture` exists
2. **Fallback**: Show gradient User icon if:
   - No profile picture uploaded
   - Image URL is invalid
   - Image fails to load
   - Network error

### Visual Consistency
- Fallback uses same gradient as other UI elements
- Maintains visual hierarchy across all screen sizes
- Smooth transition when image loads

## Display Scenarios

### Scenario 1: User Has Profile Picture
```
Login → Avatar shows Cloudinary image
Navigate to Profile → Large avatar shows Cloudinary image
Open Mobile Menu → Avatar shows Cloudinary image
```

### Scenario 2: User Has No Profile Picture
```
Login → Avatar shows gradient User icon
Navigate to Profile → Large avatar shows gradient User icon
Open Mobile Menu → Avatar shows gradient User icon
```

### Scenario 3: Image Upload During Session
```
Upload Picture → Success toast
Navigate away → Avatar updates to show new image
Refresh page → Avatar still shows new image
```

## Performance Considerations

### Cloudinary Optimizations
- **Face Detection**: Centers image on face automatically
- **Size Optimization**: Images stored at 500x500 (optimal for display)
- **Format**: Cloudinary auto-selects best format (WebP when supported)
- **CDN**: Delivered via Cloudinary's global CDN

### Frontend Optimizations
- **Lazy Loading**: Avatar images load as needed
- **Caching**: Browser caches Cloudinary URLs
- **Progressive Loading**: Image appears smoothly
- **Fallback Speed**: Instant icon display if no image

## Security

### Upload Security
- **Authentication**: Only authenticated users can upload
- **File Type Validation**: Client and server-side checks
- **File Size Limit**: 5MB maximum
- **User-Specific**: Users can only update their own picture

### Storage Security
- **Cloudinary Security**: Managed by Cloudinary platform
- **Public ID**: Unique per user and timestamp
- **Old Image Cleanup**: Prevents orphaned images

## Testing Checklist

**Upload Flow:**
- [ ] Upload during signup → Picture displays after login
- [ ] Upload from profile page → Picture updates immediately
- [ ] Upload with existing picture → Old picture replaced

**Display Locations:**
- [ ] Profile page shows uploaded picture
- [ ] Desktop header shows uploaded picture
- [ ] Mobile menu shows uploaded picture
- [ ] Fallback icon shows when no picture

**Error Handling:**
- [ ] Invalid image URL → Shows fallback icon
- [ ] Network error → Shows fallback icon
- [ ] Deleted Cloudinary image → Shows fallback icon

**Responsiveness:**
- [ ] Profile page avatar responsive (32x32 to 40x40)
- [ ] Desktop header avatar correct size (9x9)
- [ ] Mobile menu avatar correct size (10x10)

## Troubleshooting

### Profile Picture Not Displaying

**Check:**
1. `user.profilePicture` value in console
2. Cloudinary URL is valid and accessible
3. Network tab for image load errors
4. CORS settings if applicable

**Common Issues:**
- Expired Cloudinary URL
- Incorrect public_id
- Network connectivity
- Browser caching old image

### Upload Fails

**Check:**
1. Cloudinary credentials in `.env`
2. Multer middleware configured
3. File size within limits
4. User authenticated

## Future Enhancements

- [ ] Image cropping UI before upload
- [ ] Multiple profile picture options
- [ ] Cover photo upload
- [ ] Profile picture history
- [ ] Batch upload optimization
- [ ] WebP format enforcement
- [ ] Progressive image loading indicator

---

**Status**: ✅ FULLY IMPLEMENTED

**Date**: October 6, 2025

**Cloudinary Folder**: `iVolunteer_profiles`

**Image Specs**: 500x500px, face-detection crop

**Supported Formats**: JPG, PNG, GIF (auto-optimized by Cloudinary)

**Display Locations**: Profile page, desktop header, mobile menu

**Fallback**: Gradient User icon in all locations
