import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { FormField } from '../components/FormField';
import { RadioGroup } from '../components/RadioGroup';
import { CITIES, GENDERS } from '../constants';
import { useAuthStore, useCurrentUser } from '../store/authStore';
import { radius } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import type { Gender, User } from '../types';
import { validateProfile, type FormErrors, type ProfileForm } from '../utils/validation';

const toForm = (u: User): ProfileForm => ({
  fullName: u.fullName,
  gender: u.gender,
  mobile: u.mobile,
  address: u.address,
  city: u.city,
});

export function ProfileScreen() {
  const { colors } = useTheme();
  const user = useCurrentUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [errors, setErrors] = useState<FormErrors<ProfileForm>>({});

  if (!user) return null;

  const startEdit = () => {
    setForm(toForm(user));
    setErrors({});
    setEditing(true);
  };

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    if (!form) return;
    const found = validateProfile(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    updateProfile({
      fullName: form.fullName.trim(),
      gender: form.gender as Gender,
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      city: form.city,
    });
    setEditing(false);
  };

  const confirmLogout = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.initials, { color: colors.onPrimary }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
          <Text style={{ color: colors.textSecondary }}>{user.email}</Text>
        </View>

        {editing && form ? (
          <View>
            <FormField label="Full Name" value={form.fullName} onChangeText={(v) => set('fullName', v)} error={errors.fullName} />
            <FormField label="Email Address" value={user.email} editable={false} style={{ opacity: 0.6 }} />
            <RadioGroup label="Gender" options={GENDERS} value={form.gender} onChange={(v) => set('gender', v)} error={errors.gender} />
            <FormField
              label="Mobile Number"
              value={form.mobile}
              onChangeText={(v) => set('mobile', v.replace(/[^\d]/g, ''))}
              error={errors.mobile}
              keyboardType="number-pad"
              maxLength={10}
            />
            <FormField label="Address" value={form.address} onChangeText={(v) => set('address', v)} error={errors.address} multiline style={styles.multiline} />
            <Dropdown label="City" value={form.city} options={CITIES} onChange={(v) => set('city', v)} error={errors.city} />
            <Button title="Save changes" onPress={save} />
            <View style={styles.gap} />
            <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} />
          </View>
        ) : (
          <View>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <InfoRow label="Full Name" value={user.fullName} />
              <InfoRow label="Email Address" value={user.email} />
              <InfoRow label="Mobile Number" value={user.mobile} />
              <InfoRow label="Gender" value={user.gender} />
              <InfoRow label="Address" value={user.address} />
              <InfoRow label="City" value={user.city} last />
            </View>
            <Button title="Edit profile" onPress={startEdit} />
            <View style={styles.gap} />
            <Button title="Log out" variant="danger" onPress={confirmLogout} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoRow, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20, gap: 4 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  initials: { fontSize: 30, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 16, marginBottom: 20 },
  infoRow: { paddingVertical: 12 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
  gap: { height: 12 },
});
