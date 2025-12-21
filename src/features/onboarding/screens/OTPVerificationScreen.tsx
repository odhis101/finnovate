import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, OTPInput } from '../../../shared/components';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<OnboardingStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { phoneNumber } = route.params;
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(64); // 1:04 in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleVerify = () => {
    if (otpCode.length === 6) {
      // TODO: Verify OTP with backend
      navigation.navigate('SaccoSelection');
    }
  };

  const handleResend = () => {
    if (!isResendDisabled) {
      setTimeLeft(64);
      setIsResendDisabled(true);
      setOtpCode('');
      // TODO: Resend OTP
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Phone notification mockup */}
        <View style={styles.notificationContainer}>
          <Image
            source={require('../../../../assets/otpImage.png')}
            style={styles.otpImage}
            resizeMode="contain"
          />
        </View>

        {/* Title and description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Verify your phone number</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit verification code we've sent to your phone number{' '}
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput value={otpCode} onChange={setOtpCode} length={6} />
        </View>

        {/* Resend code timer */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Resend Code in:{' '}
            <Text style={styles.resendTimer}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>
      </View>

      {/* Verify button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Verify"
          onPress={handleVerify}
          variant="primary"
          fullWidth
          disabled={otpCode.length !== 6}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logo: {
    width: 160,
    height: 48,
    alignSelf: 'center',
    marginBottom: 32,
  },
  notificationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpImage: {
    width: 160,
    height: 180,
  },
  textContainer: {
    marginBottom: 32,
  },
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
  otpContainer: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  resendTimer: {
    ...typography.styles.caption,
    color: colors.primary.DEFAULT,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
