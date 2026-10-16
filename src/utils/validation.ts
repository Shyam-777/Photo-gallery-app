import type { EditableProfile, User } from '../types';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_REGEX = /^\d{10}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return undefined;
}

export function validateMobile(mobile: string): string | undefined {
  if (!mobile.trim()) return 'Mobile number is required';
  if (!/^\d+$/.test(mobile.trim())) return 'Mobile number must contain digits only';
  if (!MOBILE_REGEX.test(mobile.trim())) return 'Mobile number must be exactly 10 digits';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
}

const required = (value: string, label: string) =>
  value.trim() ? undefined : `${label} is required`;

function compact<T extends object>(errors: FormErrors<T>): FormErrors<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as FormErrors<T>;
}

export interface RegisterForm extends Omit<User, 'gender'> {
  gender: User['gender'] | '';
  confirmPassword: string;
}

export function validateRegister(form: RegisterForm): FormErrors<RegisterForm> {
  return compact<RegisterForm>({
    fullName: required(form.fullName, 'Full name'),
    email: validateEmail(form.email),
    gender: form.gender ? undefined : 'Please select a gender',
    mobile: validateMobile(form.mobile),
    address: required(form.address, 'Address'),
    city: required(form.city, 'City'),
    password: validatePassword(form.password),
    confirmPassword: !form.confirmPassword
      ? 'Please confirm your password'
      : form.password !== form.confirmPassword
        ? 'Passwords do not match'
        : undefined,
  });
}

export function validateLogin(email: string, password: string) {
  return compact<{ email: string; password: string }>({
    email: validateEmail(email),
    password: password ? undefined : 'Password is required',
  });
}

export interface ProfileForm extends Omit<EditableProfile, 'gender'> {
  gender: EditableProfile['gender'] | '';
}

export function validateProfile(form: ProfileForm): FormErrors<ProfileForm> {
  return compact<ProfileForm>({
    fullName: required(form.fullName, 'Full name'),
    gender: form.gender ? undefined : 'Please select a gender',
    mobile: validateMobile(form.mobile),
    address: required(form.address, 'Address'),
    city: required(form.city, 'City'),
  });
}
