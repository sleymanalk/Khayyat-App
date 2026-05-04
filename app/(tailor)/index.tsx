import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { theme, fonts } from '../../src/lib/theme';
import { useShop } from '../../src/lib/shopStore';

export default function TailorDashboard() {
  const router = useRouter();
  const { shop } = useShop();
  const myShop = useQuery(api.queries.getMyShop, {});

  const stats = [
    { label: 'Profile Views', value: '2,483', icon: 'eye-outline', color: theme.colors.primary, trend: '+12%' },
    { label: 'New Bookings', value: '12', icon: 'calendar-outline', color: theme.colors.accent, trend: '+3' },
    { label: 'Messages', value: '8', icon: 'chatbubbles-outline', color: theme.colors.success, trend: '5 unread' },
    { label: 'Avg. Rating', value: '4.9', icon: 'star', color: theme.colors.warn, trend: '★★★★★' },
  ];

  const completion = (() => {
    let score = 0;
    if (shop.name) score += 15;
    if (shop.description.length > 30) score += 15;
    if (shop.gallery.length >= 4) score += 25;
    if (shop.services.length >= 2) score += 25;
    if (shop.tags.length >= 2) score += 10;
    if (shop.phone) score += 10;
    return Math.min(100, score);
  })();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 32, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl overflow-hidden" style={theme.shadow.soft}>
            <Image source={{ uri: shop.coverImage }} className="w-full h-full" resizeMode="cover" />
          </View>
          <View className="flex-1 ml-3">
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted }}>
              Welcome back
            </Text>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, color: theme.colors.text }} numberOfLines={1}>
              {shop.name}
            </Text>
          </View>
          <View
            className="px-2.5 py-1 rounded-full"
            style={{ backgroundColor: shop.acceptingOrders ? theme.colors.success + '20' : theme.colors.danger + '20' }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: shop.acceptingOrders ? theme.colors.success : theme.colors.danger }}>
              {shop.acceptingOrders ? 'OPEN' : 'PAUSED'}
            </Text>
          </View>
        </View>

        {/* Profile completion */}
        {completion < 100 && (
          <Pressable
            onPress={() => router.push('/(tailor)/profile')}
            className="mt-5 rounded-2xl p-4"
            style={[{ backgroundColor: theme.colors.primarySoft }, theme.shadow.soft]}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.primary }}>
                Profile {completion}% complete
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${completion}%`, backgroundColor: theme.colors.primary }} />
            </View>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.primaryDark, marginTop: 6 }}>
              Complete your profile to attract more bookings
            </Text>
          </Pressable>
        )}

        {/* Stats */}
        <View className="flex-row flex-wrap mt-5" style={{ marginHorizontal: -6 }}>
          {stats.map((s) => (
            <View key={s.label} style={{ width: '50%', padding: 6 }}>
              <View className="rounded-2xl p-4" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
                <View className="flex-row items-center justify-between">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: s.color + '15' }}
                  >
                    <Ionicons name={s.icon as any} size={20} color={s.color} />
                  </View>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: s.color }}>{s.trend}</Text>
                </View>
                <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: theme.colors.text, marginTop: 10 }}>
                  {s.value}
                </Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
                  {s.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Featured CTA */}
        <Pressable
          onPress={() => router.push('/shop/featured')}
          className="mt-5 rounded-2xl p-4 flex-row items-center"
          style={[{ backgroundColor: myShop?.isFeatured ? theme.colors.success : theme.colors.primary }, theme.shadow.soft]}
        >
          <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name="star" size={20} color="white" />
          </View>
          <View className="flex-1 ml-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: 'white' }}>
              {myShop?.isFeatured ? 'You are Featured ★' : 'Become a Featured Shop'}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: 'white', opacity: 0.9, marginTop: 2 }}>
              {myShop?.isFeatured ? 'Top placement on home page' : 'Top placement · 5× more bookings'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>

        {/* Quick actions */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 24, marginBottom: 12 }}>
          Quick actions
        </Text>
        <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
          <QuickAction
            icon="pricetags-outline"
            label="Edit services"
            sub={`${shop.services.length} live`}
            onPress={() => router.push('/shop/edit-services')}
          />
          <QuickAction
            icon="images-outline"
            label="Portfolio"
            sub={`${shop.gallery.length} photos`}
            onPress={() => router.push('/(tailor)/portfolio')}
          />
          <QuickAction
            icon="calendar-outline"
            label="Bookings"
            sub="View requests"
            onPress={() => router.push('/(tailor)/bookings')}
          />
          <QuickAction
            icon="analytics-outline"
            label="Analytics"
            sub="Views & revenue"
            onPress={() => router.push('/shop/analytics')}
          />
        </View>

        {/* Today */}
        <View className="rounded-2xl p-5 mt-6" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>Today</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted }}>
              {shop.openingHours}
            </Text>
          </View>
          <View className="mt-4 flex-row items-center">
            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
            </View>
            <View className="ml-3 flex-1">
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text }}>
                3 fittings scheduled
              </Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>
                Next at 4:30 PM · Designer Abaya
              </Text>
            </View>
          </View>
          <View className="mt-3 flex-row items-center">
            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.accentSoft }}>
              <Ionicons name="cube-outline" size={18} color={theme.colors.accent} />
            </View>
            <View className="ml-3 flex-1">
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text }}>
                2 deliveries to dispatch
              </Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>
                Salmiya · Hawally
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: any;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <View style={{ width: '50%', padding: 6 }}>
      <Pressable
        onPress={onPress}
        className="rounded-2xl p-4"
        style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
      >
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
          <Ionicons name={icon} size={18} color={theme.colors.primary} />
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text, marginTop: 10 }}>
          {label}
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
          {sub}
        </Text>
      </Pressable>
    </View>
  );
}
