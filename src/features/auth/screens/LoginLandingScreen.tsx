import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button } from '../../../shared/components';

type LoginLandingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginLanding'>;

export const LoginLandingScreen = () => {
  const navigation = useNavigation<LoginLandingScreenNavigationProp>();

  // TODO: Get user data from storage/context
  const userName = 'Tafari';
  const saccoName = 'Stima SACCO';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goodmorning';
    if (hour < 18) return 'Goodafternoon';
    return 'Goodevening';
  };

  const handleBiometricLogin = async () => {
    // TODO: Implement biometric authentication
    console.log('Biometric login');
  };

  const handleLogin = () => {
    // Navigate to PIN entry for login
    navigation.navigate('LoginPIN' as any);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Image
          source={require('../../../../assets/userImage.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={styles.userName}>{userName}!</Text>
        </Text>

        <Text style={styles.subtitle}>
          Access your {saccoName} account today{'\n'}and transact anywhere
        </Text>

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../../assets/biometrics.png')}
            style={styles.biometricIcon}
            resizeMode="contain"
          />
          <Text style={styles.biometricText}>Use Biometrics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
  },
  greeting: {
    ...typography.styles.greeting,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  userName: {
    color: colors.primary.DEFAULT,
  },
  subtitle: {
    ...typography.styles.captionMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  biometricIcon: {
    width: 24,
    height: 24,
  },
  biometricText: {
    ...typography.styles.bodyMedium,
    fontSize: 16,
    color: colors.primary.DEFAULT,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});