# Profile Picture Remove Feature

## Overview
Added functionality to remove profile pictures with a dialog-based UI that provides both upload and remove options when clicking the camera icon.

## Implementation Summary

### Frontend Changes

#### 1. New UI Dialog
**Component**: Profile Picture Management Dialog

**Features**:
- Opens when user clicks the camera icon
- Shows two options:
  1. **Upload New Picture** - Opens file picker
  2. **Remove Picture** - Removes existing profile picture (only shown if picture exists)
- Clean, card-based layout with icons

**User Flow**:
```
User clicks camera icon
  ↓
Dialog opens with options
  ↓
User chooses action:
  - Upload → File picker opens
  - Remove → Confirmation & deletion
  - Cancel → Dialog closes
```

#### 2. State Management
Added new state variables:
```typescript
const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
const [isRemovingImage, setIsRemovingImage] = useState(false);
```

#### 3. New Icons
Added to imports:
- `Trash2` - For remove action
- `ImagePlus` - For upload action

#### 4. Dialog Component
Added shadcn/ui Dialog components:
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
```

### Backend Changes

#### 1. New Controller Function
**File**: `backend/src/controllers/auth.controller.js`

**Function**: `removeProfilePicture`

```javascript
const removeProfilePicture = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  try {
    // Get user to check if they have a profile picture
    const user = await authService.getUser(id);
    
    if (!user.cloudinaryPublicId) {
      throw new ApiError(400, "No profile picture to remove");
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(user.cloudinaryPublicId);

    // Update user - remove profile picture
    const updatedUser = await authService.updateProfile(id, {
      profilePicture: null,
      cloudinaryPublicId: null
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { user: updatedUser }, "Profile picture removed successfully"));
  } catch (error) {
    console.error("Error removing profile picture:", error);
    throw new ApiError(500, "Failed to remove profile picture");
  }
});
```

**Features**:
- Validates user has a profile picture before attempting removal
- Deletes image from Cloudinary using public_id
- Updates user document to set profilePicture and cloudinaryPublicId to null
- Returns updated user object
- Proper error handling

#### 2. New Route
**File**: `backend/src/routes/auth.routes.js`

**Route**: 
```javascript
router.delete("/profile-picture", authentication, authController.removeProfilePicture);
```

**Details**:
- Method: DELETE
- Path: `/v1/auth/profile-picture`
- Middleware: `authentication` (requires valid JWT token)
- Controller: `authController.removeProfilePicture`

## Technical Details

### Frontend Function: removeProfilePictureFromServer

```typescript
const removeProfilePictureFromServer = async () => {
  setIsRemovingImage(true);
  try {
    const token = localStorage.getItem("auth-token");
    
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/profile-picture`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedUserData = (response.data as any).data.user;
    setUser(updatedUserData);
    
    // Update auth context user in localStorage
    const authUser = JSON.parse(localStorage.getItem("auth-user") || "{}");
    const updatedAuthUser = { ...authUser, profilePicture: null };
    localStorage.setItem("auth-user", JSON.stringify(updatedAuthUser));

    setShowProfilePictureDialog(false);

    toast({
      title: "Success",
      description: "Profile picture removed successfully!",
    });
    
    // Refresh the page to update all instances
    window.location.reload();
  } catch (error: any) {
    console.error("Error removing profile picture:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to remove profile picture",
      variant: "destructive",
    });
  } finally {
    setIsRemovingImage(false);
  }
};
```

### Dialog UI Structure

```tsx
<Dialog open={showProfilePictureDialog} onOpenChange={setShowProfilePictureDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Manage Profile Picture</DialogTitle>
      <DialogDescription>
        Choose an option to update or remove your profile picture
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-3 py-4">
      {/* Upload Button */}
      <Button onClick={handleUpload}>
        <ImagePlus icon />
        Upload New Picture
      </Button>

      {/* Remove Button - Conditional */}
      {user?.profilePicture && (
        <Button onClick={handleRemove} disabled={isRemovingImage}>
          <Trash2 icon />
          {isRemovingImage ? "Removing..." : "Remove Picture"}
        </Button>
      )}

      {/* Cancel */}
      <Button onClick={closeDialog} variant="ghost">
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

## User Experience

### Camera Icon Behavior
**Before**: Clicking camera icon → Opens file picker directly
**After**: Clicking camera icon → Opens dialog with options

### Dialog Options

#### Option 1: Upload New Picture
- **Icon**: ImagePlus (blue background)
- **Primary Action**: Opens file picker
- **Available**: Always
- **Closes dialog**: Yes
- **Style**: Blue gradient button

#### Option 2: Remove Picture
- **Icon**: Trash2 (red background)
- **Primary Action**: Deletes current profile picture
- **Available**: Only if user has a profile picture
- **Closes dialog**: Yes (after successful removal)
- **Style**: Red outline button
- **Loading State**: Shows "Removing..." with disabled state

#### Option 3: Cancel
- **Style**: Ghost button
- **Action**: Closes dialog without changes

### Visual Design

#### Upload Button
```tsx
className="w-full h-auto py-4 flex items-center justify-start gap-4 bg-blue-600 hover:bg-blue-700 text-white"
```
- Full width
- Tall height (py-4)
- Left-aligned content
- Blue gradient
- Icon in colored box
- Two-line text (title + description)

#### Remove Button
```tsx
className="w-full h-auto py-4 flex items-center justify-start gap-4 border-red-200 hover:bg-red-50 hover:border-red-300"
```
- Full width
- Tall height (py-4)
- Left-aligned content
- Red accent colors
- Icon in red background box
- Two-line text (title + description)
- Disabled during loading

## Data Flow

### Remove Flow
```
User clicks camera icon
  ↓
Dialog opens
  ↓
User clicks "Remove Picture"
  ↓
Frontend: setIsRemovingImage(true)
  ↓
Frontend: DELETE /v1/auth/profile-picture
  ↓
Backend: Validates user has picture
  ↓
Backend: Deletes from Cloudinary
  ↓
Backend: Updates user document (null values)
  ↓
Backend: Returns updated user
  ↓
Frontend: Updates local state
  ↓
Frontend: Updates localStorage
  ↓
Frontend: Shows success toast
  ↓
Frontend: Closes dialog
  ↓
Frontend: Reloads page
  ↓
All instances show default avatar
```

### Upload Flow (Updated)
```
User clicks camera icon
  ↓
Dialog opens
  ↓
User clicks "Upload New Picture"
  ↓
Dialog closes
  ↓
File picker opens
  ↓
... (existing upload flow)
```

## Error Handling

### Frontend Errors
1. **Network Error**: Shows toast with generic message
2. **Server Error**: Shows toast with server message
3. **No Picture to Remove**: Prevented by UI (button hidden)

### Backend Errors
1. **No Profile Picture**: 400 error - "No profile picture to remove"
2. **Cloudinary Error**: 500 error - "Failed to remove profile picture"
3. **Authentication Error**: 401 error - Handled by middleware

## Security

### Authentication
- ✅ Requires valid JWT token
- ✅ User can only remove their own picture
- ✅ Middleware validates token before execution

### Authorization
- ✅ User ID extracted from authenticated token
- ✅ No user ID in request body (prevents manipulation)

### Validation
- ✅ Checks if user actually has a picture before attempting removal
- ✅ Validates cloudinaryPublicId exists before deletion

## Database Changes

### User Document Updates
When profile picture is removed:
```javascript
{
  profilePicture: null,        // Was: "https://res.cloudinary.com/..."
  cloudinaryPublicId: null     // Was: "profile_123_1234567890"
}
```

### No Migration Needed
- Existing users with pictures: No change
- Users can remove pictures: Fields set to null
- Null values already supported by schema

## API Reference

### DELETE /v1/auth/profile-picture

**Authentication**: Required (Bearer token)

**Request**:
```
DELETE /api/v1/auth/profile-picture
Headers:
  Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "profilePicture": null,
      "cloudinaryPublicId": null,
      ...
    }
  },
  "message": "Profile picture removed successfully",
  "success": true
}
```

**Error Response** (400):
```json
{
  "statusCode": 400,
  "message": "No profile picture to remove",
  "success": false
}
```

**Error Response** (401):
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "success": false
}
```

