import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { PINKeypad, PINDots, BackButton } from '../components';
import { useVerifyUser } from '../../hooks/useAuth';

type PINAuthScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'PINAuth'>;
type PINAuthScreenRouteProp = RouteProp<MainStackParamList, 'PINAuth'>;

export const PINAuthScreen = () => {
  const navigation = useNavigation<PINAuthScreenNavigationProp>();
  const route = useRoute<PINAuthScreenRouteProp>();

  const { title = 'Enter PIN', subtitle, onSuccess, successScreen, successParams } = route.params || {};

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const pinLength = 4;

  const verifyUser = useVerifyUser();

  useEffect(() => {
    if (pin.length === pinLength && !verifyUser.isPending) {
      handlePinComplete();
    }
  }, [pin]);

  const handlePinComplete = async () => {
    setError('');
    try {
      const result = await verifyUser.mutateAsync(pin);
      if (result.status === 0) {
        setError('Incorrect PIN. Please try again.');
        setPin('');
        return;
      }
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (successScreen) {
          navigation.navigate(successScreen as any, successParams);
        }
      }, 300);
    } catch {
      setError('Verification failed. Please try again.');
      setPin('');
    }
  };

  const handleNumberPress = (number: string) => {
    if (pin.length < pinLength && !verifyUser.isPending) {
      setPin(pin + number);
      setError('');
    }
  };

  const handleDelete = () => {
    if (!verifyUser.isPending) {
      setPin(pin.slice(0, -1));
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Finovate</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.dotsContainer}>
          <PINDots length={pinLength} filled={pin.length} />
        </View>

        {verifyUser.isPending && <ActivityIndicator color={colors.primary.DEFAULT} style={{ marginBottom: 16 }} />}
        {error && !verifyUser.isPending ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.keypadContainer}>
          <PINKeypad
            onNumberPress={handleNumberPress}
            onBackspace={handleDelete}
            showBiometric={false}
            onBiometricPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logo: { width: 60, height: 60, marginBottom: 12 },
  logoText: { fontFamily: 'Manrope_700Bold', fontSize: 28, fontWeight: '700', color: '#111827' },
  title: { fontFamily: 'Manrope_600SemiBold', fontSize: 18, fontWeight: '600', color: '#6B7280', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#9CA3AF', marginBottom: 32, textAlign: 'center' },
  dotsContainer: { marginBottom: 32 },
  errorText: { fontFamily: 'Manrope_500Medium', fontSize: 14, color: '#EF4444', marginBottom: 16, textAlign: 'center' },
  keypadContainer: { flex: 1, justifyContent: 'center', width: '100%', maxWidth: 350 },
});
