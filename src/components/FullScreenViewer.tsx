import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { imageUrl } from '../services/imageApi';
import type { GalleryImage } from '../types';

interface Props {
  image: GalleryImage;
  visible: boolean;
  downloading: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function FullScreenViewer({ image, visible, downloading, onClose, onDownload }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Image
          source={{ uri: imageUrl(image.id, 1600, 1200) }}
          style={{ width, height }}
          resizeMode="contain"
        />
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityLabel="Close full screen"
          style={[styles.close, { top: insets.top + 12 }]}
        >
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <Pressable
          onPress={onDownload}
          disabled={downloading}
          accessibilityRole="button"
          style={[styles.download, { bottom: insets.bottom + 24 }]}
        >
          {downloading ? <ActivityIndicator color="#fff" /> : <Ionicons name="download-outline" size={20} color="#fff" />}
          <Text style={styles.downloadText}>{downloading ? 'Saving…' : 'Download'}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  close: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  download: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  downloadText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
