import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme';

interface DashboardHeaderProps {
  userName: string;
  lastLogin: string;
  notificationCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  lastLogin,
  notificationCount = 0,
}) => {
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleBellPress = () => {
    console.log('Bell icon pressed - Notifications:', notificationCount);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Top Row: Logo + User Image + Bell */}
      <View style={styles.topRow}>
        {/* Logo */}
        <Image
          source={require('../../../../assets/logoshort.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* User Image */}
        <Image
          source={require('../../../../assets/userImage.png')}
          style={styles.userImage}
          resizeMode="cover"
        />

        {/* Bell Icon with Badge */}
        <TouchableOpacity onPress={handleBellPress} style={styles.bellContainer}>
          <Image
            source={require('../../../../assets/bellIcom.png')}
            style={styles.bellIcon}
            resizeMode="contain"
          />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          {getGreeting()},{' '}
          <Text style={styles.userName}>{userName}</Text>
        </Text>
        <Text style={styles.lastLoginText}>
          Last login: {lastLogin}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 30,
    height: 30,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  bellContainer: {
    position: 'relative',
  },
  bellIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  greetingContainer: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
  },
  lastLoginText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
