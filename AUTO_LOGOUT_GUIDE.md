# Auto-Logout After 5 Minutes of Inactivity

## Overview
This implementation provides automatic session logout after 5 minutes of inactivity across all app states (foreground, background, and killed).

## How It Works

### 1. **Session Timeout Hook** (`src/hooks/useSessionTimeout.ts`)
The `useSessionTimeout` hook manages the entire session lifecycle:

**Key Features:**
- **Tracks user inactivity**: Monitors the timestamp of the last user activity
- **Detects app state changes**: Listens for foreground/background/inactive states
- **Handles cold starts**: Checks session expiry when app is opened after being killed
- **Debounced updates**: Prevents excessive AsyncStorage writes (updates every 10 seconds minimum)

**Timeout Logic:**
```
5 minutes = 300,000 milliseconds

When a user is inactive for 5 minutes:
1. If app is in foreground → Immediate logout
2. If app is in background/killed → Logout when app is reopened
3. If app is killed → Logout on cold start if timeout has passed
```

### 2. **Activity Tracker Component** (`src/components/common/ActivityTracker.tsx`)
Wraps the main app and tracks user interactions:

**Features:**
- **Captures touch events**: Uses PanResponder to detect all user touches
- **Resets inactivity timer**: Updates the "last active" timestamp on interaction
- **Debounced**: Only updates every 10 seconds to avoid excessive storage writes

### 3. **Updated App Structure** (`App.tsx`)
Simplified main App component that:
- Uses the `useSessionTimeout` hook for session management
- Wraps navigation with `ActivityTracker` for interaction detection
- Maintains Redux authentication state

## Timeline of Events

### Foreground State (App Open):
```
User opens app
    ↓
Timestamp saved to AsyncStorage
    ↓
Idle timer starts (5 minutes)
    ↓
User interaction detected → Timer resets
    ↓
OR: 5 minutes passes without interaction → Auto logout
```

### Background State (App Minimized):
```
User leaves app
    ↓
Timestamp saved to AsyncStorage
    ↓
Idle timer paused
    ↓
Timestamp stays in storage
    ↓
User returns to app
    ↓
Check elapsed time since saved timestamp
    ↓
If > 5 minutes → Auto logout
    ↓
Otherwise → Resume with fresh timer
```

### Killed State (App Closed from Memory):
```
App is killed (force stopped/memory cleared)
    ↓
AsyncStorage persists timestamp
    ↓
User reopens app
    ↓
App cold start
    ↓
Check elapsed time since saved timestamp
    ↓
If > 5 minutes → Auto logout before showing any screen
    ↓
Otherwise → Start fresh session
```

## Implementation Details

### Session Storage
- **Key**: `lastActive`
- **Value**: Timestamp in milliseconds (Date.now())
- **Storage**: React Native AsyncStorage (persists across app kills)
- **Cleanup**: Removed when user manually logs out

### Activity Detection
The system tracks user activity through:
1. **Touch events** (captured by PanResponder in ActivityTracker)
2. **App state changes** (foreground/background transitions)
3. **Navigation events** (implicitly - navigation resets timestamp on resume)

### Console Logging
The implementation includes detailed console logs for debugging:

**Log Categories:**
- `✅ [SESSION]` - Session initialization
- `👆 [USER ACTIVITY]` - User interactions detected
- `📱 [APP STATE]` - App state changes
- `⏱️ [SESSION TIMEOUT]` - Timeout occurred
- `🔄 [TIMER]` - Timer resets
- `⚠️ [SESSION EXPIRED]` - Session validation failed

### Error Handling
- Graceful handling of AsyncStorage errors
- Prevents multiple concurrent session checks
- Safe cleanup of timers on component unmount

## Configuration

### Change Timeout Duration
To adjust the timeout duration, modify in `src/hooks/useSessionTimeout.ts`:

```typescript
const IDLE_TIMEOUT = 5 * 60 * 1000; // Change this value
// 5 * 60 * 1000 = 5 minutes
// For 10 minutes: 10 * 60 * 1000
// For 3 minutes: 3 * 60 * 1000
```

### Disable Activity Tracking (Optional)
If you want to track only app state (not user interactions):
1. Remove `ActivityTracker` wrapper from App.tsx
2. The hook will still work, but timer won't reset on user touches

## Testing the Feature

### Test Case 1: Foreground Timeout
1. Open the app and log in
2. Wait 5 minutes without interacting
3. Expected: Auto logout

### Test Case 2: Foreground with Interaction
1. Open the app and log in
2. Interact with the app (touch screen)
3. Wait 5 minutes
4. Expected: Still logged in (timer was reset)

### Test Case 3: Background Timeout
1. Log in to the app
2. Wait 1 minute
3. Put app in background (iOS: swipe up / Android: Home button)
4. Wait 4+ more minutes
5. Bring app back to foreground
6. Expected: Auto logout

### Test Case 4: Cold Start Timeout
1. Log in to the app
2. Kill the app (force close from app switcher)
3. Wait 5+ minutes
4. Reopen the app
5. Expected: Auto logout before showing authenticated screens

### Test Case 5: Cold Start No Timeout
1. Log in to the app
2. Kill the app
3. Wait 1 minute
4. Reopen the app
5. Expected: Still logged in with fresh 5-minute timer

## Redux Integration

The logout action is dispatched from the `authSlice`:

```typescript
// Dispatches this action
dispatch(logout());

// Which executes:
logout: state => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
}
```

## Browser Console Output Example

```
✅ [SESSION] Initializing session timeout (5 minutes)
✅ [ACTIVITY] Last active timestamp updated
🔄 [TIMER] Idle timer reset - will logout in 5 minutes
👆 [USER ACTIVITY] Detected - resetting inactivity timer
⏱️ [SESSION CHECK] Elapsed since last active: 2 minutes (120s)
✅ [FOREGROUND] Session valid - resuming idle timer
📱 [APP STATE] active → background
⏱️ [SESSION TIMEOUT] 5 minutes of inactivity detected → Logging out
```

## Architecture Advantages

1. **Centralized Logic**: All timeout logic in one hook
2. **Reusable**: Can be imported in any component that needs session tracking
3. **Testable**: Separated concerns make unit testing easier
4. **Efficient**: Debounced updates prevent excessive AsyncStorage writes
5. **Robust**: Handles edge cases like app kills and background timeouts
6. **Observable**: Detailed console logging for debugging

## Notes

- The implementation uses `AsyncStorage` which persists even after app kill
- Timestamps are checked both in foreground and on app resume
- Activity detection is debounced to prevent excessive storage updates
- The feature works seamlessly with Redux persistence
- No additional dependencies required beyond existing packages

## Troubleshooting

**User not logging out after 5 minutes:**
1. Check console logs for session errors
2. Verify `lastActive` is being saved to AsyncStorage
3. Check if user interactions are being detected (👆 logs)
4. Verify `isAuthenticated` state is true

**Logging out too frequently:**
1. Check if user interactions are being detected properly
2. Verify ActivityTracker is wrapping the navigation
3. Check console for "Elapsed since last active" timing

**Session persisting after app kill:**
1. Ensure `lastActive` key is in AsyncStorage
2. Verify cold start check is running (app mount)
3. Check if timestamp is being saved on background
