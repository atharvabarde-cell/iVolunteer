# Quick Test Guide - Rejection Reason Feature

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend server running (Next.js dev server)
- Admin user account credentials
- At least one pending event in the system

## Test 1: Admin Rejects Event with Reason

### Steps:
1. **Login as Admin**
   - Navigate to `/auth`
   - Login with admin credentials
   
2. **Navigate to Admin Panel**
   - Go to `/admin`
   - Should see "Admin Panel" with shield icon
   
3. **View Pending Events**
   - Click "Pending" tab (should be default)
   - Should see list of pending events with approve/reject buttons
   
4. **Click Reject Button**
   - Click red "Reject" button on any event
   - Dialog should open
   
5. **Verify Dialog Contents**
   - ✅ Title: "Reject Event"
   - ✅ Description: "Please provide a reason for rejecting this event. This will be visible to the event organizer."
   - ✅ Label: "Rejection Reason *"
   - ✅ Empty textarea with placeholder text
   - ✅ Character counter: "0/500 characters"
   - ✅ "Cancel" button (enabled)
   - ✅ "Reject Event" button (disabled - gray)
   
6. **Test Validation**
   - Try typing only spaces
   - ✅ "Reject Event" button should remain disabled
   - Type a single character
   - ✅ "Reject Event" button should enable (red)
   
7. **Type Rejection Reason**
   - Enter: "Event location is not properly verified. Please provide official venue confirmation."
   - ✅ Character counter updates: "89/500 characters"
   - ✅ "Reject Event" button is enabled
   
8. **Submit Rejection**
   - Click "Reject Event" button
   - ✅ Button text changes to "Rejecting..."
   - ✅ All inputs disabled during submission
   - ✅ Dialog closes automatically on success
   - ✅ Event disappears from "Pending" tab
   
9. **Verify Event Moved**
   - Click "Rejected" tab
   - ✅ Event should appear with "Rejected" badge
   - ✅ Count should update: "Rejected (1)"

### Expected Result:
✅ Event rejected successfully with reason stored in database

---

## Test 2: NGO Sees Rejection Reason

### Steps:
1. **Logout from Admin Account**
   - Click profile/logout
   
2. **Login as NGO User**
   - Login with NGO account that created the rejected event
   
3. **View NGO Dashboard**
   - Navigate to `/ngo-dashboard`
   - ✅ Should see red rejection banner at top
   - ✅ Banner text: "{Event Title} got rejected by admin for Event location is not properly verified. Please provide official venue confirmation."
   
4. **View Event in Table**
   - Scroll to "Rejected" tab in events table
   - ✅ Event should have red "Rejected" status badge
   
5. **Click Manage/View Event**
   - Click "Manage" button on rejected event
   - ✅ Modal opens
   
6. **Verify Rejection Alert in Modal**
   - ✅ Red alert box at top of modal
   - ✅ Title: "Event Rejected"
   - ✅ Message: "This event was rejected by the admin."
   - ✅ Reason section: "Reason: Event location is not properly verified. Please provide official venue confirmation."

### Expected Result:
✅ NGO sees rejection reason in both banner and modal

---

## Test 3: Cancel Rejection Dialog

### Steps:
1. **Login as Admin**
2. **Navigate to Admin Panel** (`/admin`)
3. **Click Reject on Pending Event**
   - Dialog opens
4. **Type Partial Reason**
   - Enter: "This event is..."
5. **Click Cancel**
   - ✅ Dialog closes
   - ✅ Event remains in "Pending" tab
   - ✅ Event NOT rejected
6. **Click Reject Again**
   - ✅ Dialog opens with empty textarea (previous text cleared)

### Expected Result:
✅ Cancel aborts rejection without side effects

---

## Test 4: Character Limit Validation

### Steps:
1. **Open Rejection Dialog**
2. **Paste Long Text**
   - Paste text longer than 500 characters
   - ✅ Textarea cuts off at 500 characters
   - ✅ Counter shows: "500/500 characters"
3. **Try to Type More**
   - ✅ Cannot type beyond 500 characters
4. **Submit**
   - ✅ Rejection succeeds with 500 character reason

### Expected Result:
✅ 500 character limit enforced

---

## Test 5: Network Error Handling

### Steps:
1. **Open Rejection Dialog**
2. **Stop Backend Server**
   - Kill the Node.js backend process
