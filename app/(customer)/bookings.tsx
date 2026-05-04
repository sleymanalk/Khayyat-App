import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { bookings, type Booking } from '../../src/data/tailors';
import { theme, fonts } from '../../src/lib/theme';

const STATUS_META: Record<Booking['status'], { label: string; bg: string; text: string; icon: any }> = {
  pending: { label: 'Pending', bg: '#FEF3C7', text: '#92400E', icon: 'hourglass-outline' },
  upcoming: { label: 'Upcoming', bg: '#FBE9F1', text: '#7C2D5C', icon: 'time-outline' },
  in_progress: { label: 'In Progress', bg: '#FEF3C7', text: '#92400E', icon: 'cut-outline' },
  ready: { label: 'Ready', bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-done-outline' },
  delivered: { label: 'Delivered', bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-circle' },
  completed: { label: 'Completed', bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-circle' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle' },
};

export default function Bookings() {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'past'>('active');
  const active = bookings.filter((b) => ['upcoming', 'in_progress', 'pending', 'ready'].includes(b.status));
  const past = bookings.filter((b) => ['completed', 'delivered', 'cancelled'].includes(b.status));
  const list = tab === 'active' ? active : past;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pb-4" style={{ paddingTop: 16 }}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>My Bookings</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
          Track your fittings and orders
        </Text>
      </View>

      <View className="mx-5 rounded-2xl p-1 flex-row" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
        {(['active', 'past'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            className="flex-1 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: tab === k ? theme.colors.primary : 'transparent' }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: tab === k ? 'white' : theme.colors.textMuted }}>
              {k === 'active' ? `Active (${active.length})` : `Past (${past.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
        {list.length === 0 ? (
          <View className="items-center py-16">
            <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="calendar-outline" size={36} color={theme.colors.primary} />
            </View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 14 }}>
              No {tab} bookings
            </Text>
            <Pressable
              onPress={() => router.push('/(customer)/explore')}
              className="mt-5 px-6 py-3 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: 'white' }}>Find a Tailor</Text>
            </Pressable>
          </View>
        ) : list.map((b) => {
          const meta = STATUS_META[b.status];
          return (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/tailor/${b.tailorId}`)}
              className="rounded-3xl p-4 mb-3"
              style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
            >
              <View className="flex-row">
                <Image source={{ uri: b.image }} className="w-20 h-20 rounded-2xl" resizeMode="cover" />
                <View className="flex-1 ml-3">
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>
                    {b.tailorName}
                  </Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                    {b.service}
                  </Text>
                  <View className="self-start mt-2 px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: meta.bg }}>
                    <Ionicons name={meta.icon} size={11} color={meta.text} />
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: meta.text, marginLeft: 4 }}>
                      {meta.label}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.primary }}>
                  KD {b.price}
                </Text>
              </View>
              <View className="flex-row items-center justify-between pt-3 mt-3" style={{ borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={13} color={theme.colors.textMuted} />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginLeft: 6 }}>
                    {b.date} · {b.time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name={b.visitType === 'home_visit' ? 'home-outline' : 'storefront-outline'} size={13} color={theme.colors.primary} />
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.primary, marginLeft: 4 }}>
                    {b.visitType === 'home_visit' ? 'Home Visit' : 'In-Store'}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
