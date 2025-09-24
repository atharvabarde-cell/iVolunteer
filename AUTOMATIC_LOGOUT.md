# Automatic Logout on Token Expiration

## Overview
This implementation automatically logs out users when their access token expires, providing a seamless and secure user experience.

## How it works

### 1. Token Expiration Handling
- **Access Token Lifetime**: Currently set to 10 seconds for testing (normally 30 minutes)
- **Refresh Token Lifetime**: 30 days
- **Automatic Detection**: The system detects when an API request returns a 401 status (unauthorized)

### 2. Automatic Token Refresh
Before logging out the user, the system attempts to refresh the access token using the refresh token:

1. **First Attempt**: When a 401 error occurs, the system calls the `/api/v1/auth/refresh-access-token` endpoint
2. **Success**: If refresh succeeds, the original API request is retried automatically
3. **Failure**: If refresh fails (e.g., refresh token expired), the user is logged out

### 3. User Logout Process
When token refresh fails or no refresh token is available:

1. **Clear Storage**: All authentication data is removed from localStorage
   - `auth-user`
   - `auth-token` 
   - `refresh-token`

2. **User Notification**: A toast notification informs the user that their session expired

3. **Redirect**: User is automatically redirected to the login page (`/auth`)

4. **Context Update**: The auth context is updated to reflect the logged-out state

### 4. Implementation Details

#### Frontend (React/Next.js)
- **Axios Interceptors**: Both `axios.ts` and `api.ts` have response interceptors that handle 401 errors
- **Auth Context**: Listens for custom `token-expired` events and handles logout
- **Toast Notifications**: User-friendly notification when session expires

#### Backend (Node.js/Express)
- **JWT Middleware**: Properly returns 401 status for expired tokens
- **Refresh Endpoint**: `/api/v1/auth/refresh-access-token` for token refresh
- **Session Management**: Manages refresh tokens in database with expiration

### 5. Files Modified

#### Frontend
- `frontend/lib/axios.ts` - Enhanced with automatic token refresh and logout
- `frontend/lib/api.ts` - Enhanced with automatic token refresh and logout  
- `frontend/contexts/auth-context.tsx` - Added token expiration event handling and toast notifications

#### Backend (Temporary Testing Change)
- `backend/src/utils/jwt.utils.js` - Reduced token expiration to 10 seconds for testing

### 6. Testing the Implementation

1. **Login** to the application
2. **Wait 10 seconds** (current test setting) or 30 minutes (production setting)  
3. **Make any API request** (navigate pages, click buttons)
4. **Observe**: 
   - Toast notification appears: "Session Expired - Your session has expired. Please log in again."
   - User is redirected to login page
   - All auth data is cleared

### 7. Production Configuration

**Important**: Remember to change the token expiration back to production values:

```javascript
// In backend/src/utils/jwt.utils.js
{ expiresIn: "30m" } // Change back from "10s" to "30m"
```

### 8. Benefits

- **Security**: Expired tokens are handled immediately
- **User Experience**: Seamless with automatic refresh attempts
- **Reliability**: Multiple fallback mechanisms ensure proper logout
- **Notifications**: Users are informed when logout occurs
- **Consistency**: Same behavior across all API calls

## Usage for Developers

The automatic logout is completely transparent to other parts of the application. Simply use the existing `api` instances from:
- `@/lib/api`  
- `@/lib/axios`

All HTTP requests will automatically handle token expiration and logout as needed.