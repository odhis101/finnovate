import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { PINKeypad, PINDots, AppBackground, BackButton } from '../../../shared/components';
import { useAuthStore } from '../../../store/authStore';
import { useLogin } from '../../../hooks/useAuth';

type LoginPINScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginPIN'>;
type LoginPINScreenRouteProp = RouteProp<AuthStackParamList, 'LoginPIN'>;

export const LoginPINScreen = () => {
  const navigation = useNavigation<LoginPINScreenNavigationProp>();
  const route = useRoute<LoginPINScreenRouteProp>();

  const { showBiometric = true, orgId } = route.params || {};
  const { user, storedUsername, lastKnownFirstname, isAuthenticated } = useAuthStore();
  const userName = user?.firstname ?? lastKnownFirstname ?? 'there';

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useLogin();

  // Navigate only when the store confirms authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigation.getParent()?.navigate('Main' as any);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (pin.length === 4) {
      handlePinComplete();
    }
  }, [pin]);

  const handlePinComplete = async () => {
    setError('');
    const usernameToUse = user?.username ?? storedUsername;
    const orgIdToUse = orgId ?? user?.org_id;

    if (!usernameToUse || !orgIdToUse) {
      setError('Session expired. Please start over.');
      setPin('');
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({
        username: usernameToUse,
        password: pin,
        org_id: orgIdToUse,
      });
      // Login failed — server returned status 0 or no token
      if (result.status === 0 || !result.data?.token) {
        setError(result.message || 'Incorrect PIN. Please try again.');
        setPin('');
      }
      // On success: useLogin's onSuccess calls setAuth → isAuthenticated → useEffect navigates
    } catch {
      setError('Login failed. Please try again.');
      setPin('');
    }
  };

  const handleNumberPress = (num: number) => {
    if (pin.length < 4 && !loginMutation.isPending) {
      setPin(pin + num.toString());
      setError('');
    }
  };

  const handleBackspace = () => {
    if (!loginMutation.isPending) {
      setPin(pin.slice(0, -1));
      setError('');
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} />

        <View style={styles.content}>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.greeting}>
            Welcome back, <Text style={styles.userName}>{userName}!</Text>
          </Text>

          <Text style={styles.title}>Enter Your PIN</Text>
          <Text style={styles.subtitle}>Enter your 4-digit PIN to continue</Text>

          <PINDots length={4} filled={pin.length} />

          {loginMutation.isPending
            ? <ActivityIndicator style={{ marginTop: 16 }} color={colors.primary.DEFAULT} />
            : error ? <Text style={styles.errorText}>{error}</Text> : null
          }
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
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { alignItems: 'center', paddingTop: 120, paddingHorizontal: 24, marginBottom: 40 },
  logo: { width: 160, height: 48, marginBottom: 40 },
  greeting: { ...typography.styles.bodyMedium, fontSize: 18, color: colors.text.primary, textAlign: 'center', marginBottom: 32 },
  userName: { color: colors.primary.DEFAULT, fontWeight: '600' },
  title: { ...typography.styles.bodyMedium, fontSize: 16, color: colors.text.secondary, textAlign: 'center', marginBottom: 8 },
  subtitle: { ...typography.styles.caption, color: colors.text.tertiary, textAlign: 'center' },
  errorText: { ...typography.styles.caption, color: '#EF4444', textAlign: 'center', marginTop: 16 },
});
