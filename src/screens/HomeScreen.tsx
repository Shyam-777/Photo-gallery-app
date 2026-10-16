import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FilterChips } from '../components/FilterChips';
import { ImageCard } from '../components/ImageCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { usePaginatedList } from '../hooks/usePaginatedList';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import { useFavorites } from '../store/favoritesStore';
import { useGalleryStore } from '../store/galleryStore';
import { useTheme } from '../theme/useTheme';
import type { GalleryImage, NameFilter } from '../types';
import { filterImages } from '../utils/filters';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { images, status, error, load } = useGalleryStore();
  const { ids, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NameFilter>('all');

  useEffect(() => {
    if (status === 'idle') load();
  }, [status, load]);

  // Search + filter are applied together, then the result is paginated.
  const filtered = useMemo(() => filterImages(images, query, filter), [images, query, filter]);
  const { visible, hasMore, loadMore } = usePaginatedList(filtered, `${query}|${filter}`);

  const openDetails = useCallback(
    (image: GalleryImage) => navigation.navigate('ImageDetails', { image }),
    [navigation],
  );
  const onRefresh = useCallback(() => load({ refresh: true }), [load]);

  if (status === 'loading' || status === 'idle') return <LoadingView message="Loading images…" />;
  if (status === 'error' && images.length === 0) {
    return <ErrorView message={error ?? 'Unknown error'} onRetry={() => load()} />;
  }

  return (
    <View style={styles.flex}>
      <View style={[styles.controls, { backgroundColor: colors.background }]}>
        <SearchBar value={query} onChangeText={setQuery} />
        <FilterChips value={filter} onChange={setFilter} />
      </View>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard image={item} isFavorite={ids.has(item.id)} onPress={openDetails} onToggleFavorite={toggle} />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={status === 'refreshing'} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <EmptyView title="No images found" message="Try a different author name or filter." />
        }
        ListFooterComponent={hasMore ? <ActivityIndicator style={styles.footer} color={colors.primary} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  controls: { padding: 16, paddingBottom: 8, gap: 10 },
  list: { paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 },
  footer: { paddingVertical: 16 },
});
