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
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { AppBackground, BackButton } from '../../../shared/components';
import { useOnboardingStore } from '../../../store/onboardingStore';
import type { Group } from '../../../services/api/types';

const DUMMY_GROUPS: Group[] = [
  { id: 1, name: 'Kahawa West Boda Riders', org_id: 0 },
  { id: 2, name: 'Women Guilded Association', org_id: 0 },
  { id: 3, name: 'Vijana kwa Vijana Association', org_id: 0 },
];

type SelectGroupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SelectGroup'>;

const GroupCard = ({
  group,
  onPress,
}: {
  group: Group;
  onPress: () => void;
}) => {
  const initials = group.name
    .split(' ')
    .slice(0, 1)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.groupCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.groupCardContent}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>{initials}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupSubtitle}>select this group to join</Text>
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export const SelectGroupScreen = () => {
  const navigation = useNavigation<SelectGroupScreenNavigationProp>();
  const { selectedOrg, setSelectedGroup } = useOnboardingStore();

  const handleGroupPress = (group: Group) => {
    setSelectedGroup(group);
    navigation.navigate('KYC');
  };

  const handleActivateAccount = () => {
    navigation.navigate('SaccoSelection');
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BackButton style={styles.backButton} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Select group</Text>
          <Text style={styles.subtitle}>
            Kindly select one of the groups you would like to join from{' '}
            {selectedOrg?.name ?? 'your SACCO'}
          </Text>

          <View style={styles.groupList}>
            {DUMMY_GROUPS.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={() => handleGroupPress(group)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleActivateAccount}>
            <Text style={styles.footerLink}>Activate Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 110, paddingHorizontal: 24, paddingBottom: 24 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary.DEFAULT, marginBottom: 12 },
  subtitle: { ...typography.styles.bodyMedium, fontSize: 14, color: colors.text.secondary, marginBottom: 32, lineHeight: 20 },
  groupList: { gap: 0 },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupAvatarText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  groupInfo: { flex: 1 },
  groupName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  groupSubtitle: { ...typography.styles.bodySmall, fontSize: 12, color: colors.text.secondary },
  chevronContainer: { marginLeft: 8 },
  chevron: { fontSize: 22, color: colors.text.secondary, fontWeight: '300' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 16,
  },
  footerText: { ...typography.styles.bodyMedium, color: colors.text.secondary },
  footerLink: { ...typography.styles.bodyMedium, color: colors.primary.DEFAULT, fontWeight: '600' },
});
