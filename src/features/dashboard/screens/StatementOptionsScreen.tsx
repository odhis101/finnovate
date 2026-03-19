import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { BackButton } from '../../../shared/components';

type StatementOptionsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const StatementOptionsScreen = () => {
  const navigation = useNavigation<StatementOptionsNavigationProp>();

  const handleFullStatement = () => {
    navigation.navigate('StatementForm', { statementType: 'full' });
  };

  const handleMiniStatement = () => {
    navigation.navigate('StatementForm', { statementType: 'mini' });
  };

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

      {/* Statement Options */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.optionCard} onPress={handleFullStatement}>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Full Statement</Text>
            <Text style={styles.optionDescription}>Get your full statements via email</Text>
          </View>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.chevronIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleMiniStatement}>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Mini-Statement</Text>
            <Text style={styles.optionDescription}>Get your mini-statements via email</Text>
          </View>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.chevronIcon}
            resizeMode="contain"
          />
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
    paddingHorizontal: 24,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  chevronIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
  },
});
