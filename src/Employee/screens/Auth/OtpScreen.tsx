import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../styles/theme';

const OTP_LENGTH = 4;
const RESEND_COUNTDOWN = 30;

interface OtpScreenProps {
  phoneNumber?: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  onBack?: () => void;
}

const OtpScreen: React.FC<OtpScreenProps> = (
  {
    phoneNumber,
    onVerify,
    onResend,
    onBack,
  },
) => {
  const routes = useRoute();
  const params:any = routes.params;
  phoneNumber = params?.phoneNumbers;
  const { theme } = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const navigation = useNavigation();

  const boxScales = useRef(
    Array(OTP_LENGTH)
      .fill(null)
      .map(() => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    // Entrance animation
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

    startCountdown();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_COUNTDOWN);
    setCanResend(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    startCountdown();
    // onResend?.();
  }, [canResend, startCountdown]);
  // }, [canResend, startCountdown, onResend]);

  const animateBox = (index: number) => {
    Animated.sequence([
      Animated.spring(boxScales[index], {
        toValue: 1.12,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(boxScales[index], {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shakeBoxes = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit) {
      animateBox(index);
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      shakeBoxes();
      return;
    }
    setIsVerifying(true);
    await new Promise(res => setTimeout(res, 800)); // simulate async
    setIsVerifying(false);
    onVerify?.(otpString);
  };

  const isComplete = otp.every(d => d !== '');
  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />

      {/* Back Button */}
      <TouchableOpacity
        style={s.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={s.backArrow}>←</Text>
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
        {/* Icon / Badge */}
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

        {/* Title */}
        <Text style={[s.title, { color: theme.colors.secondaryDark }]}>
          Verification Code
        </Text>
        <Text style={s.subtitle}>We sent a {OTP_LENGTH}-digit code to</Text>
        <Text style={[s.phone, { color: theme.colors.secondaryDark }]}>
          {phoneNumber}
        </Text>

        {/* OTP Input Boxes */}
        <Animated.View
          style={[s.otpRow, { transform: [{ translateX: shakeAnim }] }]}
        >
          {otp.map((digit, index) => {
            const isFocusedOrFilled = digit !== '';
            return (
              <Animated.View
                key={index}
                style={[{ transform: [{ scale: boxScales[index] }] }]}
              >
                <TextInput
                  ref={(ref: any) => (inputRefs.current[index] = ref)}
                  style={[
                    s.otpBox,
                    {
                      borderColor: isFocusedOrFilled
                        ? theme.colors.secondaryDark
                        : theme.colors.secondaryDark + '30',
                      backgroundColor: isFocusedOrFilled
                        ? theme.colors.secondaryDark + '08'
                        : theme.colors.white,
                      color: theme.colors.secondaryDark,
                    },
                  ]}
                  value={digit}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  caretHidden
                />
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Countdown / Resend */}
        <View style={s.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text
                style={[s.resendActive, { color: theme.colors.secondaryDark }]}
              >
                Resend OTP?
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={s.resendCountdown}>
              Resend in{' '}
              <Text
                style={[
                  s.countdownNumber,
                  { color: theme.colors.secondaryDark },
                ]}
              >
                {String(countdown).padStart(2, '0')}s
              </Text>
            </Text>
          )}
        </View>

        {/* Countdown Ring */}
        {!canResend && (
          <View style={s.timerRow}>
            <View
              style={[
                s.timerBar,
                { backgroundColor: theme.colors.secondaryDark + '15' },
              ]}
            >
              <Animated.View
                style={[
                  s.timerFill,
                  {
                    backgroundColor: theme.colors.secondaryDark,
                    width: `${
                      ((RESEND_COUNTDOWN - countdown) / RESEND_COUNTDOWN) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            s.verifyBtn,
            {
              backgroundColor: theme.colors.secondaryDark,
            },
          ]}
          onPress={handleVerify}
          activeOpacity={0.85}
          disabled={!isComplete || isVerifying}
        >
          <Text style={s.verifyBtnText}>
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Footer note */}
        <Text style={s.footerNote}>
          Didn't get the code? Check your spam folder or try a different number.
        </Text>
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
      marginTop: Platform.OS === 'ios' ? 56 : 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    backArrow: {
      fontSize: 24,
      color: theme.colors.secondaryDark,
      fontWeight: '600',
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
    iconEmoji: {
      fontSize: 38,
    },
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
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    otpBox: {
      width: 62,
      height: 68,
      borderRadius: 14,
      borderWidth: 2,
      fontSize: 26,
      fontWeight: '700',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      // elevation: 2,
    },
    resendRow: {
      alignItems: 'center',
      marginBottom: 10,
    },
    resendCountdown: {
      fontSize: 13,
      color: '#9CA3AF',
      fontWeight: '400',
    },
    countdownNumber: {
      fontWeight: '700',
      fontSize: 14,
    },
    resendActive: {
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
      shadowColor: theme.colors.secondaryDark,
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.12,
      // shadowRadius: 10,
      // elevation: 4,
    },
    verifyBtnText: {
      color: colors.white,
      fontSize: 16,
      // fontWeight: '700',
      letterSpacing: 0.3,
    },
    footerNote: {
      marginTop: 20,
      fontSize: 12,
      color: theme.colors.black,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: 16,
    },
  });

export default OtpScreen;
