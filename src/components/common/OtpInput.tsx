import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Keyboard, StyleSheet, TextInput } from 'react-native';

interface OtpInputProps {
  length?: number;
  themeColor: string;
  backgroundColor?: string;
  disabled?: boolean;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
}

export interface OtpInputHandle {
  /** Shake all boxes — call on wrong OTP entry */
  shake: () => void;
  /** Clear all digits and refocus first box */
  clear: () => void;
  /** Focus the first input box */
  focus: () => void;
  /** Auto-fill all boxes at once (e.g., from SMS or dev testing) */
  autoFill: (code: string) => void;
}

const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  (
    {
      length = 4,
      themeColor,
      backgroundColor = '#FFFFFF',
      disabled = false,
      onChange,
      onComplete,
    },
    ref,
  ) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const boxScales = useRef(
      Array(length)
        .fill(null)
        .map(() => new Animated.Value(1)),
    ).current;

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
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    };

    useImperativeHandle(ref, () => ({
      shake: shakeBoxes,
      clear: () => {
        const empty = Array(length).fill('');
        setOtp(empty);
        onChange?.('');
        inputRefs.current[0]?.focus();
      },
      focus: () => inputRefs.current[0]?.focus(),
      autoFill: (code: string) => {
        const digits = Array(length)
          .fill('')
          .map((_, i) => code[i] ?? '');
        setOtp(digits);
        const joined = digits.join('');
        onChange?.(joined);
        // Stagger box scale animations for a natural "typing" feel
        digits.forEach((_, i) => {
          setTimeout(() => animateBox(i), i * 80);
        });
        Keyboard.dismiss();
        if (digits.every(d => d !== '')) {
          setTimeout(() => onComplete?.(joined), length * 80);
        }
      },
    }));

    const handleChange = (text: string, index: number) => {
      const digit = text.replace(/[^0-9]/g, '').slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      onChange?.(newOtp.join(''));

      if (digit) {
        animateBox(index);
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        } else {
          Keyboard.dismiss();
          if (newOtp.every(d => d !== '')) {
            onComplete?.(newOtp.join(''));
          }
        }
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === 'Backspace') {
        const newOtp = [...otp];
        if (otp[index]) {
          newOtp[index] = '';
          setOtp(newOtp);
          onChange?.(newOtp.join(''));
        } else if (index > 0) {
          newOtp[index - 1] = '';
          setOtp(newOtp);
          onChange?.(newOtp.join(''));
          inputRefs.current[index - 1]?.focus();
        }
      }
    };

    return (
      <Animated.View
        style={[styles.row, { transform: [{ translateX: shakeAnim }] }]}
      >
        {otp.map((digit, index) => {
          const isFilled = digit !== '';
          return (
            <Animated.View
              key={index}
              style={{ transform: [{ scale: boxScales[index] }] }}
            >
              <TextInput
                ref={(el:any) => (inputRefs.current[index] = el)}
                style={[
                  styles.box,
                  {
                    borderColor: isFilled ? themeColor : themeColor + '30',
                    backgroundColor: isFilled
                      ? themeColor + '08'
                      : backgroundColor,
                    color: themeColor,
                  },
                ]}
              
                value={digit}
                editable={false}
                // editable={!disabled}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                caretHidden
              />
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  },
);

OtpInput.displayName = 'OtpInput';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  box: {
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
  },
});

export default OtpInput;
