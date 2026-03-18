// import React, { useEffect, useRef, useState } from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { store, persistor, RootState } from './src/redux/store';
// import { AppState, StatusBar, View, PanResponder } from 'react-native';
// import { useTheme } from './src/hooks/useTheme';
// import FlashMessage from 'react-native-flash-message';
// import { logout, setisActive } from './src/redux/slices/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { AppSizes } from './src/utils/AppSizes';
// import { fonts } from './src/assets/fonts/Fonts';
// import { AppNavigator, AuthNavigator } from './src/Employee/navigation';
// import axios from 'axios';

// const App = () => (
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <SafeAreaProvider>
//         <AppContent />
//         <FlashMessage position="top" />
//       </SafeAreaProvider>
//     </PersistGate>
//   </Provider>
// );



// const IDLE_TIMEOUT = 5 * 60 * 1000;

// const AppContent = () => {
//   //const [isActive, setIsActive] = useState('Customer');
//   const user_Catogries = ['Customer', 'Employee'];

//   const dispatch = useDispatch();
//   const { isAuthenticated, isActive } = useSelector(
//     (state: RootState) => state.auth,
//   );

//   const { theme } = useTheme();

//   const idleTimer = useRef<NodeJS.Timeout | null>(null);
//   const appState = useRef(AppState.currentState);

//   const handleLogout = () => {
//     console.log('🕒 User inactive for 10 minutes → Logging out...');
//     dispatch(logout());
//   };

//   const resetIdleTimer = () => {
//     //console.log('👆 Timer reset!');
//     if (idleTimer.current) clearTimeout(idleTimer.current);
//     idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponderCapture: () => {
//         resetIdleTimer();
//         return false; // Don't block the touch event
//       },
//       onMoveShouldSetPanResponderCapture: () => {
//         resetIdleTimer();
//         return false;
//       },
//     }),
//   ).current;

  



//   useEffect(() => {
//     console.log('Inactivity timer initialized');

//     resetIdleTimer();

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => {
//       if (idleTimer.current) clearTimeout(idleTimer.current);
//       subscription.remove();
//     };
//   }, []);

//   const handleAppStateChange = async (nextAppState: any) => {
//     console.log('App state changed:', nextAppState);
//     const SESSION_TIMEOUT = IDLE_TIMEOUT;

//     if (
//       appState.current.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//       const lastActive = await AsyncStorage.getItem('lastActive');
//       const now = Date.now();

//       if (lastActive && now - parseInt(lastActive, 10) > SESSION_TIMEOUT) {
//         dispatch(logout());
//       } else {
//         resetIdleTimer();
//       }
//     } else if (nextAppState === 'background') {
//       await AsyncStorage.setItem('lastActive', Date.now().toString());
//       if (idleTimer.current) clearTimeout(idleTimer.current);
//     }

//     appState.current = nextAppState;
//   };

//   // const renderCategores = ({ item }) => {
//   //   const active = isActive === item;

//   //   return (
//   //     <TouchableOpacity
//   //       style={[
//   //         styles.loginButton,
//   //         {
//   //           backgroundColor: active
//   //             ? theme.colors.secondaryDark
//   //             : theme.colors.white,
//   //         },
//   //       ]}
//   //     >
//   //       <Text
//   //         style={[
//   //           styles.loginButtonText,
//   //           { color: active ? theme.colors.white : theme.colors.secondaryDark },
//   //         ]}
//   //       >
//   //         Customer
//   //       </Text>
//   //     </TouchableOpacity>
//   //   );
//   // };

//   return (
//     <View style={{ flex: 1 }} {...panResponder.panHandlers}>
//       <NavigationContainer>
//         <StatusBar
//           backgroundColor={theme.colors.white}
//           barStyle="dark-content"
//         />

//         {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
//         {/* <AppNavigator /> */}
//       </NavigationContainer>
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     //zIndex: 2,
//     justifyContent: 'center',
//     //marginTop: AppSizes.Margin_Vertical_40,

//     // alignItems: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: AppSizes.Padding_Horizontal_10,
//     paddingVertical: AppSizes.Padding_Vertical_5,
//   },

//   // Header Styles
//   headerContainer: {
//     alignItems: 'center',
//     paddingTop: AppSizes.Margin_Vertical_40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     // marginBottom: 32,
//     //marginVertical: AppSizes.Margin_Vertical_10,
//   },

//   glassCard: {
//     borderRadius: 24,
//     //padding: 12,
//     //marginHorizontal: 4,
//   },

//   buttonContainer: {
//     alignSelf: 'center',
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderRadius: 10,
//     height: 45,
//     width: '60%',
//     marginBottom: 10,
//   },
//   loginButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     width: '50%',
//     height: '100%',
//   },
//   loginButtonText: {
//     //color: Colors.white,
//     fontFamily: fonts.semiBold,
//     fontWeight: '500',
//     fontSize: 18,
//   },
// });

import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, AppState, StatusBar, PanResponder } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor, RootState } from './src/redux/store';
import { useTheme } from './src/hooks/useTheme';
import FlashMessage from 'react-native-flash-message';
import { logout } from './src/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigator, AuthNavigator } from './src/Employee/navigation';

