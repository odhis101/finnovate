import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, AppBackground, SaccoCard } from '../../../shared/components';
import { useAuthStore } from '../../../store/authStore';
import { useOnboardingStore } from '../../../store/onboardingStore';
import type { AssociatedOrg } from '../../../services/api/types';

type LoginLandingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginLanding'>;

export const LoginLandingScreen = () => {
  const navigation = useNavigation<LoginLandingScreenNavigationProp>();
  const { user, lastKnownFirstname, hasCompletedOnboarding, setStoredUsername } = useAuthStore();
  const associatedOrgs = useOnboardingStore((s) => s.associatedOrgs);
  const userName = associatedOrgs[0]?.firstName ?? user?.firstname ?? lastKnownFirstname ?? 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleOrgSelect = (org: AssociatedOrg) => {
    // Store the username for this org so LoginPINScreen can use it
    setStoredUsername(org.username);
    navigation.navigate('LoginPIN', {
      showBiometric: true,
      orgId: org.org_id,
    });
  };

  const handleLogin = () => {
    navigation.navigate('LoginPIN', { userName, showBiometric: true });
  };

  // ── Returning user: show org picker ──────────────────────────────────────
  if (hasCompletedOnboarding || associatedOrgs.length > 0) {
    return (
      <AppBackground>
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

            <Text style={styles.welcomeBack}>
              {getGreeting()}, <Text style={styles.userName}>{userName}!</Text>
            </Text>
            <Text style={styles.orgSubtitle}>Select your SACCO to log in</Text>

            {associatedOrgs.map((org) => (
              <SaccoCard
                key={org.id}
                name={org.name}
                description={`Log in to ${org.name}`}
                logo={require('../../../../assets/logo.png')}
                onPress={() => handleOrgSelect(org)}
              />
            ))}
          </ScrollView>
        </View>
      </AppBackground>
    );
  }

  // ── First-time user: greeting ─────────────────────────────────────────────
  return (
    <AppBackground>
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
            Access your SACCO account today{'\n'}and transact anywhere
          </Text>

          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleLogin}
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
          <Button title="Login" onPress={handleLogin} variant="primary" fullWidth />
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  welcomeBack: {
    ...typography.styles.h1ExtraBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  orgSubtitle: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 24,
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