import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../../components/common/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../../utils/AppSizes';
import { LoadingModal } from '../../../components/common/LoadingModal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fonts } from '../../../assets/fonts/Fonts';
import { colors } from '../../../styles/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLoginUser } from './login';

const UpdatePassword = () => {
  const { theme } = useTheme();
  const navigation:any = useNavigation();
  const route = useRoute();
  const params: any = route.params;

  const otpVerified = params?.otpVerified === true;
  const verifiedUserID: string = params?.userID ?? '';

  const loginData = useLoginUser();

  const [userID, setUserID] = useState<string>(verifiedUserID);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handlePress = () => {
    if (!otpVerified) {
      if (!userID.trim()) {
        Alert.alert('Validation', 'Please enter a User ID');
        return;
      }
      (navigation as any).navigate('otp', { flow: 'updatePassword', userID: userID.trim() });
    } else {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        Alert.alert('Validation', 'Please enter and confirm your new password');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Validation', 'Passwords do not match');
        return;
      }
      loginData.handleUpdatePassword(verifiedUserID || userID, newPassword);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.white }]}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glassCard}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainAuth')}>
          {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}> */}
            <Ionicons
              name="arrow-back-outline"
              size={AppSizes.Icon_Height_25}
              color={theme.colors.secondaryDark}
            />
          </TouchableOpacity>

          <View style={{ marginTop: 80 }}>
            <View style={styles.headerContainer}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logo}
              />
            </View>

            <Text
              style={[
                styles.title,
                { color: theme.colors.secondaryDark, fontFamily: fonts.medium },
              ]}
            >
              {otpVerified ? 'Create New Password' : 'Change your password'}
            </Text>

            <View style={styles.inputFieldsContainer}>
              {/* User ID field */}
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}>
                  User ID
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: otpVerified
                        ? '#ebedef' 
                        : theme.colors.white,
                      borderColor: 'rgba(255,255,255,1)',
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person-outline"
                      size={AppSizes.Icon_Height_20}
                      color={theme.colors.secondaryDark}
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { color: theme.colors.textTertiary }]}
                    value={otpVerified ? verifiedUserID : userID}
                    onChangeText={text => setUserID(text)}
                    placeholder="Enter User ID"
                    placeholderTextColor={theme.colors.textTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!otpVerified}
                  />
                  {otpVerified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={AppSizes.Icon_Height_20}
                      color={theme.colors.secondaryDark}
                    />
                  )}
                </View>
              </View>

              {/* Password fields — shown only after OTP verified */}
              {otpVerified && (
                <>
                  <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}>
                      New Password
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        { backgroundColor: theme.colors.white, borderColor: 'rgba(255,255,255,0.3)' },
                      ]}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={AppSizes.Icon_Height_20}
                          color={theme.colors.secondaryDark}
                        />
                      </View>
                      <TextInput
                        style={[styles.input, { color: theme.colors.textTertiary }]}
                        value={newPassword}
                        onChangeText={text => setNewPassword(text)}
                        placeholder="Enter new password"
                        placeholderTextColor={theme.colors.textTertiary}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIconContainer}
                        onPress={() => setShowPassword(p => !p)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={AppSizes.Icon_Height_20}
                          color={theme.colors.secondaryDark}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}>
                      Confirm New Password
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        { backgroundColor: theme.colors.white, borderColor: 'rgba(255,255,255,0.3)' },
                      ]}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={AppSizes.Icon_Height_20}
                          color={theme.colors.secondaryDark}
                        />
                      </View>
                      <TextInput
                        style={[styles.input, { color: theme.colors.textTertiary }]}
                        value={confirmPassword}
                        onChangeText={text => setConfirmPassword(text)}
                        placeholder="Confirm new password"
                        placeholderTextColor={theme.colors.textTertiary}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIconContainer}
                        onPress={() => setShowConfirmPassword(p => !p)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={AppSizes.Icon_Height_20}
                          color={theme.colors.secondaryDark}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              <LoadingModal visible={loginData.isLoading} />
            </View>

            <Button
              variant="secondary"
              title={otpVerified ? 'Update Password' : 'Send OTP'}
              onPress={handlePress}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.footer} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    // alignItems:'center'
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: AppSizes.Padding_Horizontal_10,
    paddingVertical: AppSizes.Padding_Vertical_5,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  headerContainer: {
    alignItems: 'center',
    // marginTop: 80,
  },
  logo: {
    width: 200,
    height: 170,
    resizeMode: 'contain',
  },
  glassCard: {
    padding: 12,
    marginHorizontal: 4,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    fontSize: AppSizes.Font_16,
    fontFamily: fonts.medium,
    marginBottom: AppSizes.Margin_Vertical_20,
    // marginTop: AppSizes.Margin_Vertical_10,
  },
  inputFieldsContainer: {
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  fieldContainer: {
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: AppSizes.Radius_10,
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginRight: AppSizes.Margin_Horizontal_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  eyeIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  actionButton: {
    minHeight: 56,
    borderRadius: AppSizes.Radius_10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  otpTitle: {
    fontSize: AppSizes.Font_14,
    fontFamily: fonts.medium,
    marginBottom: AppSizes.Margin_Vertical_20,
    textAlign: 'center',
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 20,
    width: '80%',
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    //     paddingHorizontal: 10,
    //    paddingVertical: 10,
    borderWidth: 1,
    width: 50,
    height: 50,
  },
  otpInput: {
    //   marginTop:20,
    // height: 40,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  resendContainer: {
    marginTop: AppSizes.Margin_Vertical_10,
  },
  resendText: {
    fontSize: AppSizes.Font_14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  resendLink: {
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
  footer: {
    height: 40,
  },
});
