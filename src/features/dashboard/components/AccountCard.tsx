import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AccountCardProps {
  accountName: string;
  accountNumber: string;
  availableBalance: number;
  actualBalance: number;
  isActive?: boolean;
  onMakeDeposit?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  accountName,
  accountNumber,
  availableBalance,
  actualBalance,
  isActive = true,
  onMakeDeposit,
}) => {
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);

  const formatCurrency = (amount: number) => {
    return `KSH ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const maskBalance = () => '****';

  return (
    <View>
      <LinearGradient
        colors={['#E1C993', '#C9A255']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, !isActive && styles.cardCompact]}
      >
        {/* Account Name and Number */}
        <View style={styles.header}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{accountName}</Text>
            <Text style={styles.accountNumber}>A/C# {accountNumber}</Text>
          </View>
          <TouchableOpacity
            style={styles.hideButton}
            onPress={() => setIsDetailsHidden(!isDetailsHidden)}
          >
            <Text style={styles.hideButtonText}>
              {isDetailsHidden ? 'Show Details' : 'Hide Details'}
            </Text>
            <Image
              source={require('../../../../assets/eyeVector.png')}
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Balance Section — only shown for active accounts */}
        {isActive && (
          <View style={styles.balanceSection}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>
                {isDetailsHidden ? maskBalance() : formatCurrency(availableBalance)}
              </Text>
            </View>

            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Actual Balance</Text>
              <Text style={styles.balanceAmount}>
                {isDetailsHidden ? maskBalance() : formatCurrency(actualBalance)}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Activation footer — only shown for inactive accounts */}
      {!isActive && (
        <View style={styles.activationFooter}>
          <View style={styles.activationLeft}>
            <View style={styles.warningIcon}>
              <View style={styles.warningTriangle} />
              <Text style={styles.warningExclaim}>!</Text>
            </View>
            <Text style={styles.activationText}>Activate account</Text>
          </View>
          <TouchableOpacity onPress={onMakeDeposit}>
            <Text style={styles.makeDepositText}>Make Deposit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 343,
    height: 147,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    height: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.95,
  },
  hideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 4,
  },
  hideButtonText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  eyeIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 14,
    letterSpacing: 0,
  },
  activationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  activationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F59E0B',
  },
  warningExclaim: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 5,
  },
  activationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  makeDepositText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C9A255',
  },
});
