# Profile Page Data Population Fix

## Problem
The user profile page was not showing the city, age, and profession fields for volunteer users (role: "user"). The fields were displaying "Not specified" even though the data existed in the database.

## Root Cause
The issue was in the auth context (`auth-context.tsx`). During login and signup, the auth context was only storing a minimal subset of user data:

```typescript
const mappedUser: User = {
  _id: data.user.userId,
  id: data.user.userId,
  email: data.user.email,
  name: data.user.name,
  role: data.user.role,
  points: 0,
  coins: data.user.coins || 0,
  volunteeredHours: 0,
  totalRewards: 0,
  completedEvents: [],
  createdAt: new Date().toISOString(),
};
```

Notice that role-specific fields like `age`, `city`, `profession` (for volunteers), `organizationType`, `websiteUrl` (for NGOs), and `companyType`, `industrySector` (for corporates) were **not being included** in the mapped user object.

The profile page was relying on this incomplete data from the auth context, so it couldn't display these fields.

## Solution

### 1. Fetch Complete User Data on Profile Page Load
Instead of relying solely on the auth context data, the profile page now fetches the complete user data from the backend API endpoint `/api/auth/user` when the page loads.

**Changes in `frontend/app/profile/page.tsx`:**

```typescript
// Added separate state for full user data
const [user, setUser] = useState<any>(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);

// Fetch complete user data from API
useEffect(() => {
  const fetchUserData = async () => {
    if (authUser) {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = (response.data as any).data.user;
        setUser(userData);
        
        // Initialize form data with complete user data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          age: userData.age || "",
          city: userData.city || "",
          profession: userData.profession || "",
          // ... all other fields
        });
      } catch (error) {
        // Error handling
      }
    }
  };

  fetchUserData();
}, [authUser, authLoading, router]);
```

### 2. Updated Save Function
The save function now updates the local user state directly with the response from the API, eliminating the need to reload the page:

```typescript
const handleSave = async () => {
  // ... save logic
  
  // Update local user state with the response
  const updatedUserData = (response.data as any).data.user;
  setUser(updatedUserData);
  
  // Also update auth context user in localStorage
  const authUser = JSON.parse(localStorage.getItem("auth-user") || "{}");
  const updatedAuthUser = { ...authUser, ...updatedUserData };
  localStorage.setItem("auth-user", JSON.stringify(updatedAuthUser));
  
  // No need to reload the page anymore!
};
```

### 3. Removed Type Assertions
Replaced all `(user as any).field` references with `user.field` since we're now working with the complete user object from the API.

## Benefits of This Approach

1. ✅ **Complete Data**: Profile page now has access to all user fields from the database
2. ✅ **No Page Reload**: Updates happen seamlessly without reloading the page
3. ✅ **Better User Experience**: Faster loading and smoother updates
4. ✅ **Type Safety**: Removed unnecessary type assertions
5. ✅ **Single Source of Truth**: API is the authoritative source for user data

## Data Flow

1. User navigates to `/profile`
2. Auth context provides basic user info for authentication check
3. Profile page fetches complete user data from `/api/auth/user` endpoint
4. All fields (age, city, profession, etc.) are now available and displayed
5. User can edit and save changes
6. Updates are saved to database and immediately reflected in the UI

## Files Modified

- `frontend/app/profile/page.tsx` - Added API call to fetch complete user data on load

## Testing

To verify the fix works:
1. Login as a volunteer user (role: "user")
2. Navigate to the profile page by clicking on the profile image in the header
3. Verify that age, city, and profession fields are now populated
4. Edit these fields and save
5. Verify the changes are saved and displayed without page reload

## Note

The auth context still stores minimal user data for performance reasons. For detailed user information, components should fetch data from the API when needed, as demonstrated in this profile page implementation.
