import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

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
    <View className="px-6 pt-4 pb-6">
      {/* Top Row: Logo + User Image + Bell */}
      <View className="flex-row items-center justify-between mb-6">
        {/* Logo */}
        <Image
          source={require('../../../../assets/logoshort.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />

        {/* User Image */}
        <Image
          source={require('../../../../assets/userImage.png')}
          style={{ width: 60, height: 60, borderRadius: 30 }}
          resizeMode="cover"
        />

        {/* Bell Icon with Badge */}
        <TouchableOpacity onPress={handleBellPress} className="relative">
          <Image
            source={require('../../../../assets/bellIcom.png')}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Greeting Section */}
      <View className="items-center">
        <Text className="text-xl font-manrope-semibold text-gray-800">
          {getGreeting()},{' '}
          <Text className="text-primary-500">{userName}</Text>
        </Text>
        <Text className="text-sm font-manrope-regular text-gray-500 mt-1">
          Last login: {lastLogin}
        </Text>
      </View>
    </View>
  );
};
