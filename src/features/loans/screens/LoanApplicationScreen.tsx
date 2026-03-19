import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { DatePicker, BackButton } from '../../../shared/components';
import { useLoanCalculator, useLoanApplicationPreview } from '../../../hooks/useLoans';
import { parseAmount } from '../../../services/api/types';

type LoanApplicationRouteProp = RouteProp<MainStackParamList, 'LoanApplication'>;
type LoanApplicationNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LoanApplication'>;

const REPAYMENT_PERIODS = [
  { label: '1 Month', value: 1 },
  { label: '2 Months', value: 2 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 6 },
  { label: '12 Months', value: 12 },
];

export const LoanApplicationScreen = () => {
  const navigation = useNavigation<LoanApplicationNavigationProp>();
  const route = useRoute<LoanApplicationRouteProp>();
  const { productId, loanType, loanLimit, depositAccountId } = route.params;

  const [amount, setAmount] = useState('');
  const [repaymentPeriodMonths, setRepaymentPeriodMonths] = useState(0);
  const [repaymentPeriodLabel, setRepaymentPeriodLabel] = useState('');
  const [applicationReason, setApplicationReason] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [error, setError] = useState('');

  // Debounced amount for calculator
  const [debouncedAmount, setDebouncedAmount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(parseFloat(amount) || 0);
    }, 600);
    return () => clearTimeout(timer);
  }, [amount]);

  const { data: calcResult, isFetching: calcLoading } = useLoanCalculator(
    productId,
    debouncedAmount,
    repaymentPeriodMonths,
  );

  const previewMutation = useLoanApplicationPreview();

  const handleApplyLoan = async () => {
    if (!amount || !repaymentPeriodMonths || !applicationReason) {
      setError('Please fill in all required fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > loanLimit) {
      setError(`Amount exceeds your loan limit of Ksh ${loanLimit.toLocaleString()}.`);
      return;
    }
    setError('');
    try {
      const result = await previewMutation.mutateAsync({
        productId,
        amount: parsedAmount,
        depositAccountId,
        applicationReason,
      });
      if (result.status === 0) {
        setError(result.message ?? 'Application failed. Please try again.');
        return;
      }
      navigation.navigate('LoanConfirmation', {
        formId: result.data!.formId,
        charges: parseAmount(result.data!.charges),
        loanData: {
          loanType,
          amount: parsedAmount,
          repaymentPeriod: repaymentPeriodMonths,
          loanLimit,
        },
        calculatorData: {
          installmentAmount: calcResult?.installmentAmount ?? '0',
          installmentCount: calcResult?.installmentCount ?? 0,
          totalLoanAmount: calcResult?.totalLoanAmount ?? '0',
          interestAmount: calcResult?.interestAmount ?? '0',
        },
      });
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{loanType}</Text>
        <Text style={styles.subtitle}>Kindly provide the following details to apply for a loan</Text>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            How much would you like? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor="#9CA3AF"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={styles.loanLimitText}>Loan Limit: Ksh {loanLimit.toLocaleString()}</Text>
        </View>

        {/* Repayment Period Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Repayment Period <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
          >
            <Text style={repaymentPeriodMonths ? styles.dropdownTextSelected : styles.dropdownText}>
              {repaymentPeriodLabel || 'Select period'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isPeriodDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {REPAYMENT_PERIODS.map((period) => (
                <TouchableOpacity
                  key={period.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRepaymentPeriodMonths(period.value);
                    setRepaymentPeriodLabel(period.label);
                    setIsPeriodDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{period.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Application Reason */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Reason for Loan <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter reason for applying"
            placeholderTextColor="#9CA3AF"
            value={applicationReason}
            onChangeText={setApplicationReason}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Repayment Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repayment Date</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Text style={repaymentDate ? styles.dropdownTextSelected : styles.dropdownText}>
              {repaymentDate || 'Select date (optional)'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Loan Calculator Summary */}
        {calcLoading && debouncedAmount > 0 && repaymentPeriodMonths > 0 && (
          <View style={styles.calcLoading}>
            <ActivityIndicator color={colors.primary.DEFAULT} size="small" />
            <Text style={styles.calcLoadingText}>Calculating...</Text>
          </View>
        )}
        {calcResult && !calcLoading && (
          <View style={styles.calcCard}>
            <Text style={styles.calcTitle}>Loan Summary</Text>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Monthly Installment</Text>
              <Text style={styles.calcValue}>Ksh {calcResult.installmentAmount}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Total Repayable</Text>
              <Text style={styles.calcValue}>Ksh {calcResult.totalLoanAmount}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Interest</Text>
              <Text style={styles.calcValue}>Ksh {calcResult.interestAmount}</Text>
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Apply Loan Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyButton, previewMutation.isPending && styles.buttonDisabled]}
          onPress={handleApplyLoan}
          disabled={previewMutation.isPending}
        >
          {previewMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.applyButtonText}>Apply Loan</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <DatePicker
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDate={setRepaymentDate}
        selectedDate={repaymentDate}
      />
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
  logo: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 24,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  loanLimitText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    fontWeight: '400',
    color: '#10B981',
    marginTop: 8,
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
  calcLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calcLoadingText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  calcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calcTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calcLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  calcValue: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  errorText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
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
  applyButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
