import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { saveImageToGallery } from '../services/downloadService';
import type { GalleryImage } from '../types';

/** Wraps the gallery download with loading state and user feedback. */
export function useDownloadImage(image: GalleryImage) {
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await saveImageToGallery(image);
      Alert.alert('Saved', 'The image was saved to your gallery.');
    } catch (e) {
      Alert.alert('Download failed', e instanceof Error ? e.message : 'Could not save the image.');
    } finally {
      setDownloading(false);
    }
  }, [image, downloading]);

  return { downloading, download };
}
