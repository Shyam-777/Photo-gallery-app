import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import type { AuthStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/useTheme';
import { validateLogin } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');

  const onSubmit = () => {
    const found = validateLogin(email, password);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;

    const result = login(email, password);
    if (!result.ok) setFormError(result.error);
    // On success the session is saved and RootNavigator swaps to the app stack.
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: colors.text }]}>Log in</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Use the account you registered on this device.
        </Text>

        <FormField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="you@example.com"
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          placeholder="Your password"
        />

        {formError ? <Text style={[styles.formError, { color: colors.danger }]}>{formError}</Text> : null}

        <Button title="Log in" onPress={onSubmit} />
        <View style={styles.spacer} />
        <Button title="Create an account" variant="outline" onPress={() => navigation.navigate('Register')} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 28 },
  heading: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 4, marginBottom: 24 },
  formError: { fontSize: 14, marginBottom: 12, fontWeight: '500' },
  spacer: { height: 12 },
});
