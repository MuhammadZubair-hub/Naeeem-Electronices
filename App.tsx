// import React, { useEffect, useRef, useState } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { store, persistor, RootState } from './src/redux/store';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { AuthNavigator } from './src/navigation/AuthNavigator';
// import { AppState, Pressable, StatusBar } from 'react-native';
// import { useTheme } from './src/hooks/useTheme';
// import FlashMessage from 'react-native-flash-message';
// import { logout } from './src/redux/slices/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AppContent = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const { theme, isDarkMode } = useTheme();

//   // #region AppIdolTime
//   const [time, setTime] = useState(0);
//   const idolTime = 10;

//   const resetIdleTimer = () => {
//     console.log('function call after 10 min');
//     dispatch(logout());
//     setTime(0);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(prevTime => {
//          console.log('no i have run after 1 min' )
//         return prevTime + 1
//       });
//     }, 1000 * 60);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (time == idolTime) {
//       console.log('no i have run')
//       resetIdleTimer();
//     }
//   }, [time]);

//   // #endregion

//   // #region AppStateCheck
//   const appState = useRef(AppState.currentState);
//   const SESSION_TIMEOUT = 10 * 60 * 1000;
//   useEffect(() => {
//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => subscription.remove();
//   }, []);

//   const handleAppStateChange = async (nextAppState: any) => {
//     if (
//       appState.current.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//       const lastActive = await AsyncStorage.getItem('lastActive');
//       const now = Date.now();

//       if (lastActive && now - parseInt(lastActive, 10) > SESSION_TIMEOUT) {
//         dispatch(logout());
//       }
//     } else if (nextAppState === 'background') {
//       await AsyncStorage.setItem('lastActive', Date.now().toString());
//     }

//     appState.current = nextAppState;
//   };
//   // #endregion

//   return (
//     // <NavigationContainer>
//     //   <StatusBar
//     //     backgroundColor={theme.colors.secondaryDark}
//     //     barStyle={'light-content'}
//     //     // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//     //   />
//     //   {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
//     // </NavigationContainer>

//     <Pressable
//       style={{ flex: 1 }}
//       onPress={() => {
//         console.log('I am touched'), setTime(0);
//       }}
//     >
//       <NavigationContainer>
//         <StatusBar
//           backgroundColor={theme.colors.secondaryDark}
//           barStyle={'light-content'}
//           // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         />
//         {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
//       </NavigationContainer>
//     </Pressable>
//   );
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <SafeAreaProvider>
//           <AppContent />
//           <FlashMessage position="top" />
//         </SafeAreaProvider>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default App;

import React, { useEffect, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor, RootState } from './src/redux/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AppState, StatusBar, View, PanResponder } from 'react-native';
import { useTheme } from './src/hooks/useTheme';
import FlashMessage from 'react-native-flash-message';
import { logout } from './src/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const IDLE_TIMEOUT = 10 * 60 * 1000;

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const handleLogout = () => {
    console.log('🕒 User inactive for 10 minutes → Logging out...');
    dispatch(logout());
  };

  const resetIdleTimer = () => {
    //console.log('👆 Timer reset!');
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetIdleTimer();
        return false; // Don't block the touch event
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetIdleTimer();
        return false;
      },
    }),
  ).current;

  useEffect(() => {
    console.log('Inactivity timer initialized');

    resetIdleTimer();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: any) => {
    console.log('App state changed:', nextAppState);
    const SESSION_TIMEOUT = IDLE_TIMEOUT;

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const lastActive = await AsyncStorage.getItem('lastActive');
      const now = Date.now();

      if (lastActive && now - parseInt(lastActive, 10) > SESSION_TIMEOUT) {
        dispatch(logout());
      } else {
        resetIdleTimer();
      }
    } else if (nextAppState === 'background') {
      await AsyncStorage.setItem('lastActive', Date.now().toString());
      if (idleTimer.current) clearTimeout(idleTimer.current);
    }

    appState.current = nextAppState;
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={theme.colors.secondaryDark}
          barStyle="light-content"
        />
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
};

export default App;
