import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { LoanCard, LoanActionButtons, LoanProducts } from '../components';
import { RecentTransactions } from '../../dashboard/components/RecentTransactions';
import { AdBanner } from '../../dashboard/components/AdBanner';
import { useLoanProducts, useActiveLoans } from '../../../hooks/useLoans';
import { useClientAccounts } from '../../../hooks/useDashboard';
import { parseCurrencyAmount } from '../../../services/api/types';

type LoansScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const LoansScreen = () => {
  const navigation = useNavigation<LoansScreenNavigationProp>();

  const { data: loanProducts } = useLoanProducts();
  const { data: activeLoans } = useActiveLoans();
  const { data: accounts } = useClientAccounts();

  const hasActiveLoan = (activeLoans?.length ?? 0) > 0;
  const activeLoan = activeLoans?.[0];
  const primaryAccount = accounts?.find((a) => a.isShare === 0);
  const firstProduct = loanProducts?.find((p) => p.canApply) ?? loanProducts?.[0];

  const handleApplyLoan = () => {
    if (!firstProduct || !primaryAccount) return;
    navigation.navigate('LoanApplication', {
      productId: firstProduct.productId,
      loanType: firstProduct.name,
      loanLimit: parseCurrencyAmount(firstProduct.limit),
      depositAccountId: primaryAccount.accountId,
    });
  };

  const handleWithdraw = () => {
    // TODO: implement withdrawal flow
  };

  const handleRepayment = () => {
    navigation.navigate('LoanRepayment');
  };

  const handleStatement = () => {
    navigation.navigate('StatementOptions');
  };

  const handleApplyLoanProduct = (productId: number, loanType: string, loanLimit: number) => {
    if (!primaryAccount) return;
    navigation.navigate('LoanApplication', {
      productId,
      loanType,
      loanLimit,
      depositAccountId: primaryAccount.accountId,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>My Loans</Text>
        <TouchableOpacity>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerSubtitle}>Access all your loan details below</Text>

      {/* Loan Card */}
      <View style={styles.loanCardContainer}>
        <LoanCard
          hasActiveLoan={hasActiveLoan}
          loanName={activeLoan?.name ?? firstProduct?.name}
          loanAmount={activeLoan ? parseCurrencyAmount(activeLoan.amountApplied) : 0}
          outstandingBalance={activeLoan ? parseCurrencyAmount(activeLoan.loanBalance) : 0}
          loanLimit={firstProduct ? parseCurrencyAmount(firstProduct.limit) : 0}
          onApplyLoan={handleApplyLoan}
        />
      </View>

      {/* Action Buttons (only shown when there's an active loan) */}
      {hasActiveLoan && (
        <LoanActionButtons
          onWithdraw={handleWithdraw}
          onRepayment={handleRepayment}
          onStatement={handleStatement}
        />
      )}

      {/* Loan Products */}
      <LoanProducts
        hasActiveLoan={hasActiveLoan}
        products={loanProducts}
        onApplyLoan={handleApplyLoanProduct}
      />

      {/* Recent Transactions (only shown when there's an active loan) */}
      {hasActiveLoan && (
        <View style={styles.transactionsContainer}>
          <RecentTransactions transactions={[]} />
        </View>
      )}

      {/* Ad Banner */}
      <AdBanner />

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
    paddingBottom: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: '#C9A255',
    flex: 1,
    textAlign: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: '#C9A255',
  },
  headerSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  loanCardContainer: {
    marginBottom: 8,
  },
  transactionsContainer: {
    marginTop: 24,
  },
  bottomSpacing: {
    height: 100,
  },
});
