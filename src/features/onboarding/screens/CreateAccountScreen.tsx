import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { SaccoCard, AppBackground, BackButton } from '../../../shared/components';
import { useOnboardingStore } from '../../../store/onboardingStore';
import type { AssociatedOrg } from '../../../services/api/types';

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'CreateAccount'>;

export const CreateAccountScreen = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const setSelectedOrg = useOnboardingStore((s) => s.setSelectedOrg);
  const availableOrgs = useOnboardingStore((s) => s.availableOrgs);

  const handleOrgPress = (org: AssociatedOrg) => {
    setSelectedOrg(org);
    navigation.navigate('KYC');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} />

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

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>
            You can self register to any of the available SACCOs below{'\n'}
            <Text style={styles.note}>Note: A minimum deposit of </Text>
            <Text style={styles.highlight}>KSH 1,000</Text>
            <Text style={styles.note}> will be required</Text>
          </Text>

          <View style={styles.saccoList}>
            {availableOrgs.length === 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No SACCOs available to join.</Text>
              </View>
            )}

            {availableOrgs.map((org) => (
              <SaccoCard
                key={org.id}
                name={org.name}
                description="Register to access your account"
                logo={org.logo ? { uri: org.logo } : require('../../../../assets/logo.png')}
                onPress={() => handleOrgPress(org)}
              />
            ))}
          </View>
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
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 24 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary.DEFAULT, marginBottom: 12 },
  subtitle: { ...typography.styles.bodyMedium, fontSize: 14, color: colors.text.secondary, marginBottom: 32, lineHeight: 20 },
  note: { color: colors.text.secondary },
  highlight: { color: colors.primary.DEFAULT, fontWeight: '600' },
  saccoList: { gap: 0 },
  errorContainer: { alignItems: 'center', paddingVertical: 24 },
  errorText: { ...typography.styles.bodyMedium, color: colors.text.secondary, marginBottom: 8 },
});
