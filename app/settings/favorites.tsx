import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, fonts } from '../../src/lib/theme';
import { usePrefs } from '../../src/lib/userPrefs';
import { tailors } from '../../src/data/tailors';

export default function FavoritesScreen() {
  const router = useRouter();
  const { prefs, toggleFavorite } = usePrefs();
  const favs = tailors.filter((t) => prefs.favorites.includes(t.id));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center -ml-2" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View className="flex-1 ml-3">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text }}>Favorites</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
            {favs.length} tailor{favs.length === 1 ? '' : 's'} saved
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {favs.length === 0 ? (
          <View className="items-center py-16">
            <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="heart-outline" size={36} color={theme.colors.primary} />
            </View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 14 }}>No favorites yet</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 4, textAlign: 'center' }}>
              Tap the heart on any tailor to save them here
            </Text>
            <Pressable onPress={() => router.push('/(customer)/explore')} className="mt-5 px-6 py-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: 'white' }}>Browse tailors</Text>
            </Pressable>
          </View>
        ) : (
          favs.map((t) => (
            <Pressable key={t.id} onPress={() => router.push(`/tailor/${t.id}`)}
              className="rounded-2xl p-3 mb-3 flex-row items-center"
              style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
              <Image source={{ uri: t.image }} className="w-16 h-16 rounded-xl" resizeMode="cover" />
              <View className="flex-1 ml-3">
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>{t.name}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                  {t.specialty} · {t.area}
                </Text>
                <View className="flex-row items-center mt-1.5">
                  <Ionicons name="star" size={11} color={theme.colors.accent} />
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.text, marginLeft: 4 }}>
                    {t.rating} · {t.reviewCount}
                  </Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: theme.colors.primary, marginLeft: 10 }}>
                    From KD {t.startingPrice}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => toggleFavorite(t.id)} className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
                <Ionicons name="heart" size={16} color={theme.colors.primary} />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
