import { useCallback, useEffect, useState } from 'react';
import { PAGE_SIZE } from '../constants';

/**
 * Client-side infinite scroll: reveals `pageSize` more items each time loadMore() is called.
 * The window resets whenever `resetKey` changes (e.g. search text or filter changed).
 */
export function usePaginatedList<T>(items: T[], resetKey: string, pageSize = PAGE_SIZE) {
  const [count, setCount] = useState(pageSize);

  useEffect(() => {
    setCount(pageSize);
  }, [resetKey, pageSize]);

  const loadMore = useCallback(() => {
    setCount((c) => (c < items.length ? c + pageSize : c));
  }, [items.length, pageSize]);

  return {
    visible: items.slice(0, count),
    hasMore: count < items.length,
    loadMore,
  };
}
