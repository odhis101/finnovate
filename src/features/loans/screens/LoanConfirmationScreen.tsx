import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { BackButton } from '../../../shared/components';
import { useLoanApplicationCommit } from '../../../hooks/useLoans';
import { parseAmount } from '../../../services/api/types';

type LoanConfirmationRouteProp = RouteProp<MainStackParamList, 'LoanConfirmation'>;
type LoanConfirmationNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LoanConfirmation'>;

export const LoanConfirmationScreen = () => {
  const navigation = useNavigation<LoanConfirmationNavigationProp>();
  const route = useRoute<LoanConfirmationRouteProp>();
  const { formId, charges, loanData, calculatorData } = route.params;

  const commitMutation = useLoanApplicationCommit();

  const handleConfirm = () => {
    navigation.navigate('PINAuth', {
      title: 'Confirm Loan',
      subtitle: 'Enter your PIN to confirm this loan application',
      onSuccess: async () => {
        try {
          const result = await commitMutation.mutateAsync(formId);
          if (result.status === 1) {
            navigation.navigate('LoanSuccess', {
              loanData: {
                loanType: loanData.loanType,
                amount: loanData.amount,
                price: parseAmount(calculatorData.totalLoanAmount),
                fee: charges,
              },
            });
          } else {
            Alert.alert('Error', result.message ?? 'Failed to process loan. Please try again.');
          }
        } catch {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📄</Text>
          </View>

          <Text style={styles.confirmTitle}>Confirm Details</Text>
          <Text style={styles.amount}>
            Ksh {loanData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>

          {/* Loan Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Loan Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loan Type</Text>
              <Text style={styles.detailValue}>{loanData.loanType}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>KSH {loanData.amount.toLocaleString()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Repayment Period</Text>
              <Text style={styles.detailValue}>{loanData.repaymentPeriod} months</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Monthly Installment</Text>
              <Text style={styles.detailValue}>KSH {calculatorData.installmentAmount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Repayable</Text>
              <Text style={styles.detailValue}>KSH {calculatorData.totalLoanAmount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Interest</Text>
              <Text style={styles.detailValue}>KSH {calculatorData.interestAmount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Charges</Text>
              <Text style={styles.detailValue}>KSH {charges.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
  logo: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B98110',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
  },
  confirmTitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    fontWeight: '500',
    color: '#10B981',
    marginBottom: 12,
  },
  amount: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  detailsTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  detailValue: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  spacer: {
    height: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: '#F9FAFB',
  },
  confirmButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
