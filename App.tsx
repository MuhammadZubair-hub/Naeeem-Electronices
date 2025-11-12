import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor, RootState } from './src/redux/store';
import { AppState, StatusBar, View, PanResponder } from 'react-native';
import { useTheme } from './src/hooks/useTheme';
import FlashMessage from 'react-native-flash-message';
import { logout, setisActive } from './src/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppSizes } from './src/utils/AppSizes';
import { fonts } from './src/assets/fonts/Fonts';
import { AppNavigator, AuthNavigator } from './src/Employee/navigation';

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
  //const [isActive, setIsActive] = useState('Customer');
  const user_Catogries = ['Customer', 'Employee'];

  const dispatch = useDispatch();
  const { isAuthenticated ,isActive} = useSelector((state: RootState) => state.auth);
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

  // const renderCategores = ({ item }) => {
  //   const active = isActive === item;

  //   return (
  //     <TouchableOpacity
  //       style={[
  //         styles.loginButton,
  //         {
  //           backgroundColor: active
  //             ? theme.colors.secondaryDark
  //             : theme.colors.white,
  //         },
  //       ]}
  //     >
  //       <Text
  //         style={[
  //           styles.loginButtonText,
  //           { color: active ? theme.colors.white : theme.colors.secondaryDark },
  //         ]}
  //       >
  //         Customer
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
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
  safeArea: {
    flex: 1,
    //zIndex: 2,
    justifyContent: 'center',
    //marginTop: AppSizes.Margin_Vertical_40,

    // alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: AppSizes.Padding_Horizontal_10,
    paddingVertical: AppSizes.Padding_Vertical_5,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: AppSizes.Margin_Vertical_40,
  },
  logoContainer: {
    alignItems: 'center',
    // marginBottom: 32,
    //marginVertical: AppSizes.Margin_Vertical_10,
  },

  glassCard: {
    borderRadius: 24,
    //padding: 12,
    //marginHorizontal: 4,
  },

  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    width: '60%',
    marginBottom: 10,
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    height: '100%',
  },
  loginButtonText: {
    //color: Colors.white,
    fontFamily: fonts.semiBold,
    fontWeight: '500',
    fontSize: 18,
  },
});
