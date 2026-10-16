import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { FullScreenViewer } from '../components/FullScreenViewer';
import { useDownloadImage } from '../hooks/useDownloadImage';
import { useShareImage } from '../hooks/useShareImage';
import type { AppStackParamList } from '../navigation/types';
import { imageUrl } from '../services/imageApi';
import { useFavorites } from '../store/favoritesStore';
import { radius } from '../theme/colors';
import { useTheme } from '../theme/useTheme';

type Props = NativeStackScreenProps<AppStackParamList, 'ImageDetails'>;

export function ImageDetailsScreen({ route }: Props) {
  const { image } = route.params;
  const { colors } = useTheme();
  const { ids, toggle } = useFavorites();
  const { downloading, download } = useDownloadImage(image);
  const share = useShareImage(image);
  const [fullScreen, setFullScreen] = useState(false);
  const isFavorite = ids.has(image.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => setFullScreen(true)} accessibilityLabel="View full screen">
        <Image
          source={{ uri: imageUrl(image.id, 1200, 900) }}
          style={[styles.image, { backgroundColor: colors.surfaceAlt, aspectRatio: image.width / image.height }]}
          resizeMode="cover"
        />
        <View style={styles.expand}>
          <Ionicons name="expand-outline" size={18} color="#fff" />
        </View>
      </Pressable>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.author, { color: colors.text }]}>{image.author}</Text>
          <Text style={[styles.id, { color: colors.textSecondary }]}>Image ID: {image.id}</Text>
          <Text style={[styles.id, { color: colors.textSecondary }]}>
            {image.width} × {image.height}
          </Text>
        </View>
        <Pressable onPress={() => toggle(image)} hitSlop={12} accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? colors.heart : colors.textSecondary} />
        </Pressable>
      </View>

      <Button title="Download to gallery" onPress={download} loading={downloading} />
      <View style={styles.gap} />
      <Button title="Share link" variant="outline" onPress={share} />
      <View style={styles.gap} />
      <Button title="View full screen" variant="outline" onPress={() => setFullScreen(true)} />

      <FullScreenViewer
        image={image}
        visible={fullScreen}
        downloading={downloading}
        onClose={() => setFullScreen(false)}
        onDownload={download}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  image: { width: '100%', maxHeight: 420, borderRadius: radius.lg },
  expand: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  author: { fontSize: 22, fontWeight: '800' },
  id: { fontSize: 14, marginTop: 2 },
  gap: { height: 12 },
});
