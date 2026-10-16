import { API_URL, REQUEST_TIMEOUT_MS } from '../constants';
import type { GalleryImage } from '../types';

interface PicsumItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

/** Sized image URL for a Picsum photo id. */
export const imageUrl = (id: string, width: number, height: number) =>
  `https://picsum.photos/id/${id}/${width}/${height}.jpg`;

export async function fetchImages(): Promise<GalleryImage[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const data: PicsumItem[] = await res.json();
    return data.map((d) => ({
      id: d.id,
      author: d.author,
      width: d.width,
      height: d.height,
      url: d.url,
      downloadUrl: d.download_url,
    }));
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('The request timed out. Check your connection and try again.');
    }
    if (e instanceof TypeError) {
      throw new Error('Network error. Check your connection and try again.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
