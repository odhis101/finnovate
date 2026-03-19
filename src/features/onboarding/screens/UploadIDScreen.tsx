import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { AppBackground, BackButton } from '../../../shared/components';
import { useCreateClientFinal } from '../../../hooks/useOnboarding';
import { useOnboardingStore } from '../../../store/onboardingStore';

// expo-image-picker must be installed: npx expo install expo-image-picker
// eslint-disable-next-line @typescript-eslint/no-var-requires
let ImagePicker: any;
try { ImagePicker = require('expo-image-picker'); } catch { ImagePicker = null; }

type UploadIDScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'UploadID'>;

interface PhotoState {
  uri: string | null;
  label: string;
}

export const UploadIDScreen = () => {
  const navigation = useNavigation<UploadIDScreenNavigationProp>();
  const { kycFormId, email, setIdPhotos } = useOnboardingStore();

  const [frontPhoto, setFrontPhoto] = useState<PhotoState>({ uri: null, label: 'ID Front' });
  const [backPhoto, setBackPhoto] = useState<PhotoState>({ uri: null, label: 'ID Back' });
  const [taxPin, setTaxPin] = useState('');
  const [error, setError] = useState('');

  const createClientFinal = useCreateClientFinal();

  const handleBack = () => navigation.goBack();

  const pickImage = async (side: 'front' | 'back', source: 'gallery' | 'camera') => {
    if (!ImagePicker) {
      Alert.alert('Setup required', 'Run: npx expo install expo-image-picker');
      return;
    }

    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to continue.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      if (side === 'front') {
        setFrontPhoto({ uri, label: 'ID Front' });
      } else {
        setBackPhoto({ uri, label: 'ID Back' });
      }
    }
  };

  const showPickerOptions = (side: 'front' | 'back') => {
    Alert.alert('Select Photo', 'Choose how to add your ID photo', [
      { text: 'Take Photo', onPress: () => pickImage(side, 'camera') },
      { text: 'Browse Gallery', onPress: () => pickImage(side, 'gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleContinue = async () => {
    if (!frontPhoto.uri || !backPhoto.uri) {
      setError('Please upload both front and back of your ID.');
      return;
    }
    if (!taxPin.trim()) {
      setError('Please enter your KRA PIN.');
      return;
    }
    if (!kycFormId) {
      setError('Registration session expired. Please start over.');
      return;
    }
    setError('');

    if (frontPhoto.uri) setIdPhotos(frontPhoto.uri, backPhoto.uri ?? '');

    try {
      // Photos are stored locally but not sent — server has a permission issue with file uploads
      const result = await createClientFinal.mutateAsync({
        form_id: kycFormId,
        tax_pin: taxPin.trim(),
        email: email,
      });

      if (result.status === 0) {
        setError(result.message || 'Submission failed. Please try again.');
        return;
      }

      navigation.navigate('PINEntry', {
        title: 'Enter your one-time PIN',
        subtitle: 'Enter the default PIN sent to your phone via SMS',
        pinLength: 4,
        mode: 'enter',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong. Please try again.';
      setError(msg);
    }
  };

  const UploadBox = ({
    photo,
    side,
    label,
  }: {
    photo: PhotoState;
    side: 'front' | 'back';
    label: string;
  }) => (
    <TouchableOpacity style={styles.uploadBox} onPress={() => showPickerOptions(side)}>
      {photo.uri ? (
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
      ) : (
        <>
          <View style={styles.uploadIcon}>
            <Text style={styles.iconText}>📄</Text>
          </View>
          <Text style={styles.uploadLabel}>{label}</Text>
          <Text style={styles.uploadSubtext}>Tap to select or take a photo</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} onPress={handleBack} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Upload National ID</Text>
          <Text style={styles.subtitle}>
            Upload clear photos of both the front and back of your national ID
          </Text>

          <View style={styles.uploadRow}>
            <View style={styles.uploadHalf}>
              <UploadBox photo={frontPhoto} side="front" label="ID Front" />
            </View>
            <View style={styles.uploadHalf}>
              <UploadBox photo={backPhoto} side="back" label="ID Back" />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>KRA PIN <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.textInput}
              placeholder="Eg. A123456789B"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="characters"
              value={taxPin}
              onChangeText={setTaxPin}
            />
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>File requirements</Text>
            {[
              'File formats: JPG, PNG',
              'Maximum file size: 10MB',
              'Document must be clear and readable',
              'All four corners must be visible',
            ].map((req) => (
              <View key={req} style={styles.requirementItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.continueButton,
              ((!frontPhoto.uri || !backPhoto.uri) || createClientFinal.isPending) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!frontPhoto.uri || !backPhoto.uri || createClientFinal.isPending}
          >
            {createClientFinal.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  subtitle: { ...typography.styles.bodyMedium, fontSize: 14, color: colors.text.secondary, marginBottom: 32, lineHeight: 20 },
  uploadRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  uploadHalf: { flex: 1 },
  uploadBox: {
    height: 160, backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary.DEFAULT,
    justifyContent: 'center', alignItems: 'center', padding: 12, overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%', borderRadius: 12, resizeMode: 'cover' },
  uploadIcon: {
    width: 48, height: 48, backgroundColor: '#F5F5F5', borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  iconText: { fontSize: 24 },
  uploadLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  uploadSubtext: { fontSize: 11, color: colors.text.secondary, textAlign: 'center' },
  requirementsContainer: { marginBottom: 24 },
  requirementsTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  requirementItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  bullet: { fontSize: 16, color: colors.text.secondary },
  requirementText: { flex: 1, fontSize: 14, color: colors.text.secondary },
  fieldContainer: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, color: '#666666', marginBottom: 8 },
  required: { color: '#FF4444' },
  textInput: {
    height: 56, backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: '#1A1A1A',
  },
  errorText: { ...typography.styles.caption, color: colors.error, marginBottom: 12, textAlign: 'center' },
  continueButton: {
    height: 56, backgroundColor: colors.primary.DEFAULT, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  continueButtonDisabled: { backgroundColor: '#CCCCCC' },
  continueButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
