import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../utils/AppSizes';
import { useLoginUser } from './login';
import { LoadingModal } from '../../components/common/LoadingModal';
import Ionicons from '@react-native-vector-icons/ionicons';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [showPswd, setShowPswd] = useState<boolean>(true);

  const loginData = useLoginUser();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* App Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/naeemLogo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={[styles.welcome, { color: theme.colors.textPrimary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <Text style={[styles.loginTitle, { color: theme.colors.textPrimary }]}>
            Sign In
          </Text>

        
          <View style={[styles.inputContainer,{backgroundColor: theme.colors.surfaceVariant,}]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.secondary}
              style={styles.icon}
            />
            <TextInput
              style={[
                styles.input,
                {
                 // backgroundColor: theme.colors.surfaceVariant,
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

         
         <View style={[styles.inputContainer,{backgroundColor: theme.colors.surfaceVariant,}]}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.secondary}
              style={styles.icon}
            />
            <TextInput
              style={[
                styles.input,
                {
                  //backgroundColor: theme.colors.surfaceVariant,
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
              secureTextEntry={showPswd}
            />
            <Ionicons
              name={showPswd ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={theme.colors.secondary}
              style={styles.eyeIcon}
              onPress={() => setShowPswd(!showPswd)}
            />
          </View>

          {/* Sign In Button */}
          <Button
            variant="secondary"
            title="Sign In"
            onPress={() => loginData.handleLogin(loginData.credentials)}
            style={styles.loginButton}
          />
        </Card>
      </KeyboardAwareScrollView>

      <LoadingModal visible={loginData.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    paddingVertical: AppSizes.Padding_Vertical_10,
  },
  header: {
    alignItems: 'center',
    marginBottom: AppSizes.Gap_20,
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: AppSizes.Gap_10,
  },
  welcome: {
    fontSize: AppSizes.Font_20,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: AppSizes.Font_14,
    fontFamily: 'Poppins-Regular',
  },
  loginCard: {
    borderRadius: AppSizes.Radius_20,
    padding: AppSizes.Padding_Horizontal_20,
    rowGap: AppSizes.Gap_20,
    elevation: 5,
  },
  loginTitle: {
    fontSize: AppSizes.Font_18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: AppSizes.Gap_10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: AppSizes.Radius_15,
    marginBottom: AppSizes.Gap_10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: AppSizes.Padding_Vertical_10,
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  loginButton: {
    marginTop: AppSizes.Gap_10,
  },
});
