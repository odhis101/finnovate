import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { DatePicker, BackButton } from '../../../shared/components';
import { useAuthStore } from '../../../store/authStore';
import { useClientAccounts } from '../../../hooks/useDashboard';
import { useStatementPreview, useStatementGenerate } from '../../../hooks/useStatements';
import { validateEmail } from '../../../utils/validation';

type StatementFormRouteProp = RouteProp<MainStackParamList, 'StatementForm'>;

export const StatementFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<StatementFormRouteProp>();
  const { statementType } = route.params;

  const { user } = useAuthStore();
  const { data: accounts } = useClientAccounts();

  const [email, setEmail] = useState(user?.email ?? '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const previewMutation = useStatementPreview();
  const generateMutation = useStatementGenerate();

  const primaryAccount = accounts?.find((a) => a.isShare === 0);

  const isPending = previewMutation.isPending || generateMutation.isPending;

  const handleGetStatement = async () => {
    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (eErr) return;
    if (!primaryAccount) {
      setError('No account found. Please try again later.');
      return;
    }
    setError('');
    try {
      const previewResult = await previewMutation.mutateAsync({
        accountId: primaryAccount.accountId,
        from: startDate,
        to: endDate,
        recipientEmail: email,
      });
      if (previewResult.status === 0) {
        setError(previewResult.message ?? 'Failed to generate statement.');
        return;
      }
      const formId = previewResult.data!.formId;
      const generateResult = await generateMutation.mutateAsync(formId);
      if (generateResult.status === 0) {
        setError(generateResult.message ?? 'Failed to send statement.');
        return;
      }
      setSuccessVisible(true);
    } catch {
      setError('Something went wrong. Please try again later.');
    }
  };

  if (successVisible) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Get Statement</Text>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Statement Sent!</Text>
          <Text style={styles.successMessage}>
            Your {statementType === 'full' ? 'full' : 'mini'} statement has been sent to{'\n'}
            <Text style={styles.successEmail}>{email}</Text>
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
        <Text style={styles.headerTitle}>Get Statement</Text>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter email address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(val) => { setEmail(val); setEmailError(validateEmail(val)); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
        </View>

        {/* Start Date Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Start Date <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsStartDatePickerVisible(true)}
          >
            <Text style={startDate ? styles.dropdownTextSelected : styles.dropdownText}>
              {startDate || 'Select date'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* End Date Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            End Date <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsEndDatePickerVisible(true)}
          >
            <Text style={endDate ? styles.dropdownTextSelected : styles.dropdownText}>
              {endDate || 'Select date'}
            </Text>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Get Statement Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.getStatementButton, isPending && styles.buttonDisabled]}
          onPress={handleGetStatement}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.getStatementButtonText}>Get Statement</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DatePicker
        visible={isStartDatePickerVisible}
        onClose={() => setIsStartDatePickerVisible(false)}
        onSelectDate={setStartDate}
        selectedDate={startDate}
      />
      <DatePicker
        visible={isEndDatePickerVisible}
        onClose={() => setIsEndDatePickerVisible(false)}
        onSelectDate={setEndDate}
        selectedDate={endDate}
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
  getStatementButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  getStatementButtonText: {
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
  successEmail: {
    fontFamily: 'Manrope_600SemiBold',
    color: '#374151',
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
