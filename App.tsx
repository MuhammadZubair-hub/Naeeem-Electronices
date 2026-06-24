import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import DeviceInfo from 'react-native-device-info';
import { API_Config } from './src/Employee/services/apiServices';
import { colors } from './src/styles/theme';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.ne.recovery_app';

const parsePlayStoreVersion = (html: string) => {
  const versionPatterns = [
    /Current Version<\/div>\s*<span[^>]*>\s*<div[^>]*>([^<]+)<\/div>/i,
    /Current Version<\/div>\s*<span[^>]*>([^<]+)<\/span>/i,
    /"softwareVersion">([^<]+)<\/div>/i,
  ];

  for (const pattern of versionPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  const currentVersionIndex = html.indexOf('Current Version');
  if (currentVersionIndex >= 0) {
    const snippet = html.slice(currentVersionIndex, currentVersionIndex + 200);
    const fallbackMatch = snippet.match(/>([0-9]+(?:\.[0-9]+)*)</);
    if (fallbackMatch?.[1]) {
      return fallbackMatch[1].trim();
    }
  }

  return null;
};

const compareVersions = (versionA: string, versionB: string) => {
  const normalize = (value: string) =>
    value
      .split('.')
      .map(part => parseInt(part.replace(/[^0-9]/g, ''), 10) || 0);

  const aParts = normalize(versionA);
  const bParts = normalize(versionB);
  const maxLen = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLen; i += 1) {
    const a = aParts[i] ?? 0;
    const b = bParts[i] ?? 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }

  return 0;
};

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
  const [checkingUpdate, setCheckingUpdate] = useState(true);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [lattestVersion, setlattestCurrentVersion] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const runVersionCheck = async () => {
      try {
        // const version = '1.0.0';
        const version = DeviceInfo.getVersion();
        console.log('🚀 ~ :97 ~ runVersionCheck ~ version:', version);
        setCurrentVersion(version);

        if (Platform.OS === 'android') {
          // const response = await fetch(PLAY_STORE_URL, {
          //   method: 'GET',
          //   headers: {
          //     'User-Agent':
          //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          //   },
          // });
          // const html = await response.text();
          // const storeVersion = parsePlayStoreVersion(html);
          const response = await API_Config.Appversion();
          // console.log(
          //   '🚀 ~ :112 ~ runVersionCheck ~ response:',
          //   response?.data?.data?.version,
          // );
          const AppVersion = response?.data?.data?.version;
          setlattestCurrentVersion(AppVersion);
          if (AppVersion != version) {
            setIsUpdateRequired(true);
          }

          // if (!storeVersion || compareVersions(version, storeVersion) < 0) {
          //   setIsUpdateRequired(true);
          // }
        }
      } catch (error) {
        console.warn('Update check failed', error);
      } finally {
        setCheckingUpdate(false);
      }
    };

    runVersionCheck();
  }, []);

  const openStore = async () => {
    const storeLink = PLAY_STORE_URL;
    const supported = await Linking.canOpenURL(storeLink);
    if (supported) {
      await Linking.openURL(storeLink);
    }
  };

  if (checkingUpdate) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.white },
        ]}
      >
        <Image
          source={require('./src/assets/images/logo.png')}
          style={styles.logos}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
          Checking for update...
        </Text>
      </View>
    );
  }

  if (isUpdateRequired) {
    return (
      <View
        style={[
          styles.updateContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
          <Image
            source={require('./src/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text
            style={[styles.updateTitle, { color: theme.colors.textPrimary }]}
          >
            New Update Available
          </Text>
          <Text
            style={[
              styles.updateMessage,
              { color: theme.colors.textSecondary },
            ]}
          >
            To keep using the app, please install the latest version from Google
            Play Store. Your data and settings will remain safe.
          </Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <Text style={[styles.badgeText, { color: theme.colors.white }]}>
                Current Version: {currentVersion ?? 'Unknown'}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.primaryDark },
              ]}
            >
              <Text style={[styles.badgeText, { color: theme.colors.white }]}>
                Latest Version: {lattestVersion ?? 'Unknown'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={openStore}
          >
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
          <Text
            style={[styles.smallText, { color: theme.colors.textTertiary }]}
          >
            If the Play Store does not open, try again or update manually from
            the Play Store.
          </Text>
        </View>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  updateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  logos: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  updateTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  updateMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    color: '#64748b',
    maxWidth: 320,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 1,
    gap: 10,
    // paddingVertical: 10,
    marginBottom: 24,
  },
  badge: {
    borderRadius: 10,
    // paddingHorizontal: 10,

    paddingVertical: 20,
    // marginHorizontal: 6,
    backgroundColor: colors.accent,
    padding: 10,
    // flex:1,
    gap: 10,
    justifyContent: 'space-between',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  updateButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
  },
});