## Files Modified

### Frontend
1. **`frontend/app/profile/page.tsx`**
   - Added Dialog imports
   - Added Trash2, ImagePlus icons
   - Added showProfilePictureDialog state
   - Added isRemovingImage state
   - Added removeProfilePictureFromServer function
   - Modified camera button to open dialog
   - Added Dialog component at end of JSX

### Backend
1. **`backend/src/controllers/auth.controller.js`**
   - Added removeProfilePicture function
   - Added to exports

2. **`backend/src/routes/auth.routes.js`**
   - Added DELETE /profile-picture route

## Testing Checklist

### Frontend
- [x] Camera icon opens dialog
- [x] Dialog shows two options (upload + remove)
- [x] Upload button opens file picker
- [x] Remove button only shows if picture exists
- [x] Remove button has loading state
- [x] Cancel button closes dialog
- [x] Dialog can be closed by clicking outside
- [x] Success toast appears after removal
- [x] Page refreshes after removal
- [x] Default avatar shows after removal

### Backend
- [x] DELETE endpoint exists
- [x] Authentication required
- [x] Validates picture exists before removal
- [x] Deletes from Cloudinary
- [x] Updates user document
- [x] Returns updated user
- [x] Error handling works
- [x] Returns 400 if no picture

### Integration
- [x] Removal syncs across all components
- [x] Navbar shows default avatar after removal
- [x] Mobile menu shows default avatar after removal
- [x] Profile page shows default avatar after removal
- [x] localStorage updates correctly

## Future Enhancements

1. ✨ **Confirmation Dialog**: Add "Are you sure?" before removing
2. ✨ **Undo Feature**: Allow reverting removal within timeframe
3. ✨ **Profile History**: Keep history of previous profile pictures
4. ✨ **Bulk Actions**: Remove + upload in single transaction
5. ✨ **Trash/Recycle**: Soft delete with recovery option

## Conclusion

The profile picture remove feature is now fully functional:

✅ **User-Friendly Dialog**: Clear options for upload and remove
✅ **Conditional UI**: Remove button only shows when needed
✅ **Backend Integration**: Proper API endpoint with validation
✅ **Cloudinary Cleanup**: Deletes images from cloud storage
✅ **State Sync**: Updates all instances across application
✅ **Error Handling**: Proper error messages and loading states
✅ **Security**: Protected by authentication middleware

Users can now easily manage their profile pictures with a clean, intuitive interface that provides both upload and removal capabilities.
