import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DashboardHeader, AccountCarousel, QuickActions, RecentTransactions, AdBanner } from '../components';
import { useClientDetails, useClientAccounts, useMiniStatement, useDashboardRefresh } from '../../../hooks/useDashboard';
import { useAuthStore } from '../../../store/authStore';
import { parseAmount } from '../../../services/api/types';

export const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const { lastLogin, lastKnownFirstname } = useAuthStore();
  const { data: details } = useClientDetails();
  const { data: accounts } = useClientAccounts();
  const refreshDashboard = useDashboardRefresh();

  // Use the first savings (non-share) account for the mini statement
  const primaryAccount = accounts?.find((a) => a.isShare === 0);
  const { data: transactions } = useMiniStatement(primaryAccount?.accountId, primaryAccount?.productId);

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshDashboard();
    // Give React Query a moment to kick off the refetch
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Map API accounts to AccountCarousel's expected shape
  const mappedAccounts = (accounts ?? [])
    .filter((a) => a.isShare === 0)
    .map((a) => ({
      id: String(a.accountId),
      accountName: a.accountName,
      accountNumber: a.accountNumber,
      availableBalance: parseAmount(a.availableBalance),
      actualBalance: parseAmount(a.currentBalance),
      isActive: true,
    }));

  // Fallback to a placeholder if API hasn't loaded yet
  const displayAccounts = mappedAccounts.length > 0
    ? mappedAccounts
    : [{ id: '0', accountName: '—', accountNumber: '—', availableBalance: 0, actualBalance: 0, isActive: false }];

  const userName = details?.identification.fullName.split(' ')[0] ?? lastKnownFirstname ?? '...';

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <ImageBackground
        source={require('../../../../assets/background.png')}
        style={styles.backgroundSection}
        resizeMode="cover"
      >
        <DashboardHeader
          userName={userName}
          lastLogin={lastLogin ?? ''}
          notificationCount={0}
        />

        <AccountCarousel
          accounts={displayAccounts}
          onMakeDeposit={() => navigation.navigate('MakeDeposit')}
        />
      </ImageBackground>

      <QuickActions />

      <RecentTransactions transactions={transactions ?? []} />

      <AdBanner />

      <View style={styles.contentContainer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  backgroundSection: { paddingBottom: 20 },
  contentContainer: { paddingHorizontal: 24, paddingVertical: 16 },
});
