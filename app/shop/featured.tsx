import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { theme, fonts } from '../../src/lib/theme';

const PLANS = [
  { id: 'monthly', days: 30, price: 15, label: 'Monthly Featured', badge: 'Popular' },
  { id: 'quarterly', days: 90, price: 40, label: '3 Months Featured', badge: 'Save 11%' },
  { id: 'yearly', days: 365, price: 120, label: '1 Year Featured', badge: 'Best value' },
];

export default function FeaturedUpgrade() {
  const router = useRouter();
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const myShop = useQuery(api.queries.getMyShop, {});
  const upgrade = useMutation(api.mutations.upgradeShopToFeatured);
  const cancel = useMutation(api.mutations.cancelFeatured);

  const handleUpgrade = async () => {
    if (!myShop) {
      Alert.alert('Set up your shop first', 'Save your shop profile before upgrading to Featured.');
      return;
    }
    const plan = PLANS.find((p) => p.id === selected)!;
    setLoading(true);
    try {
      await upgrade({ days: plan.days });
      Alert.alert('Welcome to Featured ✨', `Your shop is now featured for ${plan.days} days. Customers will see you at the top of the home page.`, [
        { text: 'Done', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Upgrade failed', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert('Cancel Featured?', 'Your shop will return to the regular list.', [
      { text: 'Keep featured', style: 'cancel' },
      {
        text: 'Cancel featured', style: 'destructive', onPress: async () => {
          await cancel({});
          Alert.alert('Cancelled', 'You are no longer featured.');
        },
      },
    ]);
  };

  const isFeatured = myShop?.isFeatured;
  const featuredUntil = myShop?.featuredUntil ? new Date(myShop.featuredUntil).toLocaleDateString() : null;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top', 'bottom']}>
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="close" size={20} color={theme.colors.text} />
        </Pressable>
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>Featured Upgrade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl p-6 items-center" style={{ backgroundColor: theme.colors.primary }}>
          <View className="w-16 h-16 rounded-3xl items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name="star" size={28} color="white" />
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: 'white', marginTop: 12, textAlign: 'center' }}>
            Stand out at the top
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: 'white', opacity: 0.9, marginTop: 6, textAlign: 'center' }}>
            Featured shops appear first on the home page and get up to 5× more bookings.
          </Text>
        </View>

        {isFeatured ? (
          <View className="rounded-2xl p-5 mt-5" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.success + '20' }}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              </View>
              <View className="flex-1 ml-3">
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>You are featured</Text>
                {featuredUntil && (
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>
                    Until {featuredUntil}
                  </Text>
                )}
              </View>
            </View>
            <Pressable onPress={handleCancel} className="mt-4 h-11 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.danger + '15' }}>
              <Text style={{ fontFamily: fonts.bold, color: theme.colors.danger, fontSize: 13 }}>Cancel featured</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 24, marginBottom: 12 }}>Choose a plan</Text>

        {PLANS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setSelected(p.id)}
            className="rounded-2xl p-4 flex-row items-center mb-3"
            style={[
              { backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: selected === p.id ? theme.colors.primary : 'transparent' },
              theme.shadow.soft,
            ]}
          >
            <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="star" size={20} color={theme.colors.primary} />
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row items-center">
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{p.label}</Text>
                {p.badge && (
                  <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.colors.accentSoft }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: theme.colors.accent }}>{p.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
                {p.days} days · top of home page
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 16, color: theme.colors.primary }}>KD {p.price}</Text>
          </Pressable>
        ))}

        <View className="rounded-2xl p-4 mt-2" style={{ backgroundColor: theme.colors.primarySoft }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.primaryDark, marginBottom: 8 }}>Featured benefits</Text>
          {['Top placement on home page', 'Featured badge on your shop card', 'Priority in search results', 'Up to 5× more profile views'].map((b) => (
            <View key={b} className="flex-row items-center mb-1.5">
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.text, marginLeft: 8 }}>{b}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleUpgrade}
          disabled={loading}
          className="h-14 rounded-2xl items-center justify-center mt-6"
          style={{ backgroundColor: theme.colors.primary, opacity: loading ? 0.6 : 1 }}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 15 }}>
                {isFeatured ? 'Extend featured' : 'Activate featured'}
              </Text>}
        </Pressable>

        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 12, textAlign: 'center' }}>
          Demo upgrade · payment integration available on request
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
