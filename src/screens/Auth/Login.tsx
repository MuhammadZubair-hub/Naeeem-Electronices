import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/common/Header';
import { PieGraph } from '../../components/charts/PieGraph';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../utils/AppSizes';
import { useLoginUser } from './login';
import { loginSuccess } from '../../redux/slices/authSlice';
import { LoadingModal } from '../../components/common/LoadingModal';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const loginData = useLoginUser();
  const { credentials, handleChange, handleLogin, isLoading } = loginData;

  return (
    <SafeAreaView style={{ flex: 1, overflow: 'visible' }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true} // ensures keyboard scroll works on Android
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* <Header
        title="Sign In"
        subtitle="Welcome back! Please login to continue."
        showBackButton={false}
      /> */}

        {/* <PieGraph title="Sales by Category" /> */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Naeem Electronics
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Business Management System
            </Text>
          </View>

          <Card style={styles.loginCard}>
            <Text
              style={[styles.loginTitle, { color: theme.colors.textPrimary }]}
            >
              Sign In
            </Text>

            <View>
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  value={loginData.credentials.empId}
                  onChangeText={text => loginData.handleChange('empId', text)}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Password
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  value={loginData.credentials.password}
                  onChangeText={text =>
                    loginData.handleChange('password', text)
                  }
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textTertiary}
                  secureTextEntry
                />
              </View>
            </View>

            <Button
              variant="secondary"
              title="Sign In"
              onPress={() => loginData.handleLogin(loginData.credentials)}
              // loading={isLoading}
              style={styles.loginButton}
            />
          </Card>

          {/* <Card style={styles.demoCard} padding="md">
          <Text style={[styles.demoTitle, { color: theme.colors.textPrimary }]}>
            Quick Login
          </Text>
          {demoCredentials.map((cred, index) => (
            <Button
              key={index}
              title={`${cred.role} - ${cred.email}`}
              onPress={() => fillDemoCredentials(cred.email)}
              variant="ghost"
              size="sm"
              style={styles.demoButton}
            />
          ))}
        </Card> */}
        </View>
      </KeyboardAwareScrollView>

      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: AppSizes.Gap_20,
  },
  title: {
    fontSize: AppSizes.Font_20,
    fontFamily: 'Poppins-Bold',
    marginBottom: AppSizes.Gap_10,
  },
  subtitle: {
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Regular',
  },
  loginCard: {
    marginBottom: AppSizes.Gap_20,
    rowGap: AppSizes.Gap_20,
  },
  loginTitle: {
    fontSize: AppSizes.Font_20,
    fontFamily: 'Poppins-SemiBold',
    // marginBottom: AppSizes.Gap_20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: AppSizes.Gap_10,
  },
  label: {
    fontSize: AppSizes.Font_14,
    fontFamily: 'Poppins-Medium',
    marginBottom: AppSizes.Gap_10,
  },
  input: {
    borderWidth: 1,
    borderRadius: AppSizes.Radius_15,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    paddingVertical: AppSizes.Padding_Vertical_15,
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    marginVertical: AppSizes.Margin_Vertical_10,
    // marginBottom: 16,
  },
  demoText: {
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  demoCard: {
    maxHeight: 300,
  },
  demoTitle: {
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: AppSizes.Margin_Vertical_10,
    textAlign: 'center',
  },
  demoButton: {
    marginBottom: AppSizes.Margin_Vertical_10,
  },
});
