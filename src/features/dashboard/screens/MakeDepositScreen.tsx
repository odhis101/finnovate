import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme';
import { BackButton } from '../../../shared/components';
import { useServiceProviders, useDeposit } from '../../../hooks/useTransactions';
import { useClientAccounts } from '../../../hooks/useDashboard';
import { validateKenyanPhone, validateAmount } from '../../../utils/validation';

export const MakeDepositScreen = () => {
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [error, setError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const { data: accounts } = useClientAccounts();
  const { data: providers } = useServiceProviders();
  const depositMutation = useDeposit();

  const savingsAccounts = (accounts ?? []).filter((a) => a.isShare === 0);
  const selectedAccount = savingsAccounts.find((a) => a.accountId === selectedAccountId);
  const selectedAccountLabel = selectedAccount
    ? `${selectedAccount.accountName} - ${selectedAccount.accountNumber}`
    : '';

  const handleContinue = async () => {
    const aErr = validateAmount(amount);
    const pErr = validateKenyanPhone(phoneNumber);
    setAmountError(aErr);
    setPhoneError(pErr);
    if (!selectedAccountId || !selectedProviderId) {
      setError('Please fill in all required fields.');
      return;
    }
    if (aErr || pErr) return;
    setError('');
    try {
      const result = await depositMutation.mutateAsync({
        accountId: selectedAccountId,
        amount: parseFloat(amount),
        providerId: selectedProviderId,
        providerPhone: `254${phoneNumber}`,
      });
      if (result.status === 0) {
        setError(result.message ?? 'Deposit failed. Please try again.');
        return;
      }
      setSuccessVisible(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  if (successVisible) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Make Deposit</Text>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Check your phone!</Text>
          <Text style={styles.successMessage}>
            An STK push has been sent to your phone. Enter your M-Pesa PIN to complete the deposit.
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Make Deposit</Text>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            How much would you like to deposit? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, amountError ? styles.inputError : null]}
            placeholder="Enter Amount"
            placeholderTextColor="#9CA3AF"
            value={amount}
            onChangeText={(val) => { setAmount(val); setAmountError(validateAmount(val)); }}
            keyboardType="numeric"
          />
          {amountError ? <Text style={styles.fieldError}>{amountError}</Text> : null}
        </View>

        {/* Deposit to Account Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Deposit to <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
          >
            <Text style={selectedAccountId ? styles.dropdownTextSelected : styles.dropdownText}>
              {selectedAccountLabel || 'Select Account'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isAccountDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {savingsAccounts.map((account) => (
                <TouchableOpacity
                  key={account.accountId}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedAccountId(account.accountId);
                    setIsAccountDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {account.accountName} - {account.accountNumber}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Service Provider Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Service provider <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          >
            <Text style={selectedProviderId ? styles.dropdownTextSelected : styles.dropdownText}>
              {selectedProviderName || 'Select Provider'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isProviderDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {(providers ?? []).map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedProviderId(provider.id);
                    setSelectedProviderName(provider.name);
                    setIsProviderDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Phone number <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Image
                source={require('../../../../assets/logo.png')}
                style={styles.flag}
                resizeMode="contain"
              />
              <Text style={styles.countryCodeText}>+254</Text>
            </View>
            <TextInput
              style={[styles.phoneInput, phoneError ? styles.inputError : null]}
              placeholder="Eg. 712345678"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={(val) => { setPhoneNumber(val); setPhoneError(validateKenyanPhone(val)); }}
              keyboardType="phone-pad"
            />
          </View>
          {phoneError ? <Text style={styles.fieldError}>{phoneError}</Text> : null}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, depositMutation.isPending && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={depositMutation.isPending}
        >
          {depositMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    flex: 1,
    textAlign: 'center',
  },
  logo: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  dropdownTextSelected: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCode: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flag: {
    width: 24,
    height: 16,
  },
  countryCodeText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  fieldError: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  spacer: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: '#F9FAFB',
  },
  continueButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 36,
    color: '#10B981',
  },
  successTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  doneButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
