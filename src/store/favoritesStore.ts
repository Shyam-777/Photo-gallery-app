import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';
import type { GalleryImage } from '../types';
import { useAuthStore } from './authStore';
import { persistStorage } from './storage';

interface FavoritesState {
  /** Favourite images per user (full objects so the Favorites screen works offline). */
  byUser: Record<string, GalleryImage[]>;
  toggle: (email: string, image: GalleryImage) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      byUser: {},
      toggle: (email, image) =>
        set((s) => {
          const current = s.byUser[email] ?? [];
          const next = current.some((i) => i.id === image.id)
            ? current.filter((i) => i.id !== image.id)
            : [image, ...current];
          return { byUser: { ...s.byUser, [email]: next } };
        }),
    }),
    { name: STORAGE_KEYS.favorites, storage: persistStorage },
  ),
);

const EMPTY: GalleryImage[] = [];

/** Favorites for the logged-in user. */
export function useFavorites() {
  const email = useAuthStore((s) => s.currentEmail);
  const favorites = useFavoritesStore((s) => (email ? (s.byUser[email] ?? EMPTY) : EMPTY));
  const toggleInStore = useFavoritesStore((s) => s.toggle);

  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  const toggle = useCallback(
    (image: GalleryImage) => {
      if (email) toggleInStore(email, image);
    },
    [email, toggleInStore],
  );

  return { favorites, ids, toggle };
}
