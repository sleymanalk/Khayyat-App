import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme, fonts } from '../../src/lib/theme';
import { useShop } from '../../src/lib/shopStore';

const SUGGESTED = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
  'https://images.unsplash.com/photo-1605086275953-9b5e6e9e6cc1?w=600&q=80',
  'https://images.unsplash.com/photo-1525257831700-e23ade4761fc?w=600&q=80',
  'https://images.unsplash.com/photo-1546961342-1531b85ed94f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
  'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
];

const SCREEN_W = Dimensions.get('window').width;

export default function TailorPortfolio() {
  const { shop, addGalleryImage, removeGalleryImage } = useShop();
  const [url, setUrl] = useState('');

  const tile = (SCREEN_W - 20 * 2 - 10) / 2;

  const onAddUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//.test(trimmed)) {
      Alert.alert('Invalid URL', 'Please enter a valid http(s) image URL.');
      return;
    }
    addGalleryImage(trimmed);
    setUrl('');
  };

  const onRemove = (img: string) => {
    Alert.alert('Remove photo?', 'This will hide the photo from your public portfolio.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeGalleryImage(img) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-5 pt-2">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>Portfolio</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
            Showcase your finest work · {shop.gallery.length} photos
          </Text>
        </View>

        {/* Add by URL */}
        <View className="mx-5 mt-5 rounded-2xl p-4" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text, marginBottom: 8 }}>
            Add a photo
          </Text>
          <View className="flex-row" style={{ gap: 8 }}>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="Paste image URL..."
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                fontFamily: fonts.medium,
                fontSize: 13,
                color: theme.colors.text,
                backgroundColor: theme.colors.bg,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
            <Pressable
              onPress={onAddUrl}
              className="rounded-xl items-center justify-center px-4"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Ionicons name="add" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Suggested */}
        <View className="px-5 mt-6 flex-row items-center justify-between mb-3">
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>Suggested</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted }}>
            Tap to add
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {SUGGESTED.filter((s) => !shop.gallery.includes(s)).map((s) => (
            <Pressable
              key={s}
              onPress={() => addGalleryImage(s)}
              className="rounded-2xl overflow-hidden"
              style={{ width: 110, height: 110 }}
            >
              <Image source={{ uri: s }} className="w-full h-full" resizeMode="cover" />
              <View
                className="absolute inset-0 items-center justify-center"
                style={{ backgroundColor: 'rgba(31,26,36,0.25)' }}
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Ionicons name="add" size={18} color="white" />
                </View>
              </View>
            </Pressable>
          ))}
          {SUGGESTED.every((s) => shop.gallery.includes(s)) && (
            <View className="rounded-2xl items-center justify-center px-6" style={{ height: 110, backgroundColor: theme.colors.surface }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted }}>
                All suggestions added
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Current gallery */}
        <Text className="px-5 mt-6 mb-3" style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>
          Your gallery
        </Text>
        {shop.gallery.length === 0 ? (
          <View className="mx-5 rounded-2xl items-center justify-center py-12" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
            <Ionicons name="images-outline" size={36} color={theme.colors.textMuted} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.colors.text, marginTop: 8 }}>
              No photos yet
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2, textAlign: 'center', paddingHorizontal: 32 }}>
              Add photos from above to start your portfolio
            </Text>
          </View>
        ) : (
          <View className="px-5 flex-row flex-wrap" style={{ gap: 10 }}>
            {shop.gallery.map((img, i) => (
              <View key={img + i} style={{ width: tile, height: tile }}>
                <Image
                  source={{ uri: img }}
                  className="rounded-2xl w-full h-full"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => onRemove(img)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                >
                  <Ionicons name="trash-outline" size={14} color={theme.colors.danger} />
                </Pressable>
                {i === 0 && (
                  <View
                    className="absolute bottom-2 left-2 px-2 py-1 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: 'white' }}>COVER</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
