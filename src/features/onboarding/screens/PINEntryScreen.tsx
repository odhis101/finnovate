import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { PINKeypad, PINDots, AppBackground, BackButton } from '../../../shared/components';
import { useChangeDefaultPin } from '../../../hooks/useOnboarding';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { useAuthStore } from '../../../store/authStore';

type PINEntryScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type PINEntryScreenRouteProp = RouteProp<OnboardingStackParamList, 'PINEntry'>;

export const PINEntryScreen = () => {
  const navigation = useNavigation<PINEntryScreenNavigationProp>();
  const route = useRoute<PINEntryScreenRouteProp>();

  const {
    title = 'Create 4 digit PIN',
    subtitle,
    pinLength = 4,
    mode = 'create',
    nextScreen,
    showBiometric = false,
    storedPin,
  } = route.params || {};

  const phone = useOnboardingStore((s) => s.phone);
  const username = useOnboardingStore((s) => s.username);
  const { setStoredUsername, setHasCompletedOnboarding } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeDefaultPin = useChangeDefaultPin();

  useEffect(() => {
    setPin('');
    setError('');
  }, [title, mode]);

  useEffect(() => {
    if (pin.length === pinLength && !isSubmitting) {
      handlePinComplete();
    }
  }, [pin]);

  const handlePinComplete = async () => {
    setIsSubmitting(true);

    if (mode === 'create') {
      // Store PIN, go to confirm step
      setTimeout(() => {
        setIsSubmitting(false);
        navigation.navigate('PINEntry', {
          title: 'Confirm PIN',
          subtitle: 'Re-enter your PIN to confirm',
          pinLength: 4,
          mode: 'confirm',
          storedPin: pin,
          nextScreen,
        });
      }, 300);
    } else if (mode === 'confirm') {
      if (pin !== storedPin) {
        setError('PINs do not match. Please try again.');
        setPin('');
        setIsSubmitting(false);
        return;
      }
      try {
        const result = await changeDefaultPin.mutateAsync({
          username: username || phone,
          password: pin,
          confirm: pin,
        });
        if (result.status === 0) {
          setError(result.message || 'Failed to set PIN. Please try again.');
          setPin('');
          setIsSubmitting(false);
          return;
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setPin('');
        setIsSubmitting(false);
        return;
      }
      // Persist username and mark onboarding done for future app opens
      const finalUsername = username || phone;
      await setStoredUsername(finalUsername);
      await setHasCompletedOnboarding();
      setIsSubmitting(false);
      navigation.getParent()?.navigate('Auth' as any);
    } else if (mode === 'authenticate') {
      setTimeout(() => {
        setIsSubmitting(false);
        navigation.getParent()?.navigate('Main' as any);
      }, 300);
    }
  };

  const handleNumberPress = (num: number) => {
    if (pin.length < pinLength && !isSubmitting) {
      setPin(pin + num.toString());
      setError('');
    }
  };

  const handleBackspace = () => {
    if (!isSubmitting) {
      setPin(pin.slice(0, -1));
      setError('');
    }
  };

  const isBusy = isSubmitting || changeDefaultPin.isPending;

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} />

        <View style={styles.content}>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <PINDots length={pinLength} filled={pin.length} />

          {isBusy && <ActivityIndicator style={{ marginTop: 16 }} color={colors.primary.DEFAULT} />}
          {error && !isBusy ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <PINKeypad
          onNumberPress={handleNumberPress}
          onBackspace={handleBackspace}
          showBiometric={showBiometric}
          onBiometricPress={() => {}}
        />
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute', top: 60, left: 24, zIndex: 10,
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { alignItems: 'center', paddingTop: 120, paddingHorizontal: 24, marginBottom: 40 },
  logo: { width: 160, height: 48, marginBottom: 60 },
  title: { ...typography.styles.bodyMedium, fontSize: 16, color: colors.text.secondary, textAlign: 'center', marginBottom: 8 },
  subtitle: { ...typography.styles.caption, color: colors.text.tertiary, textAlign: 'center' },
  errorText: { ...typography.styles.caption, color: '#EF4444', textAlign: 'center', marginTop: 16 },
});
