import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import type { LoanProduct } from '../../../services/api/types';
import { parseCurrencyAmount } from '../../../services/api/types';

interface LoanProductsProps {
  hasActiveLoan: boolean;
  products?: LoanProduct[];
  onApplyLoan?: (productId: number, loanType: string, loanLimit: number) => void;
}

export const LoanProducts: React.FC<LoanProductsProps> = ({ hasActiveLoan, products, onApplyLoan }) => {
  const productList = products ?? [];

  if (hasActiveLoan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Here are more loan products</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {productList.map((product) => (
            <View key={product.productId} style={styles.horizontalCard}>
              <Text style={styles.horizontalCardTitle}>{product.name}</Text>
              <Text style={styles.horizontalCardDescription}>
                Limit: Ksh {parseCurrencyAmount(product.limit).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => onApplyLoan?.(product.productId, product.name, parseCurrencyAmount(product.limit))}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to do?</Text>
      <View style={styles.gridContainer}>
        {productList.map((product) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.gridCard}
            onPress={() => onApplyLoan?.(product.productId, product.name, parseCurrencyAmount(product.limit))}
          >
            <Text style={styles.gridCardTitle}>{product.name}</Text>
            <Text style={styles.gridCardDescription}>
              {(product as any).description ?? product.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 110,
    justifyContent: 'flex-start',
  },
  gridCardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#C9A255',
    marginBottom: 8,
    lineHeight: 20,
  },
  gridCardDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 17,
  },
  horizontalContainer: {
    gap: 8,
    paddingRight: 24,
  },
  horizontalCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingTop: 12,
    paddingRight: 8,
    paddingBottom: 12,
    paddingLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  horizontalCardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#C9A255',
    lineHeight: 14,
    letterSpacing: 0,
    marginBottom: 8,
  },
  horizontalCardDescription: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 14,
    letterSpacing: 0,
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: '#C9A255',
    borderRadius: 12,
    paddingTop: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 12,
    height: 26,
    minWidth: 57,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 10,
    letterSpacing: 0,
  },
});
