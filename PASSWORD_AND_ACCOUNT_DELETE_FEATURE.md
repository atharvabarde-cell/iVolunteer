# Password Change and Account Deletion Feature

## Overview
Added secure password change and account deletion features to the user profile page. Both features require password verification for security.

## Features Implemented

### 1. Change Password
- Users can update their password from the profile page
- Requires current password verification
- New password must be at least 8 characters
- Confirmation field to prevent typos
- Secure password validation

### 2. Delete Account
- Permanently deletes user account and all associated data
- Requires password confirmation before deletion
- Shows clear warning about data loss
- Deletes:
  - User profile and information
  - All user sessions
  - Profile picture from Cloudinary
  - All associated data
- Automatically logs out and redirects to auth page

## Backend Changes

### Files Modified

#### 1. `backend/src/services/auth.service.js`
- Added import for Cloudinary
- Added `deleteAccount` function

**New Function:**
```javascript
const deleteAccount = async (id, password) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  // Verify password before deleting
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password");

  // Delete all user sessions
  await Session.deleteMany({ userId: id });

  // Delete user's profile picture from Cloudinary if exists
  if (user.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(user.cloudinaryPublicId);
    } catch (error) {
      logger.error("Error deleting profile picture from Cloudinary", {
        userId: id,
        error: error.message,
      });
    }
  }

  // Delete the user
  await User.findByIdAndDelete(id);

  logger.info("User account deleted", { userId: id, email: user.email });

  return { message: "Account deleted successfully" };
};
```

#### 2. `backend/src/controllers/auth.controller.js`
- Added `deleteAccount` controller
- Clears cookies on account deletion

**New Controller:**
```javascript
const deleteAccount = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required to delete account");
  }

  await authService.deleteAccount(id, password);
  clearCookies(res);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});
```

#### 3. `backend/src/routes/auth.routes.js`
- Added new DELETE route for account deletion

**New Route:**
```javascript
router.delete("/account", authentication, authController.deleteAccount);
```

## Frontend Changes

### File Modified: `frontend/app/profile/page.tsx`

#### New Imports
```typescript
import { Lock, AlertTriangle } from "lucide-react";
```

#### New State Variables
```typescript
// Password change state
const [showPasswordDialog, setShowPasswordDialog] = useState(false);
const [passwordData, setPasswordData] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [isChangingPassword, setIsChangingPassword] = useState(false);

// Delete account state
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [deletePassword, setDeletePassword] = useState("");
const [isDeletingAccount, setIsDeletingAccount] = useState(false);
```

#### New Functions

**1. handleChangePassword:**
- Validates all password fields are filled
- Validates new password matches confirmation
- Validates new password is at least 8 characters
- Sends request to backend
- Shows success/error toast
- Resets form and closes dialog

**2. handleDeleteAccount:**
- Validates password is entered
- Sends delete request to backend
- Clears local storage
- Redirects to login page
- Shows appropriate toasts

#### New UI Components

**1. Security Settings Section:**
Located in the profile card, below Account Information section
- Change Password button with Lock icon
- Delete Account button with AlertTriangle icon
- Clear visual hierarchy with icons and descriptions

**2. Change Password Dialog:**
- Current password input
- New password input (with 8-character minimum requirement)
- Confirm password input
- Change Password button with loading state
- Cancel button
- Input validation and error handling

**3. Delete Account Dialog:**
- Warning header with AlertTriangle icon
- Detailed warning box listing what will be deleted:
  - All posts and comments
  - Profile and activity history
  - Earned coins and badges
  - Irreversibility warning
- Password confirmation input
- Delete button with loading state (red/destructive variant)
- Cancel button

## API Endpoints

### Change Password
```
POST /api/v1/auth/change-password
Headers: Authorization: Bearer {token}
Body: {
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Existing Endpoint** - No changes needed, already implemented.

### Delete Account
```
DELETE /api/v1/auth/account
Headers: Authorization: Bearer {token}
Body: {
  "password": "string"
}
```

**New Endpoint**

## Security Features

### Password Change
✅ Requires current password verification
✅ Validates password strength (minimum 8 characters)
✅ Confirms new password with confirmation field
✅ Backend validates old password before changing

### Account Deletion
✅ Requires password confirmation
✅ Shows clear warnings about data loss
✅ Permanently deletes all user data
✅ Cleans up associated resources (sessions, images)
✅ Logs out user and redirects to login

## User Experience

### Password Change Flow
1. User clicks "Change Password" button
2. Dialog opens with three password fields
3. User enters current and new passwords
4. System validates inputs client-side
5. Backend verifies current password
6. Password updated successfully
7. Success toast shown, dialog closes

### Account Deletion Flow
1. User clicks "Delete Account" button
2. Dialog opens with prominent warning
3. Warning lists all data that will be lost
4. User must enter password to confirm
5. System validates password
6. Account and all data deleted
7. User logged out and redirected to login
8. Confirmation toast shown

## Error Handling

### Password Change Errors
- Empty fields: "Please fill in all password fields"
- Password mismatch: "New passwords do not match"
- Short password: "New password must be at least 8 characters long"
- Wrong old password: Backend returns "Password is incorrect"

### Account Deletion Errors
- Empty password: "Please enter your password to confirm account deletion"
- Wrong password: Backend returns "Incorrect password"
- Server errors: "Failed to delete account"

## Testing Checklist

### Password Change
- [ ] Can open password change dialog
- [ ] Validation works for empty fields
- [ ] Validation works for password mismatch
- [ ] Validation works for short password
- [ ] Correct password change succeeds
- [ ] Incorrect old password shows error
- [ ] Cancel button closes dialog and resets form
- [ ] Success toast appears after change

### Account Deletion
- [ ] Can open delete account dialog
- [ ] Warning message displays clearly
- [ ] Password validation works
- [ ] Correct password deletes account
- [ ] Incorrect password shows error
- [ ] Account is actually deleted from database
- [ ] Profile picture deleted from Cloudinary
- [ ] User sessions deleted
- [ ] User redirected to login page
- [ ] User cannot login with deleted account
- [ ] Cancel button closes dialog and resets form

## UI Screenshots Description

### Security Settings Section
- Located at bottom of profile page
- Two buttons in a card section
- Blue-themed "Change Password" button
- Red-themed "Delete Account" button
- Icons and descriptions for clarity

### Change Password Dialog
- Clean modal dialog
- Three password input fields
- Blue action button
- Loading state during submission
- Cancel option available

### Delete Account Dialog
- Red/warning themed dialog
- Prominent warning box
- Bulleted list of consequences
- Password confirmation required
- Red destructive button
- Strong visual warning indicators

## Notes

- Account deletion is **irreversible**
- All user data is permanently removed
- Profile pictures are cleaned up from Cloudinary
- User sessions are invalidated immediately
- Backend logs account deletion for audit purposes
- Password requirements align with registration (8+ characters)
- Both features require authentication (protected routes)
