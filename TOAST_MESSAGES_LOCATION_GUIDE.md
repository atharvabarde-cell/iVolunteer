# Toast Messages - Code Location Guide

## 📍 Exact Locations of Toast Messages

### File: `frontend/app/profile/page.tsx`

---

## 🔐 Password Change Toast Messages

### 1. Success Toast (Line 321-324)
```typescript
toast({
  title: "Success",
  description: "Password changed successfully!",
});
```
**Triggered when:** Password is successfully changed with correct validation.

**After this:**
- Form resets to empty
- Dialog closes
- User can now login with new password

---

### 2. Empty Fields Error (Line 281-285)
```typescript
toast({
  title: "Error",
  description: "Please fill in all password fields",
  variant: "destructive",
});
```
**Triggered when:** User submits with any empty password field.

---

### 3. Password Mismatch Error (Line 291-295)
```typescript
toast({
  title: "Error",
  description: "New passwords do not match",
  variant: "destructive",
});
```
**Triggered when:** New password and confirmation don't match.

---

### 4. Short Password Error (Line 301-305)
```typescript
toast({
  title: "Error",
  description: "New password must be at least 8 characters long",
  variant: "destructive",
});
```
**Triggered when:** New password is less than 8 characters.

---

### 5. Backend Error (Line 334-338)
```typescript
toast({
  title: "Error",
  description: error.response?.data?.message || "Failed to change password",
  variant: "destructive",
});
```
**Triggered when:** Backend returns error (e.g., wrong old password).

---

## 🗑️ Delete Account Toast Messages

### 1. Success Toast (Line 369-372)
```typescript
toast({
  title: "Account Deleted",
  description: "Your account has been permanently deleted",
});
```
**Triggered when:** Account is successfully deleted.

**After this:**
- localStorage cleared
- User redirected to login page (`/auth`)

---

### 2. Empty Password Error (Line 346-350)
```typescript
toast({
  title: "Error",
  description: "Please enter your password to confirm account deletion",
  variant: "destructive",
});
```
**Triggered when:** User submits without entering password.

---

### 3. Backend Error (Line 381-385)
```typescript
toast({
  title: "Error",
  description: error.response?.data?.message || "Failed to delete account",
  variant: "destructive",
});
```
**Triggered when:** Backend returns error (e.g., wrong password, server error).

---

## 🎯 Complete Code Snippets

### Password Change Function (Lines 278-342)
```typescript
const handleChangePassword = async () => {
  // Validation
  if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    toast({
      title: "Error",
      description: "Please fill in all password fields",
      variant: "destructive",
    });
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast({
      title: "Error",
      description: "New passwords do not match",
      variant: "destructive",
    });
    return;
  }

  if (passwordData.newPassword.length < 8) {
    toast({
      title: "Error",
      description: "New password must be at least 8 characters long",
      variant: "destructive",
    });
    return;
  }

  setIsChangingPassword(true);
  try {
    const token = localStorage.getItem("auth-token");
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ SUCCESS TOAST
    toast({
      title: "Success",
      description: "Password changed successfully!",
    });

    // Reset form and close dialog
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordDialog(false);
  } catch (error: any) {
    console.error("Error changing password:", error);
    
    // ❌ ERROR TOAST
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to change password",
      variant: "destructive",
    });
  } finally {
    setIsChangingPassword(false);
  }
};
```

---

### Delete Account Function (Lines 344-390)
```typescript
const handleDeleteAccount = async () => {
  if (!deletePassword) {
    toast({
      title: "Error",
      description: "Please enter your password to confirm account deletion",
      variant: "destructive",
    });
    return;
  }

  setIsDeletingAccount(true);
  try {
    const token = localStorage.getItem("auth-token");
    await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/account`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        password: deletePassword,
      },
    });

    // ✅ SUCCESS TOAST
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted",
    });

    // Clear local storage and redirect to login
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    router.push("/auth");
  } catch (error: any) {
    console.error("Error deleting account:", error);
    
    // ❌ ERROR TOAST
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to delete account",
      variant: "destructive",
    });
  } finally {
    setIsDeletingAccount(false);
  }
};
```

---

## 📊 Toast Message Flow Diagram

### Password Change Flow
```
User submits form
        ↓
┌───────┴───────┐
│ Validation    │
└───────┬───────┘
        │
    ┌───┴───┐
    │ Valid?│
    └───┬───┘
        │
   ┌────┴─────┐
   │          │
  YES        NO
   │          │
   ↓          ↓
API Call   Error Toast
   │       (red)
   │
┌──┴───┐
│ OK?  │
└──┬───┘
   │
┌──┴───┐
│      │
YES   NO
│      │
↓      ↓
Success Error Toast
Toast   (red)
(green)
│
↓
Close Dialog
Reset Form
```

### Delete Account Flow
```
User submits with password
        ↓
┌───────┴───────┐
│ Has Password? │
└───────┬───────┘
        │
   ┌────┴─────┐
   │          │
  YES        NO
   │          │
   ↓          ↓
API Call   Error Toast
   │       (red)
   │
┌──┴───┐
│ OK?  │
└──┬───┘
   │
┌──┴───┐
│      │
YES   NO
│      │
↓      ↓
Success Error Toast
Toast   (red)
│
↓
Clear Storage
Redirect to /auth
```

---

## 🎨 Toast Appearance

### Success Toast
```
┌─────────────────────────────────────────┐
│  ✓ Success                              │
│                                         │
│  Password changed successfully!         │
│                                         │
│  [Background: Light green/default]      │
│  [Auto-dismiss after 3-5 seconds]       │
└─────────────────────────────────────────┘
```

### Error Toast (Destructive Variant)
```
┌─────────────────────────────────────────┐
│  ✕ Error                                │
│                                         │
│  New passwords do not match             │
│                                         │
│  [Background: Red/destructive]          │
│  [Can be dismissed or auto-dismiss]     │
└─────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

To verify toast messages are working:

### Password Change
- [ ] Empty fields → See error toast
- [ ] Password mismatch → See error toast
- [ ] Short password → See error toast
- [ ] Wrong old password → See error toast (from backend)
- [ ] Correct inputs → See success toast + dialog closes

### Delete Account
- [ ] Empty password → See error toast
- [ ] Wrong password → See error toast (from backend)
- [ ] Correct password → See success toast + redirect to login

---

## 🔍 How to Test

1. **Open your application**
   ```bash
   # Make sure backend is running
   cd backend
   npm run dev
   ```

2. **Navigate to Profile**
   - Login to your account
   - Go to Profile page
   - Scroll to "Security & Account" section

3. **Test Password Change**
   - Click "Change Password"
   - Try various inputs to trigger different toasts
   - Verify success toast appears and dialog closes

4. **Test Delete Account**
   - Click "Delete Account"
   - Try wrong password → See error toast
   - Use correct password → See success toast
   - Verify redirect to login

---

## 📝 Summary

✅ **All toast messages are implemented**
✅ **Located in:** `frontend/app/profile/page.tsx`
✅ **Total toast messages:** 7 (4 for password change, 3 for delete account)
✅ **Proper styling:** Success (default) vs Error (destructive)
✅ **Complete coverage:** Every user action has feedback

**No code changes needed - everything is ready! 🎉**
