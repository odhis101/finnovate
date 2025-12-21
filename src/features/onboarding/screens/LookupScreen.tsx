import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, Input, PhoneInputField, Checkbox } from '../../../shared/components';

type LookupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Lookup'>;

export const LookupScreen = () => {
  const navigation = useNavigation<LookupScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+254');
  const [idNumber, setIdNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleContinue = () => {
    navigation.navigate('OTPVerification', {
      phoneNumber: countryCode + phoneNumber,
      idNumber,
    });
  };

  const isFormValid = phoneNumber.trim() !== '' && idNumber.trim() !== '' && termsAccepted;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.welcomeText}>Welcome to Finovate</Text>
        <Text style={styles.subtitle}>
          Let's check whether you Have a registered account
        </Text>

        <View style={styles.formContainer}>
          <PhoneInputField
            label="Phone number"
            required
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onChangeCountryCode={setCountryCode}
            placeholder="Eg. 712345678"
          />

          <Input
            label="ID number"
            required
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="Eg. 12345678"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
            renderLabel={() => (
              <Text style={styles.checkboxLabel}>
                I have read and accepted{' '}
                <Text style={styles.link}>Finovate Terms & Conditions</Text>
              </Text>
            )}
          />
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isFormValid}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
  },
  logo: {
    width: 160,
    height: 48,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  welcomeText: {
    ...typography.styles.h1ExtraBold,
    color: colors.primary.DEFAULT,
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'left',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  link: {
    ...typography.styles.caption,
    color: colors.primary.DEFAULT,
    textDecorationLine: 'underline',
  },
});
