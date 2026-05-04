import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, fonts } from '../../src/lib/theme';
import { usePrefs } from '../../src/lib/userPrefs';

export default function NotificationsScreen() {
  const router = useRouter();
  const { prefs, update } = usePrefs();

  const groups: { title: string; items: { key: keyof typeof prefs; label: string; sub: string; icon: any }[] }[] = [
    {
      title: 'Push notifications',
      items: [
        { key: 'notifBookings', label: 'Booking updates', sub: 'Status changes, confirmations', icon: 'calendar-outline' },
        { key: 'notifMessages', label: 'New messages', sub: 'Replies from tailors', icon: 'chatbubbles-outline' },
        { key: 'notifReminders', label: 'Fitting reminders', sub: '2 hours before your appointment', icon: 'alarm-outline' },
        { key: 'notifPromos', label: 'Promotions & offers', sub: 'Seasonal deals from tailors', icon: 'pricetag-outline' },
      ],
    },
    {
      title: 'Other channels',
      items: [
        { key: 'emailUpdates', label: 'Email updates', sub: 'Receipts and weekly digest', icon: 'mail-outline' },
        { key: 'smsUpdates', label: 'SMS alerts', sub: 'Critical booking changes only', icon: 'phone-portrait-outline' },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center -ml-2" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View className="flex-1 ml-3">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text }}>Notifications</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
            Choose what you want to hear about
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {groups.map((g) => (
          <View key={g.title} className="mb-5">
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10, marginLeft: 4 }}>
              {g.title}
            </Text>
            <View className="rounded-2xl overflow-hidden" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
              {g.items.map((it, i) => (
                <View key={String(it.key)}>
                  <View className="flex-row items-center p-4">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
                      <Ionicons name={it.icon} size={18} color={theme.colors.primary} />
                    </View>
                    <View className="flex-1 ml-3 mr-2">
                      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{it.label}</Text>
                      <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>{it.sub}</Text>
                    </View>
                    <Switch
                      value={Boolean(prefs[it.key])}
                      onValueChange={(v) => update({ [it.key]: v } as any)}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor="white"
                    />
                  </View>
                  {i < g.items.length - 1 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginLeft: 64 }} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View className="rounded-2xl p-4 flex-row items-start" style={{ backgroundColor: theme.colors.accentSoft }}>
          <Ionicons name="information-circle" size={18} color={theme.colors.accent} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.text, marginLeft: 10, flex: 1, lineHeight: 17 }}>
            We never share your contact info. You can adjust these preferences any time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
