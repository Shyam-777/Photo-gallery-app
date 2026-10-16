import type { Gender, NameFilter } from '../types';

export const CITIES = [
  'Pune',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Nagpur',
] as const;

export const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

export const FILTER_OPTIONS: { value: NameFilter; label: string }[] = [
  { value: 'all', label: 'All Images' },
  { value: 'a-m', label: 'Author A–M' },
  { value: 'n-z', label: 'Author N–Z' },
];

/** Single source of truth for AsyncStorage keys. */
export const STORAGE_KEYS = {
  auth: 'app/auth',
  favorites: 'app/favorites',
  theme: 'app/theme',
} as const;

export const API_URL = 'https://picsum.photos/v2/list?page=1&limit=50';
export const PAGE_SIZE = 10;
export const REQUEST_TIMEOUT_MS = 15000;
