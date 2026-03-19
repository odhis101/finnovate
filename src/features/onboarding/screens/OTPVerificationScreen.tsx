import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, OTPInput, AppBackground } from '../../../shared/components';
import { useVerifyCode, useResendOtp } from '../../../hooks/useOnboarding';
import { useOnboardingStore } from '../../../store/onboardingStore';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<OnboardingStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { phoneNumber } = route.params;

  const phone = useOnboardingStore((s) => s.phone);

  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(64);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');

  const verifyCode = useVerifyCode();
  const resendOtp = useResendOtp();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleVerify = () => {
    if (otpCode.length !== 6) return;
    // OTP verification is bypassed — enter 222222 to proceed
    navigation.navigate('CreateAccount');
  };

  const handleResend = async () => {
    if (isResendDisabled) return;
    setError('');
    setOtpCode('');
    try {
      await resendOtp.mutateAsync(phone || phoneNumber);
      setTimeLeft(64);
      setIsResendDisabled(true);
    } catch {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.notificationContainer}>
            <Image
              source={require('../../../../assets/otpImage.png')}
              style={styles.otpImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Verify your phone number</Text>
            <Text style={styles.subtitle}>
              Please enter the 6-digit verification code we've sent to your phone number{' '}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </Text>
            <Text style={styles.bypassHint}>Hint: Enter 222222 to proceed</Text>
          </View>

          <View style={styles.otpContainer}>
            <OTPInput value={otpCode} onChange={setOtpCode} length={6} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.resendContainer}>
            {isResendDisabled ? (
              <Text style={styles.resendText}>
                Resend Code in:{' '}
                <Text style={styles.resendTimer}>{formatTime(timeLeft)}</Text>
              </Text>
            ) : (
              <Text style={styles.resendText}>
                Didn't receive a code?{' '}
                <Text style={styles.resendLink} onPress={handleResend}>
                  {resendOtp.isPending ? 'Sending...' : 'Resend Code'}
                </Text>
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Verify"
            onPress={handleVerify}
            variant="primary"
            fullWidth
            disabled={otpCode.length !== 6}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'space-between' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  logo: { width: 160, height: 48, alignSelf: 'center', marginBottom: 32 },
  notificationContainer: { alignItems: 'center', marginBottom: 24 },
  otpImage: { width: 160, height: 180 },
  textContainer: { marginBottom: 32 },
  title: {
    ...typography.styles.h1ExtraBold,
    color: colors.primary.DEFAULT,
    textAlign: 'left',
    marginBottom: 16,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'left',
  },
  phoneNumber: {
    ...typography.styles.caption,
    color: colors.primary.DEFAULT,
  },
  otpContainer: { marginBottom: 12 },
  errorText: {
    ...typography.styles.caption,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  resendContainer: { alignItems: 'center' },
  resendText: { ...typography.styles.caption, color: colors.text.secondary },
  resendTimer: { ...typography.styles.caption, color: colors.primary.DEFAULT },
  resendLink: { ...typography.styles.caption, color: colors.primary.DEFAULT, fontWeight: '600' },
  bypassHint: { ...typography.styles.caption, color: colors.primary.DEFAULT, marginTop: 8, fontWeight: '600' },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  loadingOverlay: { position: 'absolute', alignSelf: 'center', bottom: 56 },
});
