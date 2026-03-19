import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { AppBackground } from '../../../shared/components';

type ServicesNavProp = NativeStackNavigationProp<MainStackParamList>;

const menuItems = [
  {
    key: 'Guarantors',
    title: 'Guarantors',
    subtitle: 'See all your guantors & guarantees',
    screen: null,
  },
  {
    key: 'Savings',
    title: 'Savings',
    subtitle: "Don't just spend, Save for your future too",
    screen: 'Savings' as keyof MainStackParamList,
  },
  {
    key: 'Groups',
    title: 'Groups',
    subtitle: 'Access our groups easily today',
    screen: 'Groups' as keyof MainStackParamList,
  },
  {
    key: 'Requests',
    title: 'Requests',
    subtitle: 'Submit your Sacco requests here',
    screen: null,
  },
];

export const ServicesScreen = () => {
  const navigation = useNavigation<ServicesNavProp>();
  const insets = useSafeAreaInsets();

  return (
    <AppBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../../assets/logoshort.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Services</Text>
            <Text style={styles.headerSubtitle}>Get more services offered here</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={require('../../../../assets/bellIcom.png')}
              style={styles.bellIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Promo Banner */}
          <View style={styles.promoBannerContainer}>
            <Image
              source={require('../../../../assets/ServicesAd.png')}
              style={styles.promoBanner}
              resizeMode="cover"
            />
          </View>

          {/* What would you like to do */}
          <Text style={styles.sectionTitle}>What would you like to do ?</Text>

          {/* Menu Items */}
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={() => item.screen && navigation.navigate(item.screen as any)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Ad Banner */}
          <TouchableOpacity style={styles.adBanner} activeOpacity={0.9}>
            <Image
              source={require('../../../../assets/AdBanner.png')}
              style={styles.adBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: { width: 36, height: 36 },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary.DEFAULT,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Manrope_400Regular',
    color: colors.text.secondary,
  },
  bellIcon: { width: 24, height: 24 },
  scrollContent: { paddingBottom: 32 },
  promoBannerContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoBanner: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  menuList: {
    marginHorizontal: 16,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  menuItemText: { flex: 1 },
  menuItemTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary.DEFAULT,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: colors.text.secondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  adBanner: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  adBannerImage: {
    width: '100%',
    height: 86,
    borderRadius: 12,
  },
});
