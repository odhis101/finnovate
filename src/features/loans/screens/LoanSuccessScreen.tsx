import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { BackButton } from '../../../shared/components';

type LoanSuccessRouteProp = RouteProp<MainStackParamList, 'LoanSuccess'>;
type LoanSuccessNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LoanSuccess'>;

export const LoanSuccessScreen = () => {
  const navigation = useNavigation<LoanSuccessNavigationProp>();
  const route = useRoute<LoanSuccessRouteProp>();
  const { loanData } = route.params;

  const currentDate = new Date();
  const refId = `MIE${Math.random().toString(36).substr(2, 9).toUpperCase()}USU`;
  const date = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleDone = () => {
    // Navigate back to main tabs (Loans screen)
    navigation.navigate('MainTabs', { screen: 'Loans' });
  };

  const handleGetReceipt = () => {
    console.log('Get PDF Receipt pressed');
    // TODO: Implement PDF download
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleDone} />
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successCard}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.checkIcon}>
              <Text style={styles.checkIconText}>✓</Text>
            </View>
          </View>

          <Text style={styles.successTitle}>Loan Successfully Applied</Text>
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
              <Text style={styles.detailLabel}>Deposit to</Text>
              <Text style={styles.detailValue}>Prime A/C ***********5463</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>KSH {loanData.amount.toLocaleString()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>KSH {loanData.price.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailValue}>KSH {loanData.fee.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>REF ID</Text>
              <Text style={styles.detailValue}>{refId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{time}</Text>
            </View>

            {/* Get PDF Receipt Button */}
            <TouchableOpacity style={styles.receiptButton} onPress={handleGetReceipt}>
              <Text style={styles.receiptIcon}>⬇</Text>
              <Text style={styles.receiptButtonText}>Get PDF Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* All Done Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>All Done</Text>
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
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 16,
  },
  checkIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
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
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  receiptIcon: {
    fontSize: 18,
    color: colors.primary.DEFAULT,
  },
  receiptButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
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
  doneButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 120,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
