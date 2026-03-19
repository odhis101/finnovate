import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme';
import { AppBackground, BackButton } from '../../../shared/components';

const myGroups = [
  { id: '1', name: 'Kahawa West Boda Riders', subtitle: 'select this group to join', initial: 'K' },
  { id: '2', name: 'Women guiled Ass', subtitle: 'select this group to join', initial: 'W' },
  { id: '3', name: 'Vijana kwa Vijana Association', subtitle: 'select this group to join', initial: 'V' },
];

const otherGroups = [
  { id: '4', name: 'Kahawa West Boda Riders', subtitle: 'select this group to join', initial: 'K' },
  { id: '5', name: 'Women guiled Ass', subtitle: 'select this group to join', initial: 'W' },
  { id: '6', name: 'Vijana kwa Vijana Association', subtitle: 'select this group to join', initial: 'V' },
];

export const GroupsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'my' | 'other'>('my');

  const groups = activeTab === 'my' ? myGroups : otherGroups;

  return (
    <AppBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton style={styles.backButton} />
          <Image
            source={require('../../../../assets/logoshort.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Groups</Text>
          <Text style={styles.subtitle}>Don't just spend, save more too</Text>

          {/* Tab Toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'my' && styles.tabActive]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
                My Groups
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'other' && styles.tabActive]}
              onPress={() => setActiveTab('other')}
            >
              <Text style={[styles.tabText, activeTab === 'other' && styles.tabTextActive]}>
                Other Groups
              </Text>
            </TouchableOpacity>
          </View>

          {/* Groups List */}
          {groups.map((group, index) => (
            <TouchableOpacity
              key={group.id}
              style={[styles.groupRow, index < groups.length - 1 && styles.groupRowBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{group.initial}</Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupSubtitle}>{group.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_600SemiBold',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  groupRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: '#FFFFFF',
  },
  groupInfo: { flex: 1 },
  groupName: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  groupSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: colors.text.secondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.text.secondary,
  },
});
