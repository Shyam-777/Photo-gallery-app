import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';
import { imageUrl } from './imageApi';
import type { GalleryImage } from '../types';

/**
 * Downloads the image into the app cache, then saves it to the device gallery.
 * Throws an Error with a user-friendly message on failure.
 */
export async function saveImageToGallery(image: GalleryImage): Promise<void> {
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new Error('Gallery permission is required to save images.');
  }

  const target = new File(Paths.cache, `picsum-${image.id}.jpg`);
  const downloaded = await File.downloadFileAsync(imageUrl(image.id, 1600, 1200), target, {
    idempotent: true,
  });
  await MediaLibrary.saveToLibraryAsync(downloaded.uri);
}