3. **Enter Rejection Reason**
   - Type: "Testing error handling"
4. **Click Reject Event**
   - ✅ Button shows "Rejecting..."
   - ✅ Alert appears: "Failed to reject event. Please try again."
   - ✅ Dialog remains open
   - ✅ Typed text still present
5. **Start Backend Server**
6. **Click Reject Event Again**
   - ✅ Rejection succeeds
   - ✅ Dialog closes

### Expected Result:
✅ Error handled gracefully, can retry without losing data

---

## Test 6: Empty Reason Prevention

### Steps:
1. **Open Rejection Dialog**
2. **Verify Initial State**
   - ✅ "Reject Event" button disabled
3. **Type a Character**
   - ✅ Button enables
4. **Delete All Text**
   - ✅ Button disables again
5. **Type Spaces Only**
   - Type: "    " (multiple spaces)
   - ✅ Button remains disabled (whitespace validation)
6. **Type Valid Reason**
   - Type: "Valid reason"
   - ✅ Button enables
7. **Submit**
   - ✅ Rejection succeeds

### Expected Result:
✅ Cannot submit empty or whitespace-only reasons

---

## Test 7: Multiple Rejections in Sequence

### Steps:
1. **Reject First Event**
   - Open dialog, enter reason: "Reason 1", submit
   - ✅ Success
2. **Reject Second Event**
   - Open dialog
   - ✅ Textarea is empty (previous reason cleared)
   - Enter reason: "Reason 2", submit
   - ✅ Success
3. **Reject Third Event**
   - Open dialog
   - ✅ Textarea is empty
   - Enter reason: "Reason 3", submit
   - ✅ Success

### Expected Result:
✅ Each rejection starts with clean state

---

## Test 8: Rejection Reason Display Variations

### Create Test Events:
1. **Event A**: Reject with reason "Short reason"
2. **Event B**: Reject with reason "This is a very long rejection reason that spans multiple lines and explains in great detail why the event was rejected including specific policy violations and suggestions for improvement"
3. **Event C**: Reject with reason containing special characters: "Event doesn't meet criteria: §1.2 & §3.4 (see policy)"

### Verify Display:
**NGO Dashboard Banner:**
- ✅ Event A shows short reason inline
- ✅ Event B shows full long reason (wraps properly)
- ✅ Event C shows special characters correctly

**Event Modal:**
- ✅ Event A shows reason in alert box
- ✅ Event B wraps text properly in modal
- ✅ Event C displays special characters correctly

### Expected Result:
✅ All reason lengths and character types display correctly

---

## Test 9: Approval Clears Rejection Reason

### Steps:
1. **Create New Event as NGO**
2. **Login as Admin**
3. **Reject Event with Reason**
   - Reason: "Initial rejection"
   - ✅ Event moves to "Rejected" tab
4. **Re-approve Event**
   - Go to "Rejected" tab
   - Find event
   - (If approve button exists on rejected events, click it)
   - OR use API/database to set status back to "approved"
5. **Check Database**
   - ✅ `rejectionReason` field should be empty string

### Expected Result:
✅ Approving event clears rejection reason

---

## Test 10: Accessibility & UX

### Keyboard Navigation:
1. **Open Dialog**
2. **Tab Through Elements**
   - ✅ Focus moves: Textarea → Cancel → Reject Event
   - ✅ Visual focus indicators present
3. **Type Reason**
   - ✅ Textarea accessible via keyboard
4. **Press Tab to Reject Button**
5. **Press Enter**
   - ✅ Rejection submitted

### Screen Reader (Optional):
- ✅ Label associated with textarea
- ✅ Description read by screen reader
- ✅ Button states announced

### Mobile Responsive:
1. **Open on Mobile/Narrow Screen**
   - ✅ Dialog fits screen
   - ✅ Buttons stack properly
   - ✅ Textarea usable on mobile keyboard

### Expected Result:
✅ Feature accessible and usable for all users

---

## Browser Console Checks

### During Rejection:
**Admin Panel:**
```javascript
// Should see in console (if debug logs present):
"Selected event:" {id: "...", title: "...", ...}
"Rejection reason:" "Event location is not properly verified..."
```

**NGO Dashboard:**
```javascript
// Should see in console:
"Fetched events:" [...]
"Rejected events:" [{rejectionReason: "Event location is not properly verified...", ...}]
```

