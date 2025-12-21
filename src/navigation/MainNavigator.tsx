import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { DashboardScreen } from '@features/dashboard';

// Placeholder screens - will be replaced with actual screens
const LoansScreen = () => null;
const ServicesScreen = () => null;
const ProfileScreen = () => null;

const Tab = createBottomTabNavigator<MainTabParamList>();

// Import tab icons
const tabIcons = {
  home: require('../../assets/homeIcon.png') as ImageSourcePropType,
  loans: require('../../assets/LoansIcon.png') as ImageSourcePropType,
  services: require('../../assets/ServicesIcon.png') as ImageSourcePropType,
  profile: require('../../assets/ProfileIcon.png') as ImageSourcePropType,
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8056A4', // Purple
        tabBarInactiveTintColor: '#9CA3AF', // Gray
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
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
                tintColor: focused ? '#8056A4' : '#9CA3AF',
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
                tintColor: focused ? '#8056A4' : '#9CA3AF',
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
                tintColor: focused ? '#8056A4' : '#9CA3AF',
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
                tintColor: focused ? '#8056A4' : '#9CA3AF',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
