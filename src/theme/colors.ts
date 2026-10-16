export interface Colors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  onPrimary: string;
  danger: string;
  heart: string;
  overlay: string;
}

export const lightColors: Colors = {
  background: '#F4F5FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F7',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E2E5EE',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  danger: '#DC2626',
  heart: '#EF4444',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: Colors = {
  background: '#0E1014',
  surface: '#181B22',
  surfaceAlt: '#222630',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#2B303B',
  primary: '#818CF8',
  onPrimary: '#0E1014',
  danger: '#F87171',
  heart: '#F87171',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, lg: 16 } as const;
