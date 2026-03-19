import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface LoanActionButtonsProps {
  onWithdraw?: () => void;
  onRepayment?: () => void;
  onStatement?: () => void;
}

export const LoanActionButtons: React.FC<LoanActionButtonsProps> = ({
  onWithdraw,
  onRepayment,
  onStatement,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.primaryButton} onPress={onWithdraw}>
        <Image
          source={require('../../../../assets/Withdraw-icon.png')}
          style={styles.buttonIcon}
          resizeMode="contain"
        />
        <Text style={styles.primaryButtonText}>Withdraw</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onRepayment}>
        <View style={styles.repaymentIconContainer}>
          <Text style={styles.repaymentIconText}>+</Text>
        </View>
        <Text style={styles.secondaryButtonText}>Repayment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={onStatement}>
        <View style={styles.statementIconContainer}>
          <Image
            source={require('../../../../assets/Statements.png')}
            style={styles.statementIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9A255',
    borderRadius: 120,
    height: 48,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C9A255',
    borderRadius: 120,
    height: 48,
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#C9A255',
  },
  repaymentIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C9A255',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repaymentIconText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#C9A255',
    marginTop: -2,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 120,
  },
  statementIconContainer: {
    width: 24,
    height: 24,
  },
  statementIcon: {
    width: 24,
    height: 24,
    tintColor: '#6B7280',
  },
});
