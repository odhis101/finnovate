import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { PINKeypad, PINDots } from '../../../shared/components';

type PINEntryScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type PINEntryScreenRouteProp = RouteProp<OnboardingStackParamList, 'PINEntry'>;

export const PINEntryScreen = () => {
  const navigation = useNavigation<PINEntryScreenNavigationProp>();
  const route = useRoute<PINEntryScreenRouteProp>();

  // Get params from navigation
  const {
    title = 'Enter Your one-time PIN',
    subtitle,
    pinLength = 4,
    mode = 'enter', // 'enter' | 'create' | 'confirm'
    nextScreen,
    showBiometric = false,
    storedPin, // For confirmation mode
  } = route.params || {};

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Reset PIN when screen params change (new PIN entry step)
  useEffect(() => {
    setPin('');
    setError('');
  }, [title, mode]);

  useEffect(() => {
    if (pin.length === pinLength) {
      handlePinComplete();
    }
  }, [pin]);

  const handlePinComplete = () => {
    if (mode === 'confirm') {
      // Validate confirmation matches stored PIN
      if (pin === storedPin) {
        // PIN confirmed, navigate to Auth (LoginLanding)
        setTimeout(() => {
          if (nextScreen) {
            navigation.navigate(nextScreen as any);
          } else {
            // Navigate to Auth flow (LoginLanding screen)
            navigation.getParent()?.navigate('Auth' as any);
          }
        }, 300);
      } else {
        setError('PINs do not match. Please try again.');
        setPin('');
      }
    } else if (mode === 'create') {
      // Store PIN and navigate to confirmation
      setTimeout(() => {
        navigation.navigate('PINEntry' as any, {
          title: 'Confirm PIN',
          subtitle: 'Re-enter your PIN to confirm',
          pinLength: 4,
          mode: 'confirm',
          storedPin: pin,
          nextScreen,
        });
      }, 300);
    } else if (mode === 'enter') {
      // One-time PIN validated, navigate to create 4-digit PIN
      setTimeout(() => {
        navigation.navigate('PINEntry' as any, {
          title: 'Create 4 digit PIN',
          subtitle: 'Create a secure PIN for your account',
          pinLength: 4,
          mode: 'create',
          nextScreen,
        });
      }, 300);
    }
  };

  const handleNumberPress = (num: number) => {
    if (pin.length < pinLength) {
      setPin(pin + num.toString());
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBiometric = () => {
    // TODO: Implement biometric authentication
    console.log('Biometric authentication');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <PINDots length={pinLength} filled={pin.length} />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <PINKeypad
        onNumberPress={handleNumberPress}
        onBackspace={handleBackspace}
        showBiometric={showBiometric}
        onBiometricPress={handleBiometric}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: colors.text.primary,
  },
  content: {
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logo: {
    width: 160,
    height: 48,
    marginBottom: 60,
  },
  title: {
    ...typography.styles.bodyMedium,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.styles.caption,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
  },
});
