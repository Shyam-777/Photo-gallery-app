import type { GalleryImage, NameFilter } from '../types';

/** Filter by the first letter of the author's name. */
export function matchesNameFilter(author: string, filter: NameFilter): boolean {
  if (filter === 'all') return true;
  const first = author.trim().charAt(0).toLowerCase();
  if (filter === 'a-m') return first >= 'a' && first <= 'm';
  return first >= 'n' && first <= 'z';
}

/** Case-insensitive author search + name-range filter, applied together. */
export function filterImages(
  images: GalleryImage[],
  query: string,
  filter: NameFilter = 'all',
): GalleryImage[] {
  const q = query.trim().toLowerCase();
  return images.filter(
    (img) => (!q || img.author.toLowerCase().includes(q)) && matchesNameFilter(img.author, filter),
  );
}
