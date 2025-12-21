import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { typography, colors } from '../../theme';

interface SaccoCardProps {
  name: string;
  description: string;
  logo: ImageSourcePropType;
  onPress: () => void;
}

export const SaccoCard: React.FC<SaccoCardProps> = ({ name, description, logo, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.styles.bodyLarge,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  description: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    fontSize: 13,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 24,
    color: colors.text.secondary,
    fontWeight: '300',
  },
});