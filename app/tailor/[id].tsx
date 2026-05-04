import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { tailors } from '../../src/data/tailors';
import { usePrefs } from '../../src/lib/userPrefs';

type Tab = 'services' | 'gallery' | 'reviews';

export default function TailorDetailScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tailor = tailors.find((t) => t.id === id);
  const [tab, setTab] = useState<Tab>('services');
  const { prefs, toggleFavorite } = usePrefs();
  const favorite = id ? prefs.favorites.includes(id) : false;

  if (!tailor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Tailor not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FAF7F2' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover image */}
        <View>
          <Image source={{ uri: tailor.coverImage }} style={{ width, height: 280 }} resizeMode="cover" />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />

          {/* Top buttons */}
          <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center justify-between px-5 pt-2">
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 rounded-full bg-white/95 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={22} color="#0F172A" />
              </Pressable>
              <View className="flex-row gap-2">
                <Pressable className="w-11 h-11 rounded-full bg-white/95 items-center justify-center">
                  <Ionicons name="share-outline" size={20} color="#0F172A" />
                </Pressable>
                <Pressable
                  onPress={() => id && toggleFavorite(id)}
                  className="w-11 h-11 rounded-full bg-white/95 items-center justify-center"
                >
                  <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color={favorite ? '#E11D48' : '#0F172A'} />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>

          {/* Tags row */}
          <View className="absolute bottom-4 left-5 flex-row gap-2">
            {tailor.tags.map((tag) => (
              <View key={tag} className="bg-white/95 px-3 py-1 rounded-full">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-slate-800">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card body overlapping cover */}
        <View className="bg-[#FAF7F2] -mt-6 rounded-t-3xl px-5 pt-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center">
                <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-2xl text-slate-900">
                  {tailor.name}
                </Text>
                {tailor.verified && (
                  <Ionicons name="checkmark-circle" size={18} color="#0F766E" style={{ marginLeft: 6 }} />
                )}
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-sm text-slate-500 mt-1">
                {tailor.specialty}
              </Text>
            </View>
            <View className="bg-amber-50 px-3 py-2 rounded-2xl items-center">
              <View className="flex-row items-center">
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-amber-900 ml-1">
                  {tailor.rating}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-amber-700 mt-0.5">
                {tailor.reviewCount} reviews
              </Text>
            </View>
          </View>

          {/* Quick info */}
          <View className="flex-row mt-4 gap-2">
            <View className="flex-1 bg-white rounded-2xl p-3 items-center">
              <Ionicons name="location" size={16} color="#0F766E" />
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-xs text-slate-900 mt-1.5">
                {tailor.distance} km
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-slate-500">
                {tailor.area}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-3 items-center">
              <Ionicons name="time" size={16} color="#0F766E" />
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-xs text-slate-900 mt-1.5">
                Open Now
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-slate-500" numberOfLines={1}>
                Until 10 PM
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-3 items-center">
              <Ionicons name="trophy" size={16} color="#0F766E" />
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-xs text-slate-900 mt-1.5">
                {tailor.yearsExperience} yrs
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-slate-500">
                Experience
              </Text>
            </View>
          </View>

          {/* About */}
          <View className="mt-5">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2">
              About
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-slate-600 leading-5">
              {tailor.description}
            </Text>
          </View>

          {/* Tabs */}
          <View className="mt-6 flex-row bg-white rounded-2xl p-1">
            {(['services', 'gallery', 'reviews'] as Tab[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                className={`flex-1 h-10 rounded-xl items-center justify-center ${tab === t ? 'bg-teal-700' : ''}`}
              >
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-xs capitalize ${tab === t ? 'text-white' : 'text-slate-600'}`}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab content */}
          <View className="mt-4">
            {tab === 'services' && (
              <View>
                {tailor.services.map((s) => (
                  <Pressable
                    key={s.id}
                    onPress={() => router.push(`/book/${tailor.id}?service=${encodeURIComponent(s.name)}&price=${s.price}`)}
                    className="bg-white rounded-2xl p-4 mb-2.5 flex-row items-center active:opacity-80"
                  >
                    <View className="w-11 h-11 rounded-xl bg-teal-50 items-center justify-center">
                      <Ionicons name="cut-outline" size={20} color="#0F766E" />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900">
                        {s.name}
                      </Text>
                      <View className="flex-row items-center mt-0.5">
                        <Ionicons name="time-outline" size={11} color="#64748B" />
                        <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-slate-500 ml-1">
                          {s.duration}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-base text-teal-700">
                        KD {s.price}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {tab === 'gallery' && (
              <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
                {tailor.gallery.map((g, i) => (
                  <View key={i} style={{ width: '50%', padding: 4 }}>
                    <Image source={{ uri: g }} className="w-full rounded-2xl" style={{ height: 160 }} resizeMode="cover" />
                  </View>
                ))}
              </View>
            )}

            {tab === 'reviews' && (
              <View>
                {tailor.reviews.map((r) => (
                  <View key={r.id} className="bg-white rounded-2xl p-4 mb-2.5">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="w-9 h-9 rounded-full bg-teal-100 items-center justify-center">
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-xs text-teal-700">
                            {r.user.charAt(0)}
                          </Text>
                        </View>
                        <View className="ml-2.5 flex-1">
                          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900">
                            {r.user}
                          </Text>
                          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-slate-500">
                            {r.date}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={11}
                            color={i <= r.rating ? '#F59E0B' : '#E2E8F0'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-slate-600 mt-2 leading-5">
                      {r.comment}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 pt-3 pb-8">
        <View className="flex-row items-center gap-3">
          <Pressable className="w-12 h-12 rounded-2xl border border-slate-200 items-center justify-center">
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0F172A" />
          </Pressable>
          <Pressable className="w-12 h-12 rounded-2xl border border-slate-200 items-center justify-center">
            <Ionicons name="call-outline" size={20} color="#0F172A" />
          </Pressable>
          <Pressable
            onPress={() => router.push(`/book/${tailor.id}`)}
            className="flex-1 h-12 rounded-2xl bg-teal-700 items-center justify-center flex-row active:bg-teal-800"
          >
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white text-sm">
              Book Appointment
            </Text>
            <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
