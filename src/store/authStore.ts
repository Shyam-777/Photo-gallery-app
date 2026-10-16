import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';
import type { AuthResult, EditableProfile, User } from '../types';
import { normalizeEmail } from '../utils/validation';
import { persistStorage } from './storage';

interface AuthState {
  /** All registered accounts, keyed by normalised email. */
  users: Record<string, User>;
  /** Email of the logged-in user (session persistence). */
  currentEmail: string | null;
  register: (user: User) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (changes: EditableProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: {},
      currentEmail: null,

      register: (user) => {
        const key = normalizeEmail(user.email);
        if (get().users[key]) {
          return { ok: false, error: 'An account with this email already exists' };
        }
        const record: User = { ...user, email: key, fullName: user.fullName.trim() };
        set((s) => ({ users: { ...s.users, [key]: record } }));
        return { ok: true };
      },

      login: (email, password) => {
        const user = get().users[normalizeEmail(email)];
        if (!user) return { ok: false, error: 'No account found for this email' };
        if (user.password !== password) return { ok: false, error: 'Incorrect password' };
        set({ currentEmail: user.email });
        return { ok: true };
      },

      logout: () => set({ currentEmail: null }),

      updateProfile: (changes) => {
        const { currentEmail, users } = get();
        if (!currentEmail || !users[currentEmail]) return;
        set({ users: { ...users, [currentEmail]: { ...users[currentEmail], ...changes } } });
      },
    }),
    { name: STORAGE_KEYS.auth, storage: persistStorage },
  ),
);

/** Logged-in user (null when logged out). Re-renders when the profile changes. */
export const useCurrentUser = () =>
  useAuthStore((s) => (s.currentEmail ? (s.users[s.currentEmail] ?? null) : null));
