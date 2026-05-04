import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { tailors, categories, recentWork } from '../../src/data/tailors';
import { theme, fonts } from '../../src/lib/theme';
import { useI18n } from '../../src/lib/i18n';
import { useSession } from '../../lib/auth-client';
import { TailorCard } from '../../src/components/TailorCard';

export default function CustomerHome() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { data: session } = useSession();
  const userName = (session?.user?.name || session?.user?.email?.split('@')[0] || '').trim();
  const firstName = userName ? userName.split(' ')[0] : '';

  const shops = useQuery(api.queries.listShops, {}) ?? [];
  const featuredShops = shops.filter((s: any) => s.isFeatured);

  // Combine: registered shops first, then mock tailors as fallback content
  const featured = [...featuredShops, ...tailors].slice(0, 6);
  const nearby = [...tailors].sort((a, b) => a.distance - b.distance).slice(0, 3);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-5 pb-4 flex-row items-center justify-between" style={{ paddingTop: 16 }}>
          <View>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted }}>
              {t('marhaba')}{firstName ? `, ${firstName}` : ''} 👋
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="location" size={14} color={theme.colors.primary} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginLeft: 4 }}>
                Salmiya, Kuwait
              </Text>
              <Ionicons name="chevron-down" size={14} color={theme.colors.primary} style={{ marginLeft: 2 }} />
            </View>
          </View>
          <Pressable
            className="w-11 h-11 rounded-full items-center justify-center"
            style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.colors.text} />
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/(customer)/explore')}
          className="mx-5 rounded-2xl px-4 h-12 flex-row items-center"
          style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
        >
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginLeft: 8, flex: 1 }}>
            {t('search')}
          </Text>
          <View className="w-7 h-7 rounded-lg items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
            <Ionicons name="options-outline" size={15} color="white" />
          </View>
        </Pressable>

        <View className="mx-5 mt-5 rounded-3xl overflow-hidden" style={{ height: 168 }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80' }} className="w-full h-full absolute" resizeMode="cover" />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(124,45,92,0.55)' }} />
          <View className="flex-1 p-5 justify-end">
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: 'white', lineHeight: 28 }}>
              {lang === 'ar' ? 'تصاميم تُحاك\nبأيدٍ ماهرة' : 'Bespoke designs\nby master tailors'}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: 'white', opacity: 0.9, marginTop: 6 }}>
              {lang === 'ar' ? 'الكويت · ١٢٠+ خياطة محترفة' : 'Kuwait · 120+ verified tailors'}
            </Text>
          </View>
        </View>

        {/* Featured shops from registered tailors */}
        {featuredShops.length > 0 && (
          <View className="mt-7">
            <View className="px-5 flex-row items-center justify-between mb-3">
              <View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color={theme.colors.primary} />
                  <Text style={{ fontFamily: fonts.extrabold, fontSize: 17, color: theme.colors.text, marginLeft: 6 }}>
                    Featured Shops
                  </Text>
                </View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                  Premium tailors in Kuwait
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
              {featuredShops.map((s: any) => (
                <Pressable
                  key={s._id}
                  onPress={() => router.push(`/tailor/shop_${s._id}`)}
                  className="rounded-3xl overflow-hidden"
                  style={[{ width: 240, backgroundColor: theme.colors.surface }, theme.shadow.soft]}
                >
                  <Image source={{ uri: s.coverImage }} className="w-full h-32" resizeMode="cover" />
                  <View className="absolute top-3 left-3 px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: theme.colors.primary }}>
                    <Ionicons name="star" size={10} color="white" />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: 'white', marginLeft: 4, letterSpacing: 0.5 }}>
                      FEATURED
                    </Text>
                  </View>
                  <View className="absolute top-3 right-3 px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: theme.colors.text, marginLeft: 4 }}>{s.rating?.toFixed(1) ?? '5.0'}</Text>
                  </View>
                  <View className="p-3.5">
                    <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{s.name}</Text>
                    <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
                      {s.specialty} · {s.area}
                    </Text>
                    <View className="flex-row items-center justify-between mt-3">
                      <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.primary }}>
                        from KD {s.startingPrice}
                      </Text>
                      <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }}>
                        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: 'white' }}>Book</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="mt-6">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: theme.colors.text }}>
              {t('categories')}
            </Text>
            <Pressable onPress={() => router.push('/(customer)/explore')}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.primary }}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {categories.map((cat) => (
              <Pressable key={cat.id} onPress={() => router.push({ pathname: '/(customer)/explore', params: { category: cat.name } })} className="items-center" style={{ width: 80 }}>
                <View className="w-16 h-16 rounded-2xl items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                  <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                </View>
                <Text numberOfLines={2} style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.text, marginTop: 8, textAlign: 'center' }}>
                  {lang === 'ar' ? cat.nameAr : cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="mt-7">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: theme.colors.text }}>{t('featured')}</Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                {lang === 'ar' ? 'أفضل الخياطات في الكويت' : 'Hand-picked master tailors'}
              </Text>
            </View>
            <Pressable onPress={() => router.push('/(customer)/explore')}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.primary }}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
            {tailors.slice(0, 4).map((tl) => (
              <Pressable key={tl.id} onPress={() => router.push(`/tailor/${tl.id}`)} className="rounded-3xl overflow-hidden" style={[{ width: 240, backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
                <Image source={{ uri: tl.coverImage }} className="w-full h-32" resizeMode="cover" />
                <View className="absolute top-3 right-3 px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: theme.colors.text, marginLeft: 4 }}>{tl.rating}</Text>
                </View>
                <View className="p-3.5">
                  <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{tl.name}</Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>{tl.specialty} · {tl.area}</Text>
                  <View className="flex-row items-center justify-between mt-3">
                    <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.primary }}>from KD {tl.startingPrice}</Text>
                    <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }}>
                      <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: 'white' }}>Book</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="mt-7">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: theme.colors.text }}>{t('recentWork')}</Text>
          </View>
          <View className="flex-row flex-wrap px-4">
            {recentWork.slice(0, 4).map((w) => (
              <Pressable key={w.id} onPress={() => router.push(`/tailor/${w.tailorId}`)} style={{ width: '50%', padding: 4 }}>
                <View className="rounded-2xl overflow-hidden" style={{ aspectRatio: 1, backgroundColor: theme.colors.surface }}>
                  <Image source={{ uri: w.image }} className="w-full h-full absolute" resizeMode="cover" />
                  <View className="flex-1 justify-end p-2.5" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 11, color: 'white' }}>{w.caption}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="heart" size={11} color="white" />
                      <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: 'white', marginLeft: 4 }}>{w.likes}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mt-7 px-5">
          <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: theme.colors.text, marginBottom: 12 }}>{t('nearYou')}</Text>
          {nearby.map((tl) => (<TailorCard key={tl.id} tailor={tl} />))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
