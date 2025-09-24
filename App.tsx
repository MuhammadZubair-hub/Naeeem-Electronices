import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor, RootState } from './src/redux/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { StatusBar } from 'react-native';
import { useTheme } from './src/hooks/useTheme';

const AppContent = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { theme, isDarkMode } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={theme.colors.secondary}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
