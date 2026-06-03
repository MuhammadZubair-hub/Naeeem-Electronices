import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Ionicons from '@react-native-vector-icons/ionicons';
import { showMessage } from 'react-native-flash-message';

import { useTheme } from '../../../hooks/useTheme';
import { useOtpManager } from '../../../hooks/useOtpManager';
import OtpInput, { OtpInputHandle } from '../../../components/common/OtpInput';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { CommonStyles } from '../../../styles/GlobalStyle';
import { colors } from '../../../styles/theme';
import { API_Config } from '../../services/apiServices';

const OtpScreen: React.FC = () => {
  const route = useRoute();
  const params: any = route.params;
  const res = params?.res;
  const payloadforOTP = params?.payloadforOTP;
  // console.log("🚀 ~ :27 ~ OtpScreen ~ res:", res)
  // console.log("🚀 ~ :28 ~ OtpScreen ~ payloadforOTP:", payloadforOTP)
  const flow: string | undefined = params?.flow;
  const paramUserID: string | undefined = params?.userID;
  // const phoneNumber: string | undefined = '923000734015';
  // const phoneNumber: string | undefined = params?.phoneNumber ?? '923000704015';

  const { theme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const otpInputRef = useRef<OtpInputHandle>(null);
  const currentOtp = useRef('');

  const { sendOtp, verifyOtp, resendOtp, countdown, canResend, isSending } =
    useOtpManager({
      onOtpRead: code => {
        currentOtp.current = code;
        otpInputRef.current?.autoFill(code);
      },
    });

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-send OTP on first mount
    sendOtp(res ?? '').then(result => {
      console.log('OTP result: ', result);
      if (!result.success) {
        showMessage({
          message: 'Could not send OTP',
          description: result.error,
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 7) return phone;
    return phone.slice(0, 7) + ' ***' + phone.slice(-2);
  };

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
    // OTP will auto-fill via onOtpRead when the new SMS arrives
  };

  const handleVerify = async () => {
    const entered = currentOtp.current;
    if (entered.length < 4) {
      otpInputRef.current?.shake();
      return;
    }

    const result = verifyOtp(entered);

    if (!result.success) {
      showMessage({
        message: result.error ?? 'Verification failed',
        type: 'danger',
        style: CommonStyles.error,
      });
      otpInputRef.current?.shake();
      if (result.error?.includes("Time's up")) {
        otpInputRef.current?.clear();
        currentOtp.current = '';
      }
      return;
    }

    if (flow === 'updatePassword') {
      (navigation as any).navigate('UpdatePassword', {
        otpVerified: true,
        userID: paramUserID,
      });
    } else {
      try {
        const response = await API_Config.loginUser(
          payloadforOTP.employeeId,
          payloadforOTP.password,
          payloadforOTP.deviceId,
          payloadforOTP.ipAddress,
          payloadforOTP.latitude,
          payloadforOTP.longitude,
          'Y',
        );
        console.log('Login API Response:', response);
        if (response?.data?.status) {
          const role = response?.data?.data?.designation;
          const Region = response?.data?.data?.region;
          const Zone = response?.data?.data?.zone;
          const fullAuth = response?.data?.data?.fullAuth;
          console.log('User Role:', role);
          //console.log('Full Auth:', fullAuth);

          if (Region == 'N/A') {
            showMessage({
              message: 'Logged in Failed',
              description: 'You do not have permission to access the apps',
              type: 'danger',
              style: CommonStyles.error,
            });
            return;
          }
          if (Zone == 'N/A') {
            showMessage({
              message: 'Logged in Failed',
              description: 'You do not have permission to access the app',
              type: 'danger',
              style: CommonStyles.error,
            });
            return;
          }

          if (
            role !== 'Master Admin' &&
            role !== 'CEO' &&
            role !== 'RM' &&
            role !== 'ZM' &&
            role !== 'AVM' &&
            role !== 'AVO'
          ) {
            if (fullAuth == 'N') {
              showMessage({
                message: 'Access Denied',
                description: 'You do not have access to this application.',
                type: 'danger',
                style: CommonStyles.error,
              });
              return;
            }
          }

          dispatch(
            loginSuccess({ data: response.data, token: response.data.token }),
          );
          showMessage({
            message: 'Logged in successfully',
            type: 'success',
            style: CommonStyles.sucsses,
          });
        }
      } catch {
        console.log('in Catch');
      }
      // dispatch(loginSuccess({ data: res?.data, token: res?.data?.token }));
    }
  };

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />

      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back-outline"
          size={34}
          color={colors.secondary}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          s.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon badge */}
        <View style={s.iconWrapper}>
          <View
            style={[
              s.iconBg,
              { backgroundColor: theme.colors.secondaryDark + '15' },
            ]}
          >
            <Text style={s.iconEmoji}>🔐</Text>
          </View>
          <View
            style={[s.iconRing, { borderColor: theme.colors.secondaryDark }]}
          />
        </View>

        <Text style={[s.title, { color: theme.colors.secondaryDark }]}>
          Verification Code
        </Text>
        <Text style={s.subtitle}>We sent a 4-digit code to</Text>
        <Text style={[s.phone, { color: theme.colors.secondaryDark }]}>
          {maskPhone(res ?? 'Phone Number')}
        </Text>

        {/* Reusable OTP input */}
        <View style={s.otpRow}>
          <OtpInput
            ref={otpInputRef}
            length={4}
            themeColor={theme.colors.secondaryDark}
            backgroundColor={theme.colors.white}
            disabled={isSending}
            onChange={otp => {
              currentOtp.current = otp;
            }}
            onComplete={code => {
              currentOtp.current = code;
              // handleVerify();
            }}
          />
        </View>

        {/* Resend row */}
        <View style={s.resendRow}>
          <Text style={s.resendText}>
            Didn't receive the code?{' '}
            <Text
              style={[
                s.resendAction,
                {
                  color: canResend
                    ? theme.colors.secondaryDark
                    : theme.colors.secondaryDark + '50',
                },
              ]}
              onPress={canResend ? handleResend : undefined}
            >
              {canResend ? 'Resend' : `Resend (${formatCountdown(countdown)})`}
            </Text>
          </Text>
        </View>

        {/* Countdown progress bar — only visible while waiting to resend */}
        {!canResend && countdown > 0 && (
          <View style={s.timerRow}>
            <View
              style={[
                s.timerBar,
                { backgroundColor: theme.colors.secondaryDark + '15' },
              ]}
            >
              <View
                style={[
                  s.timerFill,
                  {
                    backgroundColor: theme.colors.secondaryDark,
                    width: `${((300 - countdown) / 300) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Verify button */}
        <TouchableOpacity
          style={[s.verifyBtn, { backgroundColor: theme.colors.secondaryDark }]}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          <Text style={s.verifyBtnText}>Verify OTP</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const makeStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.white,
      paddingHorizontal: 24,
    },
    backBtn: {
      marginTop: Platform.OS === 'ios' ? 56 : 50,
      width: 40,
      height: 40,
      justifyContent: 'center',
      flexDirection: 'row',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 60,
    },
    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 28,
    },
    iconBg: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconRing: {
      position: 'absolute',
      width: 108,
      height: 108,
      borderRadius: 54,
      borderWidth: 1.5,
    },
    iconEmoji: { fontSize: 38 },
    title: {
      fontSize: 26,
      fontWeight: '700',
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: '#9CA3AF',
      fontWeight: '400',
    },
    phone: {
      fontSize: 15,
      fontWeight: '600',
      marginTop: 2,
      marginBottom: 36,
    },
    otpRow: {
      marginBottom: 24,
    },
    resendRow: {
      alignItems: 'center',
      marginBottom: 10,
    },
    resendText: {
      fontSize: 13,
      color: '#9CA3AF',
    },
    resendAction: {
      fontSize: 14,
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
    timerRow: {
      width: '70%',
      marginBottom: 36,
      marginTop: 6,
    },
    timerBar: {
      width: '100%',
      height: 4,
      borderRadius: 4,
      overflow: 'hidden',
    },
    timerFill: {
      height: 4,
      borderRadius: 4,
    },
    verifyBtn: {
      width: '100%',
      height: 54,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    verifyBtnText: {
      color: colors.white,
      fontSize: 16,
      letterSpacing: 0.3,
    },
  });

export default OtpScreen;
