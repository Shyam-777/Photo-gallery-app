export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  password: string;
}

/** Fields that can be edited from the Profile screen (email is the account key). */
export type EditableProfile = Pick<User, 'fullName' | 'gender' | 'mobile' | 'address' | 'city'>;

export interface GalleryImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  downloadUrl: string;
}

export type LoadStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export type AuthResult = { ok: true } | { ok: false; error: string };

export type NameFilter = 'all' | 'a-m' | 'n-z';

export type ThemeMode = 'light' | 'dark' | 'system';