### Network Tab:
**Request to:** `PUT http://localhost:5000/api/v1/event/status/{eventId}`
```json
{
  "status": "rejected",
  "rejectionReason": "Event location is not properly verified. Please provide official venue confirmation."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Event rejected successfully",
  "event": {
    "_id": "...",
    "status": "rejected",
    "rejectionReason": "Event location is not properly verified. Please provide official venue confirmation.",
    ...
  }
}
```

---

## Common Issues & Troubleshooting

### Issue 1: Dialog Not Opening
**Symptom:** Clicking "Reject" does nothing
**Check:**
- Browser console for errors
- Dialog component imported correctly
- `showRejectDialog` state updating
**Fix:** Verify imports and state management

### Issue 2: Rejection Reason Not Saving
**Symptom:** Dialog works but reason not in database
**Check:**
- Network tab - is `rejectionReason` in request body?
- Backend logs - is field being saved?
- Database - check Event document
**Fix:** Verify backend service updates `rejectionReason` field

### Issue 3: NGO Not Seeing Reason
**Symptom:** Admin sees dialog, but NGO sees no reason
**Check:**
- API response includes `rejectionReason`
- Frontend maps field correctly
- Conditional rendering logic
**Fix:** Check events-context mapping and component rendering

### Issue 4: Button Not Enabling
**Symptom:** Type text but button stays disabled
**Check:**
- `onChange` handler updating state
- Trim logic in `disabled` prop
- React DevTools state value
**Fix:** Verify state updates and validation logic

---

## Success Criteria

### All Tests Pass When:
✅ Dialog opens on "Reject" click
✅ Validation prevents empty submissions
✅ Character limit enforced (500 max)
✅ Rejection submitted successfully
✅ Event moves to "Rejected" tab
✅ NGO sees reason in dashboard banner
✅ NGO sees reason in event modal
✅ Cancel works without side effects
✅ Error handling shows user-friendly messages
✅ Multiple rejections work correctly
✅ No console errors
✅ TypeScript compiles without errors
✅ Network requests show correct payload
✅ Database persists rejection reason

---

## Quick Verification Checklist

**Admin Panel:**
- [ ] Dialog UI displays correctly
- [ ] Validation works (required, max length)
- [ ] Loading state shows during submission
- [ ] Success closes dialog
- [ ] Error keeps dialog open
- [ ] Cancel aborts without action

**NGO Dashboard:**
- [ ] Rejection banner shows
- [ ] Banner contains event title and reason
- [ ] Banner click navigates to rejected tab

**NGO Event Modal:**
- [ ] Rejection alert displays
- [ ] Reason text shown
- [ ] Fallback message for empty reason

**Backend:**
- [ ] API receives rejection reason
- [ ] Database stores reason
- [ ] API returns reason in responses

**Overall:**
- [ ] Complete flow: Admin rejects → NGO sees
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Responsive design works
- [ ] Accessibility tested

---

## Test Data Examples

### Good Rejection Reasons:
1. "Event location is not properly verified. Please provide official venue confirmation."
2. "Event description lacks important details about participant requirements."
3. "Event timing conflicts with another approved event in the same area."
4. "Insufficient safety measures outlined for this type of activity."
5. "Event does not align with community volunteer guidelines (see section 4.2)."

### Edge Case Reasons:
1. **Minimum:** "x" (1 character - valid)
2. **Maximum:** (500 characters of text - valid)
3. **Special Chars:** "Event doesn't meet §1.2 & §3.4 criteria (see policy #5)"
4. **Newlines:** "Reason line 1\nReason line 2\nReason line 3"
5. **Empty:** "" (should be prevented by validation)

---

## Post-Testing Cleanup

### Optional: Remove Debug Code
If all tests pass, consider removing debug logging from:
- `frontend/components/Ngoeventtable.tsx`
- `frontend/contexts/events-context.tsx`

### Optional: Add Analytics
Track rejection reason metrics:
- Most common rejection reasons
- Average reason length
- Rejection rate by event category

---

## Summary

This test guide covers all critical paths, edge cases, and error scenarios for the rejection reason feature. Following these tests ensures the feature works correctly across the entire user journey from admin input to NGO display.

**Estimated Test Time:** 15-20 minutes for complete manual testing
**Critical Tests:** 1, 2, 6 (must pass for feature to be usable)
**Recommended Tests:** All tests for production deployment
