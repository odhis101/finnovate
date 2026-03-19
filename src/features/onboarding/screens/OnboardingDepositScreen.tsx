import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { AppBackground, BackButton } from '../../../shared/components';
import { validateKenyanPhone, validateAmount } from '../../../utils/validation';

type OnboardingDepositScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingDeposit'>;

const PIN_ENTRY_PARAMS = {
  title: 'Enter your one-time PIN',
  subtitle: 'Enter the default PIN sent to your phone via SMS',
  pinLength: 4,
  mode: 'enter' as const,
};

export const OnboardingDepositScreen = () => {
  const navigation = useNavigation<OnboardingDepositScreenNavigationProp>();

  const [amount, setAmount] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(1);
  const [selectedProviderName, setSelectedProviderName] = useState('Safaricom');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const goToPINEntry = () => {
    navigation.navigate('PINEntry', PIN_ENTRY_PARAMS);
  };

  const handleMakeDeposit = async () => {
    const aErr = validateAmount(amount);
    const pErr = validateKenyanPhone(phoneNumber);
    setAmountError(aErr);
    setPhoneError(pErr);
    if (!selectedProviderId) {
      setError('Please select a service provider.');
      return;
    }
    if (aErr || pErr) return;
    setError('');
    setIsSubmitting(true);
    // TODO: call deposit API, then navigate
    setTimeout(() => {
      setIsSubmitting(false);
      goToPINEntry();
    }, 300);
  };

  const handleSkip = () => {
    goToPINEntry();
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Make Deposit</Text>
          <Text style={styles.subtitle}>
            Select your preferred payment method to make your first deposit today
          </Text>

          {/* Amount */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              How much would you like to deposit? <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ksh 1,000"
              placeholderTextColor="#A0A0A0"
              value={amount}
              onChangeText={(val) => { setAmount(val); setAmountError(validateAmount(val)); }}
              keyboardType="numeric"
            />
            {amountError ? <Text style={styles.fieldError}>{amountError}</Text> : null}
          </View>

          {/* Service Provider */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Service provider <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownValueText}>{selectedProviderName}</Text>
              <Text style={styles.dropdownChevron}>⌄</Text>
            </TouchableOpacity>
            {isProviderDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {['Safaricom', 'Airtel'].map((name, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedProviderName(name);
                      setIsProviderDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Phone number <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇰🇪</Text>
                <Text style={styles.countryCodeText}>+254</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Eg. 712345678"
                placeholderTextColor="#A0A0A0"
                value={phoneNumber}
                onChangeText={(val) => { setPhoneNumber(val); setPhoneError(validateKenyanPhone(val)); }}
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? <Text style={styles.fieldError}>{phoneError}</Text> : null}
            <Text style={styles.hint}>An STK push will be sent to your phone</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.depositButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleMakeDeposit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.depositButtonText}>Make Deposit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 40 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary.DEFAULT, marginBottom: 8 },
  subtitle: { ...typography.styles.bodyMedium, fontSize: 14, color: colors.text.secondary, marginBottom: 32, lineHeight: 20 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666666', marginBottom: 8 },
  required: { color: '#FF4444' },
  input: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdown: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownPlaceholder: { fontSize: 16, color: '#A0A0A0' },
  dropdownValueText: { fontSize: 16, color: '#1A1A1A' },
  dropdownChevron: { fontSize: 18, color: '#666666' },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: { fontSize: 15, color: '#1A1A1A' },
  phoneRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
  },
  flag: { fontSize: 20 },
  countryCodeText: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  phoneInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  hint: { ...typography.styles.caption, color: colors.text.tertiary, marginTop: 6, textAlign: 'center' },
  errorText: { ...typography.styles.caption, color: colors.error, textAlign: 'center', marginBottom: 12 },
  fieldError: { ...typography.styles.caption, color: colors.error, marginTop: 4 },
  depositButton: {
    height: 56,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  depositButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  skipButton: { alignItems: 'center', marginTop: 20 },
  skipText: { fontSize: 16, fontWeight: '600', color: colors.primary.DEFAULT },
});
