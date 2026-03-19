import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoanCardProps {
  hasActiveLoan: boolean;
  loanName?: string;
  loanAmount?: number;
  outstandingBalance?: number;
  loanLimit?: number;
  onApplyLoan?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  hasActiveLoan,
  loanName,
  loanAmount,
  outstandingBalance,
  loanLimit,
  onApplyLoan,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const maskBalance = () => '****';

  return (
    <LinearGradient
      colors={['#E1C993', '#C9A255']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, !hasActiveLoan && styles.cardNoLoan]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.loanTitle}>{loanName ?? '—'}</Text>
        </View>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.divider} />

      {/* Balance/Limit Section */}
      {hasActiveLoan ? (
        <View style={styles.balanceSection}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Loan Amount</Text>
            <Text style={styles.balanceAmount}>
              {isBalanceHidden ? maskBalance() : formatCurrency(loanAmount || 0)}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.balanceItem}>
            <View style={styles.outstandingHeader}>
              <Text style={styles.balanceLabel}>Outstanding balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceHidden(!isBalanceHidden)}>
                <Image
                  source={require('../../../../assets/eyeVector.png')}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {isBalanceHidden ? maskBalance() : formatCurrency(outstandingBalance || 0)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.limitSection}>
          <View style={styles.limitLeft}>
            <Text style={styles.limitLabel}>Loan Limit</Text>
            <Text style={styles.limitAmount}>{formatCurrency(loanLimit || 0)}</Text>
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={onApplyLoan}>
            <Text style={styles.applyButtonText}>Apply For Loan</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardNoLoan: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loanTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    lineHeight: 21,
    letterSpacing: -0.14,
    marginBottom: 4,
  },
  poweredBy: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    fontWeight: '400',
    color: 'white',
    lineHeight: 18,
    letterSpacing: -0.12,
  },
  logo: {
    width: 80,
    height: 30,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontFamily: 'Manrope_300Light',
    fontSize: 12,
    fontWeight: '300',
    color: 'white',
    lineHeight: 20,
    letterSpacing: 0,
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    lineHeight: 18.2,
    letterSpacing: 0,
  },
  outstandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  limitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  limitLeft: {
    flex: 1,
  },
  limitLabel: {
    fontFamily: 'Manrope_300Light',
    fontSize: 12,
    fontWeight: '300',
    color: 'white',
    lineHeight: 20,
    letterSpacing: 0,
    marginBottom: 8,
  },
  limitAmount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    lineHeight: 18.2,
    letterSpacing: 0,
  },
  applyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: 38,
    minWidth: 97,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
