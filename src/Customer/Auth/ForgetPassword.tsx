// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ImageBackground,
//   BackHandler,
//   Alert,
// } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../../redux/store';
// import { useTheme } from '../../hooks/useTheme';
// import { Button } from '../../components/common/Button';
// import { Card } from '../../components/common/Card';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AppSizes } from '../../utils/AppSizes';
// import { useLoginUser } from './login';
// import { LoadingModal } from '../../components/common/LoadingModal';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { fonts } from '../../assets/fonts/Fonts';
// import { colors } from '../../styles/theme';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// // import { BlurView } from '@react-native-community/blur';

// const ForgetPassword = () => {
//   const { theme } = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation();
//   const loginData = useLoginUser();

//   const [showPswd, setShowPswd] = useState<boolean>(true);

//   const [firstResponse, setFirstReponse] = useState(false);

//   const Input = ({ value, onchangetext, onBlur }) => {
//     // const { theme } = useThemeContext();
//     // const Colors = getColors(theme);

//     return (
//       <View
//         style={[
//           styles.maininputContainer,
//           {
//             backgroundColor: theme.colors.white,
//             borderColor: theme.colors.primaryDark,
//             paddingVertical: 8,
//             flex: 1,
//           },
//         ]}
//       >
//         <TextInput
//           style={[
//             styles.inputContainer,
//             {
//               color: theme.colors.white,
//               height: 40, // Height zaroori hai!
//               textAlign: 'center',
//               fontSize: 16,
//             },
//           ]}
//           keyboardType="numeric"
//           value={value}
//           placeholderTextColor={theme.colors.primaryDark}
//           onChangeText={onchangetext}
//           onBlur={onBlur}
//           maxLength={1}
//         />
//       </View>
//     );
//   };

//   const OPTVerify = () => {
//     console.log('main aa gaya')
//     return (
//       <View
//         style={{
//           justifyContent: 'center',
//           flexDirection: 'row',
//           columnGap: 20,
//           width: '80%',
//           alignSelf: 'center',
//         }}
//       >
//         <Input value="q2" onchangetext="sd" onBlur="sd" />
//         <Input value="q2" onchangetext="sd" onBlur="sd" />
//         <Input value="q2" onchangetext="sd" onBlur="sd" />
//         <Input value="q2" onchangetext="sd" onBlur="sd" />
//       </View>
//     );
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       const backAction = () => {
//         Alert.alert(
//           '',
//           'Do you want to exit the app?',
//           [
//             {
//               text: 'Cancel',
//               onPress: () => null,
//               style: 'cancel',
//             },
//             {
//               text: 'YES',
//               onPress: () => BackHandler.exitApp(),
//             },
//           ],
//           { cancelable: true },
//         );
//         return true; // prevent default back behavior
//       };

//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         backAction,
//       );

//       // Cleanup when leaving the screen
//       return () => backHandler.remove();
//     }, []),
//   );

//   const handleSignup = () => {
//     console.log('handle signup');
//     setFirstReponse(prev => !prev);
//     return;
//   };

//   return (
//     <SafeAreaView
//       style={[styles.safeArea, { backgroundColor: theme.colors.white }]}
//     >
//       <KeyboardAwareScrollView
//         enableOnAndroid
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.glassCard}>
//           <View style={styles.headerContainer}>
//             <Image
//               source={require('../../assets/images/logo.png')}
//               style={{ width: 200, height: 170, resizeMode: 'contain' }}
//             />
//           </View>

//           {firstResponse ? (
//             <>
//               <Text
//                 onPress={() => navigation.goBack()}
//                 style={[
//                   styles.fieldLabel,

//                   {
//                     color: theme.colors.gray600,
//                     textAlign: 'center',
//                     fontSize: AppSizes.Font_16,
//                   },
//                 ]}
//               >
//                 Enter your CNIC To get OTP to your register number?
//               </Text>

