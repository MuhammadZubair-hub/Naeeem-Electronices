import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  getHash,
  removeListener,
  startOtpListener,
} from 'react-native-otp-verify';

// Zong SMS API credentials
const ZONG_SMS_URL = 'https://cbs.zong.com.pk/reachrestapi/home/SendQuickSMS';
const ZONG_LOGIN_ID = '923158671200';  //correct
// const ZONG_LOGIN_ID = '923158671';  // wrong
const ZONG_PASSWORD = '!B@koz1007*!';
const ZONG_MASK = 'NE Pvt Ltd.';
// const nbr = '0300-0734015';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 mints

interface OtpRecord {
  code: string;
  sentAt: number;
  phone: string;
}

// Module-level — survives re-renders, cleared on new sendOtp or successful verify
let otpRecord: OtpRecord | null = null;

const formatPhoneNumber = (phone: string): string =>
  '92' + phone.replace('-', '').replace(/^0/, '');

const generateOtp = (): string =>
  Math.floor(1000 + Math.random() * 9000).toString();

export interface SendOtpResult {
  success: boolean;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  error?: string;
}

interface UseOtpManagerOptions {
  /** Called when an incoming SMS is auto-read and the OTP is extracted */
  onOtpRead?: (code: string) => void;
}

export const useOtpManager = ({ onOtpRead }: UseOtpManagerOptions = {}) => {
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [appHash, setAppHash] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch the 11-char app hash on mount (Android only).
  // This hash must be appended to the SMS message so the OS can identify the app.
  useEffect(() => {
    if (Platform.OS === 'android') {
      getHash()
        .then(hashes => setAppHash(hashes[0] ?? ''))
        .catch(() => {});
    }
  }, []);

  const startCountdown = (seconds = 300) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);
    setCanResend(false);

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
  };

  const stopSmsListener = () => {
    if (Platform.OS === 'android') removeListener();
  };

  const startSmsListener = () => {
    if (Platform.OS !== 'android') return;

    console.log('[OTP] Starting SMS listener...');
    startOtpListener(message => {
      console.log('[OTP] SMS listener fired, message:', message);
      if (!message || message === 'Timeout Error.') return;
      // Extract the first 4-digit sequence from the SMS body
      const match = message.match(/\b(\d{4})\b/);
      console.log('[OTP] Extracted OTP:', match?.[1]);
      if (match?.[1]) {
        onOtpRead?.(match[1]);
        stopSmsListener();
      }
    }).catch(err => {
      console.log('[OTP] SMS listener error:', err);
    });
  };

  /**
   * Generates a 4-digit OTP, saves it with a timestamp, sends it via
   * Zong SMS API, then starts listening for the incoming SMS on Android.
   */
  const sendOtp = async (phoneNumber: string): Promise<SendOtpResult> => {
    setIsSending(true);
    try {
      const code = generateOtp();
      otpRecord = { code, sentAt: Date.now(), phone: phoneNumber };

      // Fetch hash fresh each time to avoid the async race on first mount.
      // appHash state may still be empty when sendOtp is called immediately on mount.
      let hash = appHash;
      if (!hash && Platform.OS === 'android') {
        try {
          const hashes = await getHash();
          hash = hashes[0] ?? '';
          setAppHash(hash);
        } catch (_) {}
      }
      console.log('[OTP] App hash:', hash);
      const phoneNbr = formatPhoneNumber(phoneNumber);
      console.log('changing number format: ', phoneNbr);

      // SMS format required by Android SMS Retriever API:
      //   • Must start with <#>
      //   • Must end with the 11-char app hash on its own line
      // The <#> prefix + hash at the end cause Android to:
      //   1. Show a "Copy Code" button in the SMS notification
      //   2. Allow react-native-otp-verify to intercept and auto-fill the OTP
      // The hash must appear at the very end of the message (on its own line)
      // for Android SMS Retriever to intercept it. The <#> prefix is NOT needed
      // and can cause Zong to reject or silently drop the message.
      const smsBody = hash
        ? `Your NE OTP code is: ${code}. Valid for 5 minutes.\n${hash}`
        : `Your NE OTP code is: ${code}. Valid for 5 minutes.`;

      const payload: Record<string, string> = {
        loginId: ZONG_LOGIN_ID,
        loginPassword: ZONG_PASSWORD,
        Destination: phoneNbr,
        UniCode: '0',
        ShortCodePrefered: 'n',
        Mask: ZONG_MASK,
        Message: smsBody,
      };
      const formBody = Object.entries(payload)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      // Start listening BEFORE the API call so the listener is ready
      // the moment the SMS arrives (Zong can deliver in under a second).
      startSmsListener();
      console.log('[OTP] Sending payload:', JSON.stringify(payload));

      let smsRes: Response;
      try {
        smsRes = await fetch(ZONG_SMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody,
        });
      } catch (networkErr: any) {
        // fetch itself threw — network unreachable, DNS failure, SSL handshake error, etc.
        console.error(
          '[OTP] Network-level error (fetch threw):',
          networkErr?.message,
        );
        throw new Error(`Network error: ${networkErr?.message}`);
      }

      const smsResBody = await smsRes.text();
      console.log(
        '[OTP] Zong response — HTTP',
        smsRes.status,
        '| body:',
        smsResBody,
      );

      if (!smsRes.ok) {
        throw new Error(`Zong API HTTP ${smsRes.status}: ${smsResBody}`);
      }

      // Zong may return HTTP 200 with a failure payload — detect common patterns
      const bodyLower = smsResBody.toLowerCase();
      const isZongError =
        bodyLower.includes('"status":"failed"') ||
        bodyLower.includes('"status": "failed"') ||
        bodyLower.includes('"code":"-1"') ||
        bodyLower.includes('"code": "-1"');
      if (isZongError) {
        throw new Error(`Zong rejected the message: ${smsResBody}`);
      }

      startCountdown(300); // 5-minute resend window
      return { success: true };
    } catch (error: any) {
      otpRecord = null;
      return {
        success: false,
        error: error?.message ?? 'Failed to send OTP. Please try again.',
      };
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Verifies the entered OTP. Returns error if expired (>60s) or wrong code.
   */
  const verifyOtp = (enteredOtp: string): VerifyOtpResult => {
    if (!otpRecord) {
      return { success: false, error: 'No OTP sent. Please request one.' };
    }

    const elapsed = Date.now() - otpRecord.sentAt;
    if (elapsed > OTP_EXPIRY_MS) {
      otpRecord = null;
      stopSmsListener();
      if (timerRef.current) clearInterval(timerRef.current);
      return { success: false, error: "Time's up! Please request a new OTP." };
    }

    if (enteredOtp !== otpRecord.code) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    // Consumed — clear everything
    otpRecord = null;
    stopSmsListener();
    if (timerRef.current) clearInterval(timerRef.current);
    return { success: true };
  };

  /** Resend OTP to the same number used in the last sendOtp call. */
  const resendOtp = async (): Promise<SendOtpResult> => {
    if (!canResend) {
      return {
        success: false,
        error: 'Please wait before requesting a new OTP.',
      };
    }
    const phone = otpRecord?.phone ?? '';
    stopSmsListener();
    return sendOtp(phone);
  };

  const clearOtp = () => {
    otpRecord = null;
    stopSmsListener();
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(0);
    setCanResend(false);
  };

  return {
    sendOtp,
    verifyOtp,
    resendOtp,
    clearOtp,
    isSending,
    countdown,
    canResend,
    appHash, // expose so you can log/debug the hash during dev
  };
};
