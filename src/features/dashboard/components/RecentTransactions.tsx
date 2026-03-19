import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme';
import { parseCurrencyAmount } from '../../../services/api/types';
import type { Transaction } from '../../../services/api/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
      </View>

      <View style={styles.transactionsList}>
        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent transactions</Text>
          </View>
        )}

        {transactions.map((transaction, index) => {
          const isCredit = transaction.entryType === 'CREDIT';
          const amount = parseCurrencyAmount(transaction.amount);

          return (
            <TouchableOpacity
              key={`${transaction.transactionDate}-${index}`}
              style={[
                styles.transactionItem,
                index === transactions.length - 1 && styles.lastItem,
              ]}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.iconContainer, isCredit ? styles.creditIcon : styles.debitIcon]}>
                  <Text style={styles.iconText}>{isCredit ? '↓' : '↑'}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.transactionType}</Text>
                  <Text style={styles.transactionDate}>{transaction.transactionDate}</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, isCredit ? styles.creditAmount : styles.debitAmount]}>
                {isCredit ? '+' : '-'} KES {amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontFamily: 'Manrope_700Bold', fontSize: 14, fontWeight: '700', color: '#1F2937' },
  transactionsList: {
    backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  emptyState: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
  transactionItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  lastItem: { borderBottomWidth: 0 },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  creditIcon: { backgroundColor: '#ECFDF5' },
  debitIcon: { backgroundColor: '#FEF2F2' },
  iconText: { fontSize: 16, fontWeight: '700' },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  transactionDate: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#9CA3AF' },
  transactionAmount: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, fontWeight: '600' },
  creditAmount: { color: colors.success },
  debitAmount: { color: '#EF4444' },
});