//               {/* Input Fields Container */}
//               <View style={styles.inputFieldsContainer}>
//                 {/* User ID Input */}
//                 <View style={styles.fieldContainer}>
//                   <Text
//                     style={[
//                       styles.fieldLabel,
//                       { color: theme.colors.secondaryDark },
//                     ]}
//                   >
//                     CNIC
//                   </Text>
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       {
//                         backgroundColor: theme.colors.white,
//                         borderColor: 'rgba(255,255,255,0.3)',
//                       },
//                     ]}
//                   >
//                     <View style={styles.iconContainer}>
//                       <Ionicons
//                         name="person-outline"
//                         size={AppSizes.Icon_Height_20}
//                         color={theme.colors.secondaryDark}
//                       />
//                     </View>
//                     <TextInput
//                       style={[
//                         styles.input,
//                         {
//                           color: theme.colors.textTertiary,
//                         },
//                       ]}
//                       value={loginData.credentials.empId}
//                       onChangeText={text =>
//                         loginData.handleChange('empId', text)
//                       }
//                       placeholder="Enter your CNIC"
//                       placeholderTextColor={theme.colors.textTertiary}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       editable={!firstResponse}
//                       maxLength={13}
//                       keyboardType="number-pad"
//                     />
//                   </View>
//                 </View>
//               </View>

//               <Button
//                 variant="secondary"
//                 title="Send"
//                 onPress={() => {
//                   handleSignup();
//                 }}
//                 style={styles.loginButton}
//               />
//             </>
//           ) : (
//             <>
//               <Text
//                 onPress={() => navigation.goBack()}
//                 style={[
//                   styles.fieldLabel,

//                   {
//                     color: theme.colors.gray600,
//                     textAlign: 'center',
//                     fontSize: AppSizes.Font_16,
//                   },
//                 ]}
//               >
//                 Enter your CNIC To get OTP to your register number?
//               </Text>
//               <OPTVerify/>
//               <Button
//                 variant="secondary"
//                 title="Verify OTP"
//                 onPress={() => {
//                   handleSignup();
//                 }}
//                 style={styles.loginButton}
//               />
//             </>
//           )}
//         </View>

//         {/* Footer Spacing */}
//         <View style={styles.footer} />
//       </KeyboardAwareScrollView>

//       <LoadingModal visible={loginData.isLoading} />
//     </SafeAreaView>
//   );
// };

// export default ForgetPassword;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     //zIndex: 2,
//     justifyContent: 'center',
//     //marginTop: AppSizes.Margin_Vertical_40,

//     // alignItems: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: AppSizes.Padding_Horizontal_10,
//     paddingVertical: AppSizes.Padding_Vertical_5,
//   },

//   // Header Styles
//   headerContainer: {
//     alignItems: 'center',
//     //paddingTop: AppSizes.Margin_Vertical_40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     // marginBottom: 32,
//     marginVertical: AppSizes.Margin_Vertical_40,
//   },
//   brandTitle: {
//     fontSize: 32,
//     fontFamily: fonts.bold,
//     textAlign: 'center',
//     marginBottom: 8,
//     letterSpacing: 1,
//   },
//   brandUnderline: {
//     width: 60,
//     height: 3,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 2,
//   },
//   titleContainer: {
//     alignItems: 'center',
//   },
//   welcomeTitle: {
//     fontSize: 28,
//     fontFamily: fonts.bold,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   welcomeSubtitle: {
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//     textAlign: 'center',
//   },

//   // Glass Card Effect
//   glassCard: {
//     // borderRadius: 24,
//     padding: 12,
//     marginHorizontal: 4,
//   },
//   cardHeader: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   loginTitle: {
//     fontSize: 24,
//     fontFamily: fonts.medium,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   titleUnderline: {
//     width: 60,
//     height: 3,
//     borderRadius: 2,
//   },

//   // Input Fields Styles
//   inputFieldsContainer: {
//     marginBottom: AppSizes.Margin_Vertical_10,
//     // borderRadius :10,
//     // borderWidth: 2,
//     // borderColor :'black'
//   },
//   fieldContainer: {
//     marginBottom: AppSizes.Margin_Vertical_20,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontFamily: fonts.medium,
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderRadius: AppSizes.Radius_10,
//     paddingHorizontal: 16,
//     minHeight: 56,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   iconContainer: {
//     marginRight: AppSizes.Margin_Horizontal_10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: AppSizes.Margin_Vertical_5,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//     //paddingVertical: AppSizes.Padding_Vertical_15,
//   },
//   eyeIconContainer: {
//     padding: 4,
//     marginLeft: 8,
//   },

//   // Button Styles
//   buttonContainer: {
//     marginBottom: 8,
//   },
//   maininputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderWidth: 1,
//   },
//   loginButton: {
//     minHeight: 56,
//     borderRadius: AppSizes.Radius_10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   // Footer
//   footer: {
//     height: 40,
//   },
// });

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import OtpInput, { OtpInputHandle } from '../../components/common/OtpInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../utils/AppSizes';
import { useLoginUser } from './login';
import { LoadingModal } from '../../components/common/LoadingModal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fonts } from '../../assets/fonts/Fonts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useOtpManager } from '../../hooks/useOtpManager';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';

// Define the different screen modes
type ForgetPasswordMode = 'ENTER_CNIC' | 'ENTER_OTP' | 'CREATE_PASSWORD';

