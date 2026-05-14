import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { AppBackground, DatePicker, CountryCodePicker, BackButton, type Country } from '../../../shared/components';
import { useGenders, useCreateClientInitial } from '../../../hooks/useOnboarding';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { validateIdNumber, validateEmail } from '../../../utils/validation';

type KYCScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'KYC'>;

/** Convert any parseable date to DD-MM-YYYY for the API */
const formatDOB = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${date.getFullYear()}`;
  }
  // Try "DD Mon YYYY" pattern (e.g. "10 Jan, 1990")
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const parts = dateStr.replace(',', '').split(' ');
  if (parts.length === 3 && months[parts[1]]) {
    return `${parts[0].padStart(2, '0')}-${months[parts[1]]}-${parts[2]}`;
  }
  return dateStr;
};

export const KYCScreen = () => {
  const navigation = useNavigation<KYCScreenNavigationProp>();

  const { phone, selectedOrg, setKycFormId, setEmail: storeSetEmail } = useOnboardingStore();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [genderId, setGenderId] = useState<number | null>(null);
  const [genderName, setGenderName] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    dialCode: '+254',
    placeholder: '712 345678',
  });
  const [error, setError] = useState('');
  const [idError, setIdError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { data: genders = [], isLoading: gendersLoading } = useGenders(selectedOrg?.org_id ?? selectedOrg?.id ?? 0);
  const createClientInitial = useCreateClientInitial();

  const handleBack = () => navigation.goBack();

  const handleContinue = async () => {
    const iErr = validateIdNumber(idNumber);
    const eErr = validateEmail(email);
    setIdError(iErr);
    setEmailError(eErr);
    if (!firstName || !lastName || !idNumber || !dateOfBirth || !email || !genderId) {
      setError('Please fill in all required fields.');
      return;
    }
    if (iErr || eErr) return;
    setError('');

    try {
      const result = await createClientInitial.mutateAsync({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone: phone,
        national_identity: idNumber,
        dob: formatDOB(dateOfBirth),
        gender: genderId,
        org_id: selectedOrg!.org_id ?? selectedOrg!.id,
      });

      if (result.status === 0) {
        setError(result.message || 'Registration failed. Please try again.');
        return;
      }

      if (result.data?.form_id) {
        setKycFormId(result.data.form_id);
      }
      storeSetEmail(email);
      navigation.navigate('UploadID');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} onPress={handleBack} />

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

          <Text style={styles.title}>Welcome to {selectedOrg?.name ?? 'Finovate'}</Text>
          <Text style={styles.subtitle}>Let's get started by getting to know you</Text>

          <View style={styles.form}>
            {/* Name row */}
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>First name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Eg. John"
                  placeholderTextColor="#A0A0A0"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Last name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Eg. Doe"
                  placeholderTextColor="#A0A0A0"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {/* Middle name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Middle name</Text>
              <TextInput
                style={styles.input}
                placeholder="Eg. Kamau"
                placeholderTextColor="#A0A0A0"
                value={middleName}
                onChangeText={setMiddleName}
              />
            </View>

            {/* Phone (pre-filled from store, display only) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone number</Text>
              <View style={styles.input}>
                <Text style={styles.prefilledText}>{phone || 'Not provided'}</Text>
              </View>
            </View>

            {/* ID Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>ID number <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, idError ? styles.inputError : null]}
                placeholder="Eg. 12345678"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                value={idNumber}
                onChangeText={(val) => {
                  setIdNumber(val);
                  setIdError(validateIdNumber(val));
                }}
              />
              {idError ? <Text style={styles.fieldError}>{idError}</Text> : null}
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.input} onPress={() => setIsDatePickerVisible(true)}>
                <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
                  {dateOfBirth || 'Eg. 10 Jan, 1990'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Eg. john@example.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  setEmailError(validateEmail(val));
                }}
              />
              {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
            </View>

            {/* Gender */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setIsGenderPickerVisible(true)}
                disabled={gendersLoading}
              >
                {gendersLoading ? (
                  <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                ) : (
                  <Text style={[styles.dateText, !genderId && styles.placeholderText]}>
                    {genderName || 'Select gender'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.continueButton, createClientInitial.isPending && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={createClientInitial.isPending}
          >
            {createClientInitial.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <DatePicker
          visible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          onSelectDate={setDateOfBirth}
          selectedDate={dateOfBirth}
        />

        <CountryCodePicker
          visible={isCountryPickerVisible}
          onClose={() => setIsCountryPickerVisible(false)}
          onSelectCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
        />

        {/* Gender Picker Modal */}
        <Modal
          visible={isGenderPickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsGenderPickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsGenderPickerVisible(false)}
          >
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <FlatList
                data={genders}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.genderOption, genderId === item.id && styles.genderOptionSelected]}
                    onPress={() => {
                      setGenderId(item.id);
                      setGenderName(item.name);
                      setIsGenderPickerVisible(false);
                    }}
                  >
                    <Text style={[styles.genderOptionText, genderId === item.id && styles.genderOptionTextSelected]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute', top: 50, left: 24, zIndex: 10,
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 40 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary.DEFAULT, marginBottom: 8 },
  subtitle: { ...typography.styles.bodyMedium, fontSize: 14, color: colors.text.secondary, marginBottom: 32 },
  form: { gap: 20 },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  fieldContainer: { gap: 8 },
  label: { fontSize: 14, color: '#666666', marginBottom: 4 },
  required: { color: '#FF4444' },
  input: {
    height: 56, backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: '#1A1A1A', justifyContent: 'center',
  },
  prefilledText: { fontSize: 16, color: colors.text.secondary },
  dateText: { fontSize: 16, color: '#1A1A1A' },
  placeholderText: { color: '#A0A0A0' },
  errorText: { ...typography.styles.caption, color: colors.error, marginTop: 4 },
  fieldError: { ...typography.styles.caption, color: colors.error, marginTop: 2 },
  inputError: { borderWidth: 1, borderColor: colors.error },
  continueButton: {
    height: 56, backgroundColor: colors.primary.DEFAULT, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginTop: 32,
  },
  continueButtonDisabled: { backgroundColor: '#CCCCCC' },
  continueButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 16 },
  genderOption: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  genderOptionSelected: { backgroundColor: colors.primary[50] },
  genderOptionText: { fontSize: 16, color: colors.text.primary },
  genderOptionTextSelected: { color: colors.primary.DEFAULT, fontWeight: '600' },
});
