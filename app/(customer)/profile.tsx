import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import { theme, fonts } from '../../src/lib/theme';
import { TermsModal } from '../../src/components/TermsModal';
import { useI18n } from '../../src/lib/i18n';
import { useRole } from '../../src/lib/role';
import { useSession } from '../../lib/auth-client';
import { usePrefs } from '../../src/lib/userPrefs';

export default function Profile() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const { setRole } = useRole();
  const { data: session } = useSession();
  const { prefs } = usePrefs();
  const [showTerms, setShowTerms] = useState(false);

  const bookings = useQuery(api.queries.getMyBookings, session ? {} : 'skip') ?? [];
  const conversations = useQuery(api.queries.listConversations, session ? {} : 'skip') ?? [];

  const activeOrders = bookings.filter((b: any) => ['pending', 'confirmed', 'in_progress', 'ready'].includes(b.status)).length;
  const completedOrders = bookings.filter((b: any) => ['delivered', 'completed'].includes(b.status)).length;
  const totalSpent = bookings
    .filter((b: any) => ['delivered', 'completed', 'in_progress', 'ready', 'confirmed'].includes(b.status))
    .reduce((s: number, b: any) => s + (b.total ?? 0), 0);

  const defaultAddr = prefs.addresses.find((a) => a.isDefault) ?? prefs.addresses[0];
  const notifOn = [prefs.notifBookings, prefs.notifMessages, prefs.notifPromos, prefs.notifReminders].filter(Boolean).length;

  const items: { icon: string; label: string; sub?: string; badge?: string; onPress?: () => void }[] = [
    { icon: 'heart-outline', label: 'Favorites', sub: `${prefs.favorites.length} tailor${prefs.favorites.length === 1 ? '' : 's'} saved`, onPress: () => router.push('/settings/favorites') },
    { icon: 'location-outline', label: 'Saved Addresses', sub: defaultAddr ? `${prefs.addresses.length} addresses · ${defaultAddr.label}` : 'Add your first address', onPress: () => router.push('/settings/addresses') },
    { icon: 'notifications-outline', label: 'Notifications', badge: `${notifOn}/4`, onPress: () => router.push('/settings/notifications') },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security', onPress: () => Alert.alert('Privacy', 'Your data is encrypted and never sold. Manage cookies and tracking in your device settings.') },
    { icon: 'document-text-outline', label: 'Terms of Use', sub: 'شروط الاستخدام والسياسات', onPress: () => setShowTerms(true) },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Support', 'Email us at help@khayyat.kw or call +965 1800 0000.') },
    { icon: 'information-circle-outline', label: 'About Khayyat', sub: 'v1.0.0 · Made in Kuwait', onPress: () => Alert.alert('Khayyat', 'Connecting Kuwait with master tailors since 2024.') },
  ];

  const userName = session?.user?.name ?? 'Sara Al-Sabah';
  const userEmail = session?.user?.email ?? 'sara.alsabah@email.com';

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl p-5 flex-row items-center" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' }}
            className="w-16 h-16 rounded-full"
          />
          <View className="flex-1 ml-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: theme.colors.text }} numberOfLines={1}>{userName}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }} numberOfLines={1}>
              {userEmail}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.colors.accentSoft }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: theme.colors.accent, letterSpacing: 0.4 }}>VIP MEMBER</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row mt-4" style={{ gap: 10 }}>
          <StatCard label="Active orders" value={String(activeOrders)} icon="cube-outline" color={theme.colors.primary} />
          <StatCard label="Completed" value={String(completedOrders)} icon="checkmark-done" color={theme.colors.success} />
          <StatCard label="Total spent" value={`KD ${totalSpent}`} icon="wallet-outline" color={theme.colors.accent} />
        </View>

        {/* Engagement card */}
        <View className="mt-4 rounded-2xl p-4" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <View className="flex-row items-center justify-between mb-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.text }}>Your activity</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: theme.colors.textMuted }}>Last 30 days</Text>
          </View>
          <ActivityRow icon="chatbubbles-outline" label="Conversations" value={String(conversations.length)} />
          <ActivityRow icon="heart-outline" label="Favorites" value={String(prefs.favorites.length)} />
          <ActivityRow icon="location-outline" label="Saved addresses" value={String(prefs.addresses.length)} last />
        </View>

        <Pressable
          onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="flex-row items-center justify-between mt-4 p-4 rounded-2xl"
          style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: theme.colors.text, marginLeft: 12 }}>
              Language
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.primary }}>
            {lang === 'en' ? 'English' : 'العربية'}
          </Text>
        </Pressable>

        <View className="mt-4 rounded-2xl overflow-hidden" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          {items.map((it, i) => (
            <View key={it.label}>
              <Pressable onPress={it.onPress} className="flex-row items-center p-4 active:opacity-70">
                <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
                  <Ionicons name={it.icon as any} size={20} color={theme.colors.primary} />
                </View>
                <View className="flex-1 ml-3">
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: theme.colors.text }}>{it.label}</Text>
                  {it.sub ? (
                    <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }} numberOfLines={1}>{it.sub}</Text>
                  ) : null}
                </View>
                {it.badge ? (
                  <View className="px-2.5 py-1 rounded-full mr-2" style={{ backgroundColor: theme.colors.primarySoft }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: theme.colors.primary }}>{it.badge}</Text>
                  </View>
                ) : null}
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              </Pressable>
              {i < items.length - 1 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginLeft: 64 }} />}
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => { setRole(null); router.replace('/'); }}
          className="mt-5 h-12 rounded-2xl items-center justify-center flex-row"
          style={{ backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }}
        >
          <Ionicons name="swap-horizontal" size={16} color={theme.colors.primary} />
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.colors.primary, marginLeft: 8 }}>
            Switch role
          </Text>
        </Pressable>
      </ScrollView>

      <TermsModal
        visible={showTerms}
        mode="view"
        onClose={() => setShowTerms(false)}
      />
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <View className="flex-1 rounded-2xl p-3" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
      <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: color + '15' }}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 17, color: theme.colors.text, marginTop: 8 }} numberOfLines={1}>
        {value}
      </Text>
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: theme.colors.textMuted, marginTop: 1 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function ActivityRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View className="flex-row items-center py-2.5" style={{ borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.colors.border }}>
      <Ionicons name={icon} size={15} color={theme.colors.textMuted} />
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.text, marginLeft: 10, flex: 1 }}>{label}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.primary }}>{value}</Text>
    </View>
  );
}