const ForgetPassword = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const loginData = useLoginUser();

  const [mode, setMode] = useState<ForgetPasswordMode>('ENTER_CNIC');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const [cnic, setCnic] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // Phone number resolved from CNIC lookup — replace with real API value
  const [lookupPhone, setLookupPhone] = useState<string>('');

  const otpInputRef = useRef<OtpInputHandle>(null);
  const currentOtp = useRef('');

  const { sendOtp, verifyOtp, resendOtp, countdown, canResend, isSending: isOtpSending } =
    useOtpManager({
      onOtpRead: code => {
        currentOtp.current = code;
        otpInputRef.current?.autoFill(code);
      },
    });

  // Auto-send OTP the first time user enters OTP mode
  useEffect(() => {
    if (mode === 'ENTER_OTP') {
      sendOtp(lookupPhone).then(result => {
        if (!result.success) {
          showMessage({
            message: 'Could not send OTP',
            description: result.error,
            type: 'danger',
            style: CommonStyles.error,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const OTPSection = () => {
    const formatCountdown = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleResend = async () => {
      otpInputRef.current?.clear();
      currentOtp.current = '';
      const result = await resendOtp();
      if (!result.success) {
        showMessage({
          message: 'Could not resend OTP',
          description: result.error,
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    };

    return (
      <View style={styles.otpContainer}>
        <OtpInput
          ref={otpInputRef}
          length={4}
          themeColor={theme.colors.secondaryDark}
          backgroundColor={theme.colors.white}
          disabled={isOtpSending}
          onChange={code => { currentOtp.current = code; }}
        />
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={canResend ? handleResend : undefined}
          disabled={!canResend && countdown > 0}
        >
          <Text style={[styles.resendText, { color: theme.colors.gray400 }]}>
            Didn't receive code?{' '}
            <Text
              style={[
                styles.resendLink,
                {
                  color: canResend
                    ? theme.colors.secondaryDark
                    : theme.colors.secondaryDark + '50',
                },
              ]}
            >
              {canResend ? 'Resend OTP' : `Resend (${formatCountdown(countdown)})`}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CreatePasswordForm = () => {
    return (
      <View style={styles.inputFieldsContainer}>
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
              onChangeText={setNewPassword}
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

        <View style={styles.fieldContainer}>
          <Text
            style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
          >
            Confirm Password
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={AppSizes.Icon_Height_20}
                color={theme.colors.secondaryDark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const CNICForm = () => {
    return (
      <View style={styles.inputFieldsContainer}>
        <View style={styles.fieldContainer}>
          <Text
            style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
          >
            CNIC
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
              value={cnic}
              onChangeText={setCnic}
              placeholder="Enter your CNIC"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={13}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
    );
  };

  const getTitle = () => {
    switch (mode) {
      case 'ENTER_CNIC':
        return 'Enter your CNIC to get OTP to your registered number';
      case 'ENTER_OTP':
        return 'Enter OTP sent to your registered number';
      case 'CREATE_PASSWORD':
        return 'Create New Password';
      default:
        return 'Forgot Password';
    }
  };

  const getButtonTitle = () => {
    switch (mode) {
      case 'ENTER_CNIC':
        return 'Send OTP';
      case 'ENTER_OTP':
        return 'Verify OTP';
      case 'CREATE_PASSWORD':
        return 'Reset Password';
      default:
        return 'Continue';
    }
  };

  const handleButtonPress = () => {
    switch (mode) {
      case 'ENTER_CNIC':
        // Handle CNIC submission and API call
        console.log('CNIC submitted:', cnic);
        setMode('ENTER_OTP');
        break;
      case 'ENTER_OTP':
        // Handle OTP verification
        // console.log('OTP submitted:', otp.join(''));
        setMode('CREATE_PASSWORD');
        break;
      case 'CREATE_PASSWORD':
        // Handle password reset
        console.log('New password:', newPassword);
        // Navigate to login or show success message
        Alert.alert('Success', 'Password reset successfully!');
        navigation.goBack();
        break;
    }
  };

  const handleBack = () => {
    if (mode === 'ENTER_OTP') {
      setMode('ENTER_CNIC');
    } else if (mode === 'CREATE_PASSWORD') {
      setMode('ENTER_OTP');
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (mode !== 'ENTER_CNIC') {
          handleBack();
          return true; // Prevent default back behavior
        }

        Alert.alert(
          '',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: true },
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [mode]),
  );

  const renderFormContent = () => {
    switch (mode) {
      case 'ENTER_CNIC':
        return <CNICForm />;
      case 'ENTER_OTP':
        // return <OTPVerify />;
      case 'CREATE_PASSWORD':
        return <CreatePasswordForm />;
      default:
        return <CNICForm />;
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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="arrow-back-outline"
              size={AppSizes.Icon_Height_25}
              color={theme.colors.secondaryDark}
            />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </View>

          <Text
            style={[
              styles.title,
              { color: theme.colors.gray600, marginHorizontal: 30 },
            ]}
          >
            {getTitle()}
          </Text>

          {renderFormContent()}

          <Button
            variant="secondary"
            title={getButtonTitle()}
            onPress={handleButtonPress}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.footer} />
      </KeyboardAwareScrollView>

      <LoadingModal visible={loginData.isLoading} />
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
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
    marginTop: AppSizes.Margin_Vertical_20,
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
    marginBottom: AppSizes.Margin_Vertical_30,
    marginTop: AppSizes.Margin_Vertical_10,
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
