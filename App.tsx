import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor, RootState } from './src/redux/store';
import { useTheme } from './src/hooks/useTheme';
import FlashMessage from 'react-native-flash-message';
import { AppNavigator, AuthNavigator } from './src/Employee/navigation';
import { useSessionTimeout } from './src/hooks/useSessionTimeout';
import { ActivityTracker } from './src/components/common/ActivityTracker';

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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const { handleUserActivity } = useSessionTimeout();

  return (
    <ActivityTracker style={styles.container} onActivity={handleUserActivity}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={theme.colors.white}
          barStyle="dark-content"
        />
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </ActivityTracker>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
