import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { login } from '../../redux/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
  };

  const demoCredentials = [
    { email: 'ceo@ne.com', role: 'CEO' },
    { email: 'gm@ne.com', role: 'General Manager' },
    { email: 'rm@ne.com', role: 'Regional Manager' },
    { email: 'zm@ne.com', role: 'Zone Manager' },
    { email: 'br@ne.com', role: 'Branch Manager' },
    { email: 'avo@ne.com', role: 'Area Sales Officer' },
  ];

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Naeem Electronics
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Business Management System
          </Text>
        </View>

        <Card style={styles.loginCard} padding="lg">
          <Text style={[styles.loginTitle, { color: theme.colors.textPrimary }]}>
            Sign In
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
            />
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <Text style={[styles.demoText, { color: theme.colors.textTertiary }]}>
            Demo Credentials (Password: 123)
          </Text>
        </Card>

        <Card style={styles.demoCard} padding="md">
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
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loginCard: {
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  demoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  demoCard: {
    maxHeight: 300,
  },
  demoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    marginBottom: 8,
  },
});
