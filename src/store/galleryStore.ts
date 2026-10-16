import { create } from 'zustand';
import { fetchImages } from '../services/imageApi';
import type { GalleryImage, LoadStatus } from '../types';

interface GalleryState {
  images: GalleryImage[];
  status: LoadStatus;
  error: string | null;
  /** Loads images. Concurrent calls (e.g. repeated pull-to-refresh) share one request. */
  load: (opts?: { refresh?: boolean }) => Promise<void>;
}

let inFlight: Promise<void> | null = null;

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  status: 'idle',
  error: null,

  load: (opts) => {
    if (inFlight) return inFlight;

    const hasData = get().images.length > 0;
    set({ status: opts?.refresh && hasData ? 'refreshing' : 'loading', error: null });

    inFlight = fetchImages()
      .then((images) => set({ images, status: 'success' }))
      .catch((e: unknown) =>
        set({
          status: 'error',
          error: e instanceof Error ? e.message : 'Something went wrong while loading images.',
        }),
      )
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  },
}));
