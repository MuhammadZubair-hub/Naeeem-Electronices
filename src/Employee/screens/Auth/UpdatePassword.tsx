import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../../utils/AppSizes';
import { LoadingModal } from '../../../components/common/LoadingModal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fonts } from '../../../assets/fonts/Fonts';
import { colors } from '../../../styles/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLoginUser } from './login';

// Define the different screen modes
type ForgetPasswordMode = 'ENTER_CNIC' | 'ENTER_OTP' | 'CREATE_PASSWORD';

const UpdatePassword = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const loginData = useLoginUser();

  // State for different modes
  const [userID, setUserID] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const CreatePasswordForm = () => {
    return (
      <View style={styles.inputFieldsContainer}>
        <View style={styles.fieldContainer}>
          <Text
            style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
          >
            User ID
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.white,
                borderColor: 'rgba(255,255,255,0.3)',
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
              style={[
                styles.input,
                {
                  color: theme.colors.textTertiary,
                },
              ]}
              value={userID}
              onChangeText={text => setUserID(text)}
              placeholder="Enter User ID"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              // secureTextEntry={showPassword}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text
            style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
          >
            New Password
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.white,
                borderColor: 'rgba(255,255,255,0.3)',
              },
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
              style={[
                styles.input,
                {
                  color: theme.colors.textTertiary,
                },
              ]}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              placeholder="Enter new password"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={AppSizes.Icon_Height_20}
                color={theme.colors.secondaryDark}
              />
            </TouchableOpacity>
          </View>
        </View>
        <LoadingModal visible={loginData.isLoading} />
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack();
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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
                {
                  color: theme.colors.secondaryDark,
                  fontFamily: fonts.medium,
                },
              ]}
            >
              Change your password
            </Text>

            {CreatePasswordForm()}

            <Button
              variant="secondary"
              title={'Update'}
              onPress={() =>
                loginData.handleUpdatePassword(userID, newPassword)
              }
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.footer} />
      </KeyboardAwareScrollView>

      {/* <LoadingModal visible={loginData.isLoading} /> */}
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
