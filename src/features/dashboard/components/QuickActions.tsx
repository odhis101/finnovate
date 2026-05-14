import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  onPress: () => void;
}

type QuickActionsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const QuickActions: React.FC = () => {
  const navigation = useNavigation<QuickActionsNavigationProp>();

  const actions: QuickAction[] = [
    {
      id: '2',
      label: 'Make Deposit',
      icon: require('../../../../assets/Deposit.png'),
      onPress: () => navigation.navigate('MakeDeposit'),
    },
    {
      id: '3',
      label: 'My Loans',
      icon: require('../../../../assets/MyLoans.png'),
      onPress: () => navigation.getParent()?.navigate('MainTabs', { screen: 'Loans' }),
    },
    {
      id: '4',
      label: 'Statements',
      icon: require('../../../../assets/Statements.png'),
      onPress: () => navigation.navigate('StatementOptions'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to do today?</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Image
              source={action.icon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.DEFAULT,
    lineHeight: 14,
    letterSpacing: 0,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    fontWeight: '400',
    color: '#374151',
    textAlign: 'center',
  },
});
