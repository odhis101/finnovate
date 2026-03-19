import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, Input, PhoneInputField, Checkbox, AppBackground, DatePicker } from '../../../shared/components';
import { useGetAssociatedOrgs, useActivate } from '../../../hooks/useOnboarding';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { validateKenyanPhone, validateIdNumber } from '../../../utils/validation';

type LookupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Lookup'>;

const MONTH_MAP: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

// Converts "10 Mar, 2023" → "10-03-2023" (DD-MM-YYYY) as required by the API
const toAPIDate = (display: string): string => {
  const parts = display.split(' ');
  const day = parts[0].padStart(2, '0');
  const month = MONTH_MAP[parts[1].replace(',', '')] ?? '01';
  const year = parts[2];
  return `${day}-${month}-${year}`;
};

export const LookupScreen = () => {
  const navigation = useNavigation<LookupScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+254');
  const [idNumber, setIdNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [idError, setIdError] = useState('');

  const setPhone = useOnboardingStore((s) => s.setPhone);
  const setAssociatedOrgs = useOnboardingStore((s) => s.setAssociatedOrgs);
  const getAssociatedOrgs = useGetAssociatedOrgs();
  const activate = useActivate();

  const isLoading = getAssociatedOrgs.isPending || activate.isPending;

  const isFormValid =
    !validateKenyanPhone(phoneNumber) &&
    !validateIdNumber(idNumber) &&
    dateOfBirth.trim() !== '' &&
    termsAccepted;
  const fullPhone = countryCode + phoneNumber;

  const handleContinue = async () => {
    const pErr = validateKenyanPhone(phoneNumber);
    const iErr = validateIdNumber(idNumber);
    setPhoneError(pErr);
    setIdError(iErr);
    if (pErr || iErr) return;
    setError('');

    try {
      const result = await getAssociatedOrgs.mutateAsync({
        phone: fullPhone,
        nationalIdNumber: idNumber,
        dateOfBirth: toAPIDate(dateOfBirth),
      });

      if (result.data && result.data.length > 0) {
        // Existing user — store their orgs and go to login
        setAssociatedOrgs(result.data);
        setPhone(fullPhone);
        navigation.getParent()?.navigate('Auth' as any);
      } else {
        // New user — send OTP then go through onboarding (sacco selection → create account)
        const activateResult = await activate.mutateAsync(fullPhone);
        if (activateResult.status === 0) {
          setError(activateResult.message);
          return;
        }
        setPhone(fullPhone);
        navigation.navigate('OTPVerification', { phoneNumber: fullPhone });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
            Let's check whether you have a registered account
          </Text>

          <View style={styles.formContainer}>
            <PhoneInputField
              label="Phone number"
              required
              value={phoneNumber}
              onChangeText={(val) => {
                setPhoneNumber(val);
                setPhoneError(validateKenyanPhone(val));
              }}
              onChangeCountryCode={(code) => { setCountryCode(code); }}
              placeholder="Eg. 712345678"
            />
            {phoneError ? <Text style={styles.fieldError}>{phoneError}</Text> : null}

            <Input
              label="ID number"
              required
              value={idNumber}
              onChangeText={(val) => {
                setIdNumber(val);
                setIdError(validateIdNumber(val));
              }}
              placeholder="Eg. 12345678"
              keyboardType="numeric"
            />
            {idError ? <Text style={styles.fieldError}>{idError}</Text> : null}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Date of Birth <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={dateOfBirth ? styles.dateValue : styles.datePlaceholder}>
                  {dateOfBirth || 'Eg. 10-Jan-1990'}
                </Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              visible={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelectDate={(date) => { setDateOfBirth(date); }}
              selectedDate={dateOfBirth}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
            title={isLoading ? '' : 'Continue'}
            onPress={handleContinue}
            disabled={!isFormValid || isLoading}
            fullWidth
          />
          {isLoading && (
            <ActivityIndicator
              style={styles.loadingOverlay}
              color={colors.background.primary}
            />
          )}
        </View>
      </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
  },
  dateValue: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.primary,
  },
  datePlaceholder: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.tertiary,
  },
  resultBanner: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  resultBannerFound: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  resultTitle: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  resultBody: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.error,
    marginTop: 8,
  },
  fieldError: {
    ...typography.styles.caption,
    color: colors.error,
    marginTop: -8,
    marginBottom: 4,
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
  loadingOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 56,
  },
});
