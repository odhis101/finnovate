import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { DashboardHeader } from '../components/DashboardHeader';

export const DashboardScreen = () => {
  // Mock data - will be replaced with actual data from API/state
  const mockUser = {
    name: 'Tafari',
    lastLogin: '08 Dec 2025',
    notificationCount: 3,
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <DashboardHeader
        userName={mockUser.name}
        lastLogin={mockUser.lastLogin}
        notificationCount={mockUser.notificationCount}
      />

      {/* Placeholder for other dashboard components */}
      <View className="px-6 py-4">
        <Text className="text-gray-600 text-center">
          Dashboard content will be added here...
        </Text>
      </View>
    </ScrollView>
  );
};
