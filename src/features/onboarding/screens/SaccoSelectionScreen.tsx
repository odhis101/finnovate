import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { SaccoCard } from '../../../shared/components';

type SaccoSelectionScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SaccoSelection'>;

interface SaccoData {
  id: string;
  name: string;
  description: string;
  logo: any;
}

const saccoData: SaccoData[] = [
  {
    id: '1',
    name: 'Stima SACCO',
    description: 'Access your Stima SACCO account',
    logo: require('../../../../assets/stimaSacco.png'),
  },
  {
    id: '2',
    name: 'Tower SACCO',
    description: 'Access your Tower SACCO account',
    logo: require('../../../../assets/towerSacco.png'),
  },
  {
    id: '3',
    name: 'Fortune SACCO',
    description: 'Access your Kenya Police SACCO account',
    logo: require('../../../../assets/fortuneSacco.png'),
  },
];

export const SaccoSelectionScreen = () => {
  const navigation = useNavigation<SaccoSelectionScreenNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaccoPress = (saccoId: string) => {
    // Navigate to one-time PIN entry after SACCO selection
    navigation.navigate('PINEntry', {
      title: 'Enter Your one-time PIN',
      subtitle: 'Please enter the one-time PIN sent to you',
      pinLength: 4,
      mode: 'enter',
      // Don't pass nextScreen - let the mode handle navigation automatically
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

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
          Here are your Sacco's! Select one to proceed To your account
        </Text>

        <View style={styles.saccoList}>
          {saccoData.map((sacco) => (
            <SaccoCard
              key={sacco.id}
              name={sacco.name}
              description={sacco.description}
              logo={sacco.logo}
              onPress={() => handleSaccoPress(sacco.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.DEFAULT,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 32,
    lineHeight: 20,
  },
  saccoList: {
    gap: 0,
  },
});
