import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { FormField } from '../components/FormField';
import { RadioGroup } from '../components/RadioGroup';
import { CITIES, GENDERS } from '../constants';
import type { AuthStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import type { Gender } from '../types';
import { validateRegister, type FormErrors, type RegisterForm } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const INITIAL: RegisterForm = {
  fullName: '',
  email: '',
  gender: '',
  mobile: '',
  address: '',
  city: '',
  password: '',
  confirmPassword: '',
};

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState<RegisterForm>(INITIAL);
  const [errors, setErrors] = useState<FormErrors<RegisterForm>>({});

  const set = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = () => {
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    const { confirmPassword: _confirm, gender, ...rest } = form;
    const result = register({ ...rest, gender: gender as Gender });
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    Alert.alert('Account created', 'You can now log in with your credentials.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormField label="Full Name" value={form.fullName} onChangeText={(v) => set('fullName', v)} error={errors.fullName} placeholder="Your full name" />
        <FormField
          label="Email Address"
          value={form.email}
          onChangeText={(v) => set('email', v)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="you@example.com"
        />
        <RadioGroup label="Gender" options={GENDERS} value={form.gender} onChange={(v) => set('gender', v)} error={errors.gender} />
        <FormField
          label="Mobile Number"
          value={form.mobile}
          onChangeText={(v) => set('mobile', v.replace(/[^\d]/g, ''))}
          error={errors.mobile}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="10-digit mobile number"
        />
        <FormField
          label="Address"
          value={form.address}
          onChangeText={(v) => set('address', v)}
          error={errors.address}
          placeholder="Street, area"
          multiline
          style={styles.multiline}
        />
        <Dropdown label="City" value={form.city} options={CITIES} onChange={(v) => set('city', v)} error={errors.city} placeholder="Select your city" />
        <FormField label="Password" value={form.password} onChangeText={(v) => set('password', v)} error={errors.password} secureTextEntry placeholder="At least 6 characters" />
        <FormField label="Confirm Password" value={form.confirmPassword} onChangeText={(v) => set('confirmPassword', v)} error={errors.confirmPassword} secureTextEntry placeholder="Re-enter password" />

        <Button title="Register" onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
});
