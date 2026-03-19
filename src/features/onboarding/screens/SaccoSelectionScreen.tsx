import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { SaccoCard, AppBackground, BackButton } from '../../../shared/components';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { useOrganisations } from '../../../hooks/useOnboarding';
import type { Organisation } from '../../../services/api/types';

type SaccoSelectionScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SaccoSelection'>;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const SaccoCardSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonLogo} />
      <View style={styles.skeletonText}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
};

export const SaccoSelectionScreen = () => {
  const navigation = useNavigation<SaccoSelectionScreenNavigationProp>();
  const setSelectedOrg = useOnboardingStore((s) => s.setSelectedOrg);
  const { data: organisations = [], isLoading } = useOrganisations();

  const handleBack = () => navigation.goBack();

  const handleOrgPress = (org: Organisation) => {
    setSelectedOrg(org as any);
    navigation.navigate('CreateAccount');
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

          <Text style={styles.welcomeText}>Join a SACCO</Text>

          <View style={styles.saccoList}>
            {isLoading && [0, 1, 2].map((i) => <SaccoCardSkeleton key={i} />)}

            {!isLoading && organisations.length === 0 && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No SACCOs available.</Text>
              </View>
            )}

            {organisations.map((org) => (
              <SaccoCard
                key={org.id}
                name={org.name}
                description={`Join ${org.name}`}
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
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 40 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: 12 },
  nameHighlight: { fontSize: 24, fontWeight: '700', color: colors.primary.DEFAULT },

  saccoList: { gap: 0 },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonLogo: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#E0E0E0', marginRight: 12 },
  skeletonText: { flex: 1 },
  skeletonLine: { height: 14, borderRadius: 6, backgroundColor: '#E0E0E0', width: '80%' },
  errorContainer: { alignItems: 'center', paddingVertical: 24 },
  errorText: { ...typography.styles.bodyMedium, color: colors.text.secondary, marginBottom: 8 },
  retryText: { ...typography.styles.bodyMedium, color: colors.primary.DEFAULT, fontWeight: '600' },

});
