# RESTART CHECKLIST - Do These Steps in Order

## ⚠️ IMPORTANT: You MUST restart backend for changes to take effect!

### Step 1: Stop Backend
In the terminal where backend is running:
```
Press Ctrl + C
```
Wait until it says "Process terminated" or similar

---

### Step 2: Start Backend
```bash
cd backend
npm start
```

Wait for: `Server is running on port 5000` (or your port)

**⚠️ DO NOT PROCEED until you see this message!**

---

### Step 3: Verify Backend is Using New Code

In backend terminal, you should see these NEW log messages when you visit Groups page:

```
getGroups called: { hasUser: true, userId: '670e085441cb5b4694a5d04ff' }
Group membership check: {
  groupName: 'Environmental Cleanup',
  userId: '670e085441cb5b4694a5d04ff',
  isCreator: false,
  memberEntry: 'found',
  isMember: true,
  totalMembers: 5
}
```

**If you DON'T see these logs:** The backend is NOT running the new code

---

### Step 4: Hard Reload Browser

**Windows/Linux:**
```
Ctrl + Shift + R
```

**Mac:**
```
Cmd + Shift + R
```

**Or:**
1. Open DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"

---

### Step 5: Check Browser Console

Open DevTools (F12) → Console tab

You should see:
```
getGroups - Auth Debug: { hasToken: true, tokenLength: 150, ... }
getGroups - Response Debug: { totalGroups: 3, firstGroupHasIsMember: true, ... }
GroupCard Debug: { groupId: "...", isMember: true, ... }
```

**If you see `hasToken: false`:**
- Log out and log in again

**If you see `isMember: undefined`:**
- Backend is NOT running new code - restart again

---

### Step 6: Test a Group

1. Go to Groups page
2. Find a group you HAVE joined
3. Look at the buttons:
   - ✅ Should show: "View Group" + "Leave"
   - ❌ If shows: "View Details" + "Join" → Problem not fixed

4. Click "View Group" to open details
5. Check the header buttons:
   - ✅ Should show: "Leave" button
   - ❌ If shows: "Join Group" → Problem not fixed

---

## 🔴 If Still Showing Wrong Buttons After All Steps:

### Nuclear Option - Complete Reset:

1. **Stop backend** (Ctrl + C)

2. **Clear browser completely:**
   ```
   Ctrl + Shift + Delete
   → Check "Cached images and files"
   → Check "Cookies and other site data"
   → Click "Clear data"
   ```

3. **Close ALL browser tabs**

4. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

5. **Open browser fresh**

6. **Log in**

7. **Go to Groups page**

8. **Check console logs** - should see all debug messages

---

## 🎯 Success Indicators

You'll know it's working when:

### Backend Terminal Shows:
```
✅ getGroups called: { hasUser: true, userId: '...' }
✅ Group membership check: { isMember: true, ... }
```

### Browser Console Shows:
```
✅ getGroups - Auth Debug: { hasToken: true, ... }
✅ getGroups - Response Debug: { firstGroupHasIsMember: true, ... }
✅ GroupCard Debug: { isMember: true, userRole: "member" }
```

### UI Shows:
```
✅ Joined groups: "View Group" + "Leave" buttons
✅ Not joined groups: "View Details" + "Join" buttons
✅ Group details page: Correct button based on membership
```

---

## 🆘 Still Not Working?

Share these details:

1. **Backend logs** - Copy what you see in backend terminal
2. **Browser console logs** - Copy what you see in DevTools Console
3. **What buttons you see** - For both main page and details page
4. **Network tab** - Open DevTools → Network → Find `/api/v1/groups` request → Show Response

The problem is either:
- Backend not restarted (most common!)
- Browser cache not cleared
- Not logged in / token expired
- Code changes not saved

**RESTART BACKEND FIRST!** This fixes 90% of issues.