// ✅ 5 minutes idle timeout
const IDLE_TIMEOUT = 1 * 10 * 1000;
const LAST_ACTIVE_KEY = 'lastActive';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <AppContent />
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  // ✅ Stable logout — cleans up storage too
  const handleLogout = useCallback(async () => {
    console.log('🕒 Session expired → Logging out...');
    await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
    dispatch(logout());
  }, [dispatch]);

  // ✅ Reset in-app idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT);
  }, [handleLogout]);

  // ✅ Ref so panResponder always calls latest resetIdleTimer (avoids stale closure)
  const resetIdleTimerRef = useRef(resetIdleTimer);
  useEffect(() => {
    resetIdleTimerRef.current = resetIdleTimer;
  }, [resetIdleTimer]);

  // ✅ panResponder memoized once, uses ref internally
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetIdleTimerRef.current();
        return false; // Don't block touch events
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetIdleTimerRef.current();
        return false;
      },
    }),
  ).current;

  // ✅ Check if session has expired based on saved timestamp
  const checkSessionExpiry = useCallback(async (): Promise<boolean> => {
    try {
      const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (!lastActive) return false;

      const now = Date.now();
      const elapsed = now - parseInt(lastActive, 10);
      console.log(`⏱️ Elapsed since last active: ${Math.round(elapsed / 1000)}s`);

      return elapsed > IDLE_TIMEOUT;
    } catch (error) {
      console.error('Error reading lastActive:', error);
      return false;
    }
  }, []);

  // ✅ Save current timestamp to AsyncStorage
  const saveLastActive = useCallback(async () => {
    try {
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      console.log('💾 lastActive saved');
    } catch (error) {
      console.error('Error saving lastActive:', error);
    }
  }, []);

  // ✅ Handle foreground / background / inactive transitions
  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      console.log(`App state: ${appState.current} → ${nextAppState}`);

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground — check if session expired while away
        const expired = await checkSessionExpiry();

        if (expired) {
          console.log('⏱️ Session expired while in background → Logging out');
          handleLogout();
        } else {
          console.log('✅ Session still valid → Resuming timer');
          await saveLastActive(); // refresh timestamp on resume
          resetIdleTimer();
        }
      } else if (
        nextAppState === 'background' ||
        nextAppState === 'inactive'
      ) {
        // App going to background — save timestamp & pause timer
        await saveLastActive();
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }

      appState.current = nextAppState;
    },
    [checkSessionExpiry, handleLogout, resetIdleTimer, saveLastActive],
  );

  useEffect(() => {
    console.log('✅ App mounted — initializing session');

    const initApp = async () => {
      // ✅ KEY FIX: Cold start check
      // When app is killed, background event may not fire
      // So we check timestamp on every fresh mount
      const expired = await checkSessionExpiry();

      if (expired) {
        console.log('⏱️ App reopened after timeout → Logging out');
        handleLogout();
        return; // Don't start idle timer
      }

      // ✅ Save timestamp immediately on mount
      // Ensures timestamp exists even if app is killed without background firing
      await saveLastActive();

      // ✅ Start idle timer for in-app inactivity
      resetIdleTimer();
    };

    initApp();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      subscription.remove();
    };
  }, [
    checkSessionExpiry,
    handleAppStateChange,
    handleLogout,
    resetIdleTimer,
    saveLastActive,
  ]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={theme.colors.white}
          barStyle="dark-content"
        />
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});