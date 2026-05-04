import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fonts } from '../../src/lib/theme';
import { useShop } from '../../src/lib/shopStore';
import { useTailorBookings } from '../../src/lib/tailorBookingsStore';

const WEEKLY_VIEWS = [120, 165, 142, 198, 220, 285, 312];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ShopAnalytics() {
  const router = useRouter();
  const { shop } = useShop();
  const { bookings } = useTailorBookings();
  const max = Math.max(...WEEKLY_VIEWS);
  const totalViews = WEEKLY_VIEWS.reduce((a, b) => a + b, 0);

  const accepted = bookings.filter((b) => b.status !== 'pending' && b.status !== 'declined').length;
  const conversion = Math.round((accepted / Math.max(1, bookings.length)) * 100);
  const revenue = bookings
    .filter((b) => ['delivered', 'in_progress', 'ready', 'confirmed'].includes(b.status))
    .reduce((sum, b) => sum + b.servicePrice, 0);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center -ml-2" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View className="flex-1 ml-3">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text }}>Analytics</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
            Last 7 days
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {/* Big stat */}
        <View className="rounded-3xl p-5" style={[{ backgroundColor: theme.colors.primary }, theme.shadow.soft]}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
            Profile Views
          </Text>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 28, color: 'white', marginTop: 4 }}>
            {totalViews.toLocaleString()}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="trending-up" size={14} color="white" />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: 'white', marginLeft: 4 }}>
              +18% vs last week
            </Text>
          </View>

          {/* Bar chart */}
          <View className="flex-row items-end justify-between mt-5" style={{ height: 80 }}>
            {WEEKLY_VIEWS.map((v, i) => (
              <View key={i} className="items-center" style={{ flex: 1 }}>
                <View
                  style={{
                    width: 18,
                    height: (v / max) * 70,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                  }}
                />
                <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
                  {DAYS[i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stat grid */}
        <View className="flex-row flex-wrap mt-4" style={{ marginHorizontal: -6 }}>
          <Stat label="Bookings" value={String(bookings.length)} icon="calendar-outline" color={theme.colors.accent} />
          <Stat label="Acceptance" value={`${conversion}%`} icon="checkmark-done-outline" color={theme.colors.success} />
          <Stat label="Revenue" value={`KD ${revenue}`} icon="wallet-outline" color={theme.colors.primary} />
          <Stat label="Rating" value="4.9" icon="star" color={theme.colors.warn} />
        </View>

        {/* Top services */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 24, marginBottom: 12 }}>
          Top services
        </Text>
        <View className="rounded-2xl p-2" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          {shop.services.slice(0, 4).map((s, i) => {
            const pct = [85, 62, 48, 30][i] ?? 20;
            return (
              <View key={s.id} className="p-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.colors.text }} numberOfLines={1}>
                    {s.name}
                  </Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.primary }}>
                    KD {s.price}
                  </Text>
                </View>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.colors.bg, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${pct}%`, backgroundColor: theme.colors.primary }} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Insights */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 24, marginBottom: 12 }}>
          Insights
        </Text>
        <Insight icon="trending-up" color={theme.colors.success} title="Saturday is your best day" sub="33% more views than weekday average" />
        <Insight icon="people-outline" color={theme.colors.primary} title="Most viewed by Salmiya customers" sub="42% of profile visits this week" />
        <Insight icon="time-outline" color={theme.colors.accent} title="Peak hours: 7–10 PM" sub="Stay online to capture more leads" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <View style={{ width: '50%', padding: 6 }}>
      <View className="rounded-2xl p-4" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
        <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: color + '15' }}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text, marginTop: 10 }}>
          {value}
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

function Insight({ icon, color, title, sub }: { icon: any; color: string; title: string; sub: string }) {
  return (
    <View className="rounded-2xl p-4 mb-3 flex-row items-center" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: color + '15' }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View className="flex-1 ml-3">
        <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text }}>{title}</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
          {sub}
        </Text>
      </View>
    </View>
  );
}
