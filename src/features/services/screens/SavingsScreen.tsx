import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme';
import { BackButton } from '../../../shared/components';

const mockTransactions = [
  { id: '1', title: 'Withdraw to Mpesa', date: '12 Dec, 12:40', amount: 'Ksh 5,000', type: 'debit' },
];

export const SavingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Top section with background image — mirrors Dashboard pattern */}
      <ImageBackground
        source={require('../../../../assets/background.png')}
        style={[styles.topSection, { paddingTop: insets.top }]}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton style={styles.backButton} color={colors.text.primary} />
          <Image
            source={require('../../../../assets/logoshort.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.topContent}>
          <Text style={styles.title}>Savings</Text>
          <Text style={styles.subtitle}>Don't just spend, save more too</Text>

          {/* Savings Card */}
          <View style={styles.savingsCard}>
            {/* Decorative circles */}
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardLabel}>Savings</Text>
                <Text style={styles.cardPowered}>Powered by Stima SACCO</Text>
              </View>
              <Text style={styles.saccoLogo}>STIMA{'\n'}SACCO</Text>
            </View>
            <View style={styles.cardDivider} />
            <Text style={styles.balanceLabel}>Savings Balance</Text>
            <Text style={styles.balanceAmount}>Ksh 200,000.00</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Bottom content on plain background */}
      <View style={styles.bottomContent}>
        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonFilled}>
            <Text style={styles.actionButtonFilledText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonOutlined}>
            <Text style={styles.actionButtonOutlinedText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonIcon}>
            <Image
              source={require('../../../../assets/Statements.png')}
              style={styles.actionIconLarge}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>

        {mockTransactions.map((tx) => (
          <View key={tx.id} style={styles.transactionRow}>
            <View style={styles.txIconContainer}>
              <Image
                source={require('../../../../assets/Withdraw-icon.png')}
                style={styles.txIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={styles.txAmount}>{tx.amount}</Text>
          </View>
        ))}

        {/* Ad Banner */}
        <TouchableOpacity style={styles.adBanner} activeOpacity={0.9}>
          <Image
            source={require('../../../../assets/AdBanner.png')}
            style={styles.adBannerImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topSection: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: { width: 36, height: 36 },
  topContent: { paddingHorizontal: 24 },
  title: {
    fontSize: 24,
    fontFamily: 'Manrope_800ExtraBold',
    color: colors.primary.DEFAULT,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    color: colors.text.secondary,
    marginBottom: 24,
  },
  savingsCard: {
    backgroundColor: '#6B7FC4',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  circleTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -40,
    left: 40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
  },
  cardPowered: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  saccoLogo: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
    textAlign: 'right',
    letterSpacing: 1,
  },
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
    alignItems: 'center',
  },
  actionButtonFilled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 24,
    paddingVertical: 13,
  },
  actionButtonOutlined: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary.DEFAULT,
    borderRadius: 24,
    paddingVertical: 13,
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconLarge: { width: 22, height: 22 },
  actionButtonFilledText: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: '#FFFFFF',
  },
  actionButtonOutlinedText: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary.DEFAULT,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.text.primary,
  },
  seeMore: {
    fontSize: 13,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary.DEFAULT,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  txIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIcon: {
    width: 20,
    height: 20,
    tintColor: '#EF4444',
  },
  txDetails: { flex: 1 },
  txTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.text.primary,
  },
  txDate: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: colors.text.secondary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: '#EF4444',
  },
  adBanner: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  adBannerImage: { width: '100%', height: 86, borderRadius: 12 },
});
