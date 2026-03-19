import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { useAuthStore } from '../../../store/authStore';
import { useClientDetails } from '../../../hooks/useDashboard';

const maskPhone = (v: string) => v.replace(/(\+?\d{3})\d+(\d{3})/, '$1 *** ***$2');
const maskEmail = (v: string) => {
  const [local, domain] = v.split('@');
  if (!domain) return v;
  return `${local.slice(0, 2)}***@${domain}`;
};
const maskId = (v: string) => v.replace(/.(?=.{4})/g, '*');
const maskKra = (v: string) => `${v[0] ?? ''}***${v.slice(-2)}`;
const maskDob = (v: string) => v.replace(/\d{4}$/, '****');

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

const ActionItem = ({
  label,
  sublabel,
  onPress,
  danger,
}: {
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.actionLeft}>
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
      {sublabel ? <Text style={styles.actionSublabel}>{sublabel}</Text> : null}
    </View>
    <Text style={[styles.actionChevron, danger && styles.actionLabelDanger]}>›</Text>
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, clearAuth } = useAuthStore();
  const { data: details, isLoading } = useClientDetails();

  const fullName = details?.identification.fullName ?? user?.name ?? '—';
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const memberNumber = details?.personalInfo.memberNumber ?? '—';
  const phone = details?.personalInfo.phone ?? user?.phone ?? '—';
  const email = details?.personalInfo.email ?? user?.email ?? '—';
  const idNumber = details?.identification.idNumber ?? user?.idNumber ?? '—';
  const dob = details?.identification.dob ?? user?.dob ?? '—';
  const gender = details?.identification.gender ?? '—';
  const kraPin = details?.personalInfo.kraPin ?? '—';

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          navigation.getParent()?.navigate('Auth');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[300], colors.primary.DEFAULT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator color={colors.text.inverse} style={{ marginTop: 12 }} />
        ) : (
          <>
            <Text style={styles.headerName}>{fullName}</Text>
            <Text style={styles.headerMember}>Member No. {memberNumber}</Text>
          </>
        )}
      </LinearGradient>

      <View style={styles.body}>
        {/* Personal Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <InfoRow label="Full Name" value={fullName} />
          <View style={styles.divider} />
          <InfoRow label="Phone" value={phone !== '—' ? maskPhone(phone) : '—'} />
          <View style={styles.divider} />
          <InfoRow label="Email" value={email !== '—' ? maskEmail(email) : '—'} />
          <View style={styles.divider} />
          <InfoRow label="ID Number" value={idNumber !== '—' ? maskId(idNumber) : '—'} />
          <View style={styles.divider} />
          <InfoRow label="Date of Birth" value={dob !== '—' ? maskDob(dob) : '—'} />
          <View style={styles.divider} />
          <InfoRow label="Gender" value={gender} />
          <View style={styles.divider} />
          <InfoRow label="KRA PIN" value={kraPin !== '—' ? maskKra(kraPin) : '—'} />
        </View>

        {/* Account Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <ActionItem
            label="Get Statement"
            sublabel="Request account statement via email"
            onPress={() => navigation.navigate('StatementOptions')}
          />
          <View style={styles.divider} />
          <ActionItem
            label="Log Out"
            onPress={handleLogout}
            danger
          />
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.text.inverse,
  },
  headerName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSizes['2xl'],
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerMember: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSizes.base,
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  infoValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSizes.sm,
    color: colors.text.primary,
    maxWidth: '55%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionLeft: {
    flex: 1,
  },
  actionLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSizes.base,
    color: colors.text.primary,
  },
  actionLabelDanger: {
    color: colors.error,
  },
  actionSublabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  actionChevron: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 22,
    color: colors.text.tertiary,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
