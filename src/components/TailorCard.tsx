import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Tailor } from '../data/tailors';

export function TailorCard({ tailor }: { tailor: Tailor }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/tailor/${tailor.id}`)}
      className="bg-white rounded-3xl mb-4 overflow-hidden active:opacity-90"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: tailor.coverImage }}
          className="w-full h-44"
          resizeMode="cover"
        />
      </View>
      <View className="p-4">
        {/* Top row: name + verified on left, price on right */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className="text-base text-slate-900 flex-shrink"
                numberOfLines={1}
              >
                {tailor.name}
              </Text>
              {tailor.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#0F766E"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text
              style={{ fontFamily: 'Inter_500Medium' }}
              className="text-xs text-slate-500 mt-0.5"
              numberOfLines={1}
            >
              {tailor.specialty}
            </Text>
          </View>
          <View className="items-end" style={{ minWidth: 70 }}>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[10px] text-slate-400">
              from
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-teal-700">
              KD {tailor.startingPrice}
            </Text>
          </View>
        </View>

        {/* Meta row: rating + location + distance + reviews */}
        <View className="flex-row items-center mt-3 flex-wrap" style={{ gap: 8 }}>
          <View
            className="flex-row items-center px-2 py-1 rounded-full"
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text
              style={{ fontFamily: 'Inter_700Bold' }}
              className="text-[11px] text-amber-900 ml-1"
            >
              {tailor.rating}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={13} color="#64748B" />
            <Text
              style={{ fontFamily: 'Inter_500Medium' }}
              className="text-xs text-slate-600 ml-1"
            >
              {tailor.area}
            </Text>
          </View>
          <View className="w-1 h-1 rounded-full bg-slate-300" />
          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-600">
            {tailor.distance} km
          </Text>
          <View className="w-1 h-1 rounded-full bg-slate-300" />
          <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-600">
            {tailor.reviewCount} reviews
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
