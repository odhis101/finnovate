import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from './types';
import { DashboardScreen } from '@features/dashboard';
import { LoansScreen } from '../features/loans/screens';
import { ServicesScreen } from '../features/services/screens';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Import tab icons
const tabIcons = {
  home: require('../../assets/homeIcon.png') as ImageSourcePropType,
  loans: require('../../assets/LoansIcon.png') as ImageSourcePropType,
  services: require('../../assets/ServicesIcon.png') as ImageSourcePropType,
  profile: require('../../assets/ProfileIcon.png') as ImageSourcePropType,
};

export const MainTabsNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D5B062',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Manrope_500Medium',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.home}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#D5B062' : '#9CA3AF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Loans"
        component={LoansScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.loans}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#D5B062' : '#9CA3AF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.services}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#D5B062' : '#9CA3AF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.profile}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#D5B062' : '#9CA3AF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
