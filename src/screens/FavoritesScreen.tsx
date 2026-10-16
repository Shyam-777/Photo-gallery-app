import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageCard } from '../components/ImageCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyView } from '../components/StateViews';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import { useFavorites } from '../store/favoritesStore';
import type { GalleryImage } from '../types';
import { filterImages } from '../utils/filters';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Favorites'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function FavoritesScreen({ navigation }: Props) {
  const { favorites, ids, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterImages(favorites, query), [favorites, query]);

  const openDetails = useCallback(
    (image: GalleryImage) => navigation.navigate('ImageDetails', { image }),
    [navigation],
  );

  return (
    <View style={styles.flex}>
      {favorites.length > 0 ? (
        <View style={styles.search}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search favorites by author" />
        </View>
      ) : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard image={item} isFavorite={ids.has(item.id)} onPress={openDetails} onToggleFavorite={toggle} />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          favorites.length === 0 ? (
            <EmptyView icon="heart-outline" title="No favorites yet" message="Tap the heart on any image to save it here." />
          ) : (
            <EmptyView title="No matches" message="No favorite matches that author name." />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  search: { padding: 16, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, flexGrow: 1 },
});
