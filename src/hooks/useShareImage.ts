import { useCallback } from 'react';
import { Alert, Share } from 'react-native';
import type { GalleryImage } from '../types';

/** Opens the phone's share sheet with a link to the photo (Unsplash page from the API). */
export function useShareImage(image: GalleryImage) {
  return useCallback(async () => {
    try {
      await Share.share({
        title: `Photo by ${image.author}`,
        message: `Photo by ${image.author}: ${image.url}`,
      });
    } catch (e) {
      Alert.alert('Could not share', e instanceof Error ? e.message : 'Something went wrong.');
    }
  }, [image]);
}
