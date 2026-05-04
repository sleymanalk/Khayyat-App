import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme, fonts } from '../../src/lib/theme';
import { useTailorBookings } from '../../src/lib/tailorBookingsStore';
import { TailorBookingStatus } from '../../src/data/tailorBookings';

const STATUS_META: Record<
  TailorBookingStatus,
  { label: string; bg: string; text: string; icon: any }
> = {
  pending: { label: 'New', bg: '#FEF3C7', text: '#92400E', icon: 'sparkles-outline' },
  confirmed: { label: 'Confirmed', bg: '#FBE9F1', text: '#7C2D5C', icon: 'checkmark-circle-outline' },
  in_progress: { label: 'Stitching', bg: '#FEF3C7', text: '#92400E', icon: 'cut-outline' },
  ready: { label: 'Ready', bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-done-outline' },
  delivered: { label: 'Delivered', bg: '#D1FAE5', text: '#065F46', icon: 'cube-outline' },
  declined: { label: 'Declined', bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle-outline' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle-outline' },
};

const TAB_FILTERS: Record<string, TailorBookingStatus[]> = {
  new: ['pending'],
  active: ['confirmed', 'in_progress', 'ready'],
  history: ['delivered', 'declined', 'cancelled'],
};

const NEXT_STATUS: Partial<Record<TailorBookingStatus, TailorBookingStatus>> = {
  confirmed: 'in_progress',
  in_progress: 'ready',
  ready: 'delivered',
};

const NEXT_LABEL: Partial<Record<TailorBookingStatus, string>> = {
  confirmed: 'Start stitching',
  in_progress: 'Mark ready',
  ready: 'Mark delivered',
};

export default function TailorBookings() {
  const { bookings, setStatus } = useTailorBookings();
  const [tab, setTab] = useState<'new' | 'active' | 'history'>('new');
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = {
    new: bookings.filter((b) => TAB_FILTERS.new.includes(b.status)).length,
    active: bookings.filter((b) => TAB_FILTERS.active.includes(b.status)).length,
    history: bookings.filter((b) => TAB_FILTERS.history.includes(b.status)).length,
  };

  const filtered = bookings
    .filter((b) => TAB_FILTERS[tab].includes(b.status))
    .sort((a, b) => (a.status === 'pending' ? -1 : 0));

  const accept = (id: string) => setStatus(id, 'confirmed');
  const decline = (id: string) =>
    Alert.alert('Decline booking?', 'The customer will be notified.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => setStatus(id, 'declined') },
    ]);
  const advance = (id: string, current: TailorBookingStatus) => {
    const next = NEXT_STATUS[current];
    if (next) setStatus(id, next);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 pb-4">
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>
          Bookings
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
          Manage incoming requests and orders
        </Text>
      </View>

      <View className="mx-5 rounded-2xl p-1 flex-row" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
        {(['new', 'active', 'history'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            className="flex-1 h-10 rounded-xl items-center justify-center flex-row"
            style={{ backgroundColor: tab === k ? theme.colors.primary : 'transparent' }}
          >
            <Text
              style={{
                fontFamily: fonts.semibold,
                fontSize: 11,
                color: tab === k ? 'white' : theme.colors.textMuted,
              }}
            >
              {k === 'new' ? 'New' : k === 'active' ? 'Active' : 'History'}
            </Text>
            {counts[k] > 0 && (
              <View
                className="ml-1.5 px-1.5 rounded-full"
                style={{
                  minWidth: 18,
                  height: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: tab === k ? 'rgba(255,255,255,0.3)' : theme.colors.primarySoft,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 10,
                    color: tab === k ? 'white' : theme.colors.primary,
                  }}
                >
                  {counts[k]}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <View className="items-center py-16">
            <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="calendar-outline" size={36} color={theme.colors.primary} />
            </View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 14 }}>
              No {tab} bookings
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 4, textAlign: 'center' }}>
              {tab === 'new'
                ? 'New customer requests will appear here'
                : tab === 'active'
                ? 'Confirmed orders in progress will appear here'
                : 'Delivered and declined orders'}
            </Text>
          </View>
        ) : (
          filtered.map((b) => {
            const meta = STATUS_META[b.status];
            const isOpen = expanded === b.id;
            return (
              <Pressable
                key={b.id}
                onPress={() => setExpanded(isOpen ? null : b.id)}
                className="rounded-3xl p-4 mb-3"
                style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
              >
                <View className="flex-row">
                  <Image source={{ uri: b.customerImage }} className="w-12 h-12 rounded-full" resizeMode="cover" />
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>
                        {b.customerName}
                      </Text>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.primary }}>
                        KD {b.servicePrice}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
                      {b.service}
                    </Text>
                    <View className="flex-row items-center mt-2 flex-wrap" style={{ gap: 6 }}>
                      <View className="px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: meta.bg }}>
                        <Ionicons name={meta.icon} size={10} color={meta.text} />
                        <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: meta.text, marginLeft: 4 }}>
                          {meta.label.toUpperCase()}
                        </Text>
                      </View>
                      <View className="px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: theme.colors.primarySoft }}>
                        <Ionicons
                          name={b.visitType === 'home_visit' ? 'home-outline' : 'storefront-outline'}
                          size={10}
                          color={theme.colors.primary}
                        />
                        <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: theme.colors.primary, marginLeft: 4 }}>
                          {b.visitType === 'home_visit' ? 'HOME VISIT' : 'IN-STORE'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                  <Ionicons name="calendar-outline" size={13} color={theme.colors.textMuted} />
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.text, marginLeft: 6 }}>
                    {b.date} · {b.time}
                  </Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginLeft: 'auto' }}>
                    {b.receivedAt}
                  </Text>
                </View>

                {isOpen && b.notes ? (
                  <View className="mt-3 p-3 rounded-2xl" style={{ backgroundColor: theme.colors.bg }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.textMuted, marginBottom: 4 }}>
                      Customer notes
                    </Text>
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.text, lineHeight: 18 }}>
                      {b.notes}
                    </Text>
                  </View>
                ) : null}

                {isOpen && b.area ? (
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="location-outline" size={13} color={theme.colors.textMuted} />
                    <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginLeft: 6 }}>
                      {b.area}, Kuwait
                    </Text>
                  </View>
                ) : null}

                {/* Actions */}
                {b.status === 'pending' ? (
                  <View className="flex-row mt-3" style={{ gap: 8 }}>
                    <Pressable
                      onPress={() => decline(b.id)}
                      className="flex-1 h-11 rounded-2xl items-center justify-center flex-row"
                      style={{ backgroundColor: theme.colors.bg }}
                    >
                      <Ionicons name="close" size={14} color={theme.colors.danger} />
                      <Text style={{ fontFamily: fonts.bold, color: theme.colors.danger, fontSize: 12, marginLeft: 6 }}>
                        Decline
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => accept(b.id)}
                      className="flex-1 h-11 rounded-2xl items-center justify-center flex-row"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <Ionicons name="checkmark" size={14} color="white" />
                      <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 12, marginLeft: 6 }}>
                        Accept
                      </Text>
                    </Pressable>
                  </View>
                ) : NEXT_STATUS[b.status] ? (
                  <Pressable
                    onPress={() => advance(b.id, b.status)}
                    className="mt-3 h-11 rounded-2xl items-center justify-center flex-row"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Ionicons name="arrow-forward" size={14} color="white" />
                    <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 12, marginLeft: 6 }}>
                      {NEXT_LABEL[b.status]}
                    </Text>
                  </Pressable>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
