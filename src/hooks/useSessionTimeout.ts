import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

 const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVE_KEY = 'lastActive';
const ACTIVITY_DEBOUNCE = 10 * 1000;

// Module-level flag — resets to false when the app process is killed.
// Set to true only after an explicit login in this JS runtime session.
let _sessionStartedByLogin = false;

export const markSessionStartedByLogin = () => {
  _sessionStartedByLogin = true;
};

export const useSessionTimeout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef(AppState.currentState);
  const isCheckingSession = useRef(false);
  const lastStorageWrite = useRef<number>(0);

  const handleSessionExpired = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
    } catch {}
    dispatch(logout());
  }, [dispatch]);

  const saveLastActive = useCallback(async () => {
    try {
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    } catch {}
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleSessionExpired, IDLE_TIMEOUT);
  }, [handleSessionExpired]);

  // Single entry point for all user activity — resets the countdown timer
  // and throttles AsyncStorage writes to once per ACTIVITY_DEBOUNCE
  const handleUserActivity = useCallback(() => {
    resetIdleTimer();
    const now = Date.now();
    if (now - lastStorageWrite.current > ACTIVITY_DEBOUNCE) {
      lastStorageWrite.current = now;
      saveLastActive();
    }
  }, [resetIdleTimer, saveLastActive]);

  const checkSessionExpiry = useCallback(async (): Promise<boolean> => {
    if (isCheckingSession.current) return false;
    try {
      isCheckingSession.current = true;
      const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (!lastActive) return false;
      return Date.now() - parseInt(lastActive, 10) > IDLE_TIMEOUT;
    } catch {
      return false;
    } finally {
      isCheckingSession.current = false;
    }
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      const prevState = appState.current;
      appState.current = nextAppState;

      // App returning to foreground
      if (prevState.match(/inactive|background/) && nextAppState === 'active') {
        if (!isAuthenticated) return;
        const expired = await checkSessionExpiry();
        if (expired) {
          handleSessionExpired();
        } else {
          await saveLastActive();
          resetIdleTimer();
        }
        return;
      }

      // App going to background or inactive
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (idleTimer.current) {
          clearTimeout(idleTimer.current);
          idleTimer.current = null;
        }
        // Persist timestamp so kill-state check works on next cold start
        await saveLastActive();
      }
    },
    [checkSessionExpiry, handleSessionExpired, resetIdleTimer, saveLastActive, isAuthenticated],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
      return;
    }

    const initSession = async () => {
      // Cold start: app was killed and relaunched — always go to login
      if (!_sessionStartedByLogin) {
        handleSessionExpired();
        return;
      }
      // Normal path: user just logged in this session — check idle timeout
      const expired = await checkSessionExpiry();
      if (expired) {
        handleSessionExpired();
        return;
      }
      await saveLastActive();
      resetIdleTimer();
    };

    initSession();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      subscription.remove();
    };
  }, [isAuthenticated, checkSessionExpiry, handleSessionExpired, resetIdleTimer, saveLastActive, handleAppStateChange]);

  return { handleUserActivity };
};
