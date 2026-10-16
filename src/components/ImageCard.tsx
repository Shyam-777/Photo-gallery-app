import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imageUrl } from '../services/imageApi';
import { radius } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import type { GalleryImage } from '../types';

interface Props {
  image: GalleryImage;
  isFavorite: boolean;
  onPress: (image: GalleryImage) => void;
  onToggleFavorite: (image: GalleryImage) => void;
}

function ImageCardBase({ image, isFavorite, onPress, onToggleFavorite }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => onPress(image)}
      accessibilityRole="button"
      accessibilityLabel={`Photo by ${image.author}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Image
        source={{ uri: imageUrl(image.id, 400, 300) }}
        style={[styles.thumb, { backgroundColor: colors.surfaceAlt }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.texts}>
          <Text numberOfLines={1} style={[styles.author, { color: colors.text }]}>
            {image.author}
          </Text>
          <Text style={[styles.id, { color: colors.textSecondary }]}>ID: {image.id}</Text>
        </View>
        <Pressable
          onPress={() => onToggleFavorite(image)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? colors.heart : colors.textSecondary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

export const ImageCard = memo(ImageCardBase);

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  thumb: { width: '100%', aspectRatio: 4 / 3 },
  info: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  texts: { flex: 1 },
  author: { fontSize: 16, fontWeight: '700' },
  id: { fontSize: 13, marginTop: 2 },
});
