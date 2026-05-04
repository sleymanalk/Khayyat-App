import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../../lib/auth-client';
import { tailors } from '../../src/data/tailors';

const TIME_SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM', '8:30 PM'];

function getNextDays(count: number) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.getDate(),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      iso: d.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function BookScreen() {
  const { id, service: preselectedService } = useLocalSearchParams<{
    id: string;
    service?: string;
    price?: string;
  }>();
  const router = useRouter();
  const { data: session } = useSession();
  const createBooking = useMutation(api.mutations.createBooking);
  const tailor = tailors.find((t) => t.id === id);
  const days = getNextDays(14);

  const [serviceId, setServiceId] = useState(
    tailor?.services.find((s) => s.name === preselectedService)?.id ?? tailor?.services[0]?.id ?? ''
  );
  const [visitType, setVisitType] = useState<'in_store' | 'home_visit'>('in_store');
  const [selectedDay, setSelectedDay] = useState(days[1]?.iso);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!tailor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Tailor not found</Text>
      </SafeAreaView>
    );
  }

  const selectedService = tailor.services.find((s) => s.id === serviceId) ?? tailor.services[0];
  const visitFee = visitType === 'home_visit' ? 5 : 2;
  const total = selectedService.price + visitFee;

  const confirm = async () => {
    if (!selectedTime) {
      Alert.alert('Pick a time', 'Please select an appointment time to continue.');
      return;
    }
    if (!session) {
      Alert.alert('Sign in required', 'Please sign in to confirm your booking.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.replace('/') },
      ]);
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        tailorId: tailor.id,
        tailorName: tailor.name,
        tailorArea: tailor.area,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        visitType,
        date: selectedDay!,
        time: selectedTime,
        notes: notes || undefined,
        status: 'pending',
        total,
        createdAt: Date.now(),
      });
      Alert.alert(
        'Booking Confirmed',
        `Your appointment with ${tailor.name} is set for ${selectedTime} on ${selectedDay}.`,
        [{ text: 'View Bookings', onPress: () => router.replace('/(customer)/bookings') }]
      );
    } catch (e: any) {
      Alert.alert('Booking failed', e?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FAF7F2' }}>
      <SafeAreaView edges={['top']} className="bg-white">
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name="close" size={24} color="#0F172A" />
          </Pressable>
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900">
            Book Appointment
          </Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Tailor summary */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-teal-50 items-center justify-center">
            <Ionicons name="cut" size={20} color="#0F766E" />
          </View>
          <View className="ml-3 flex-1">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900">
              {tailor.name}
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-500 mt-0.5">
              {tailor.area} · {tailor.distance} km away
            </Text>
          </View>
        </View>

        {/* Visit type */}
        <View className="px-5 mt-5">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2.5">
            Visit Type
          </Text>
          <View className="flex-row gap-2">
            {([
              { k: 'in_store', label: 'In-Store', icon: 'storefront-outline' as const, fee: 'KD 2' },
              { k: 'home_visit', label: 'Home Visit', icon: 'home-outline' as const, fee: 'KD 5' },
            ] as const).map((opt) => (
              <Pressable
                key={opt.k}
                onPress={() => setVisitType(opt.k)}
                className={`flex-1 rounded-2xl p-4 border-2 ${
                  visitType === opt.k ? 'border-teal-700 bg-teal-50' : 'border-transparent bg-white'
                }`}
              >
                <Ionicons name={opt.icon} size={22} color={visitType === opt.k ? '#0F766E' : '#64748B'} />
                <Text style={{ fontFamily: 'Inter_700Bold' }} className={`text-sm mt-2 ${visitType === opt.k ? 'text-teal-800' : 'text-slate-900'}`}>
                  {opt.label}
                </Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[11px] text-slate-500 mt-0.5">
                  Visit fee: {opt.fee}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Service */}
        <View className="px-5 mt-5">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2.5">
            Select Service
          </Text>
          {tailor.services.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setServiceId(s.id)}
              className={`bg-white rounded-2xl p-4 mb-2 flex-row items-center border-2 ${
                serviceId === s.id ? 'border-teal-700' : 'border-transparent'
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  serviceId === s.id ? 'border-teal-700 bg-teal-700' : 'border-slate-300'
                }`}
              >
                {serviceId === s.id && <View className="w-2 h-2 rounded-full bg-white" />}
              </View>
              <View className="flex-1 ml-3">
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900">
                  {s.name}
                </Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-500 mt-0.5">
                  Ready in {s.duration}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-teal-700">
                KD {s.price}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Date */}
        <View className="mt-5">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2.5 px-5">
            Select Date
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {days.map((d) => (
              <Pressable
                key={d.iso}
                onPress={() => setSelectedDay(d.iso)}
                className={`w-16 py-3 rounded-2xl items-center ${selectedDay === d.iso ? 'bg-teal-700' : 'bg-white'}`}
              >
                <Text style={{ fontFamily: 'Inter_500Medium' }} className={`text-[10px] ${selectedDay === d.iso ? 'text-teal-100' : 'text-slate-500'}`}>
                  {d.day.toUpperCase()}
                </Text>
                <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className={`text-xl mt-1 ${selectedDay === d.iso ? 'text-white' : 'text-slate-900'}`}>
                  {d.date}
                </Text>
                <Text style={{ fontFamily: 'Inter_500Medium' }} className={`text-[10px] mt-0.5 ${selectedDay === d.iso ? 'text-teal-100' : 'text-slate-500'}`}>
                  {d.month}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time */}
        <View className="px-5 mt-5">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2.5">
            Select Time
          </Text>
          <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
            {TIME_SLOTS.map((t) => (
              <View key={t} style={{ width: '25%', padding: 4 }}>
                <Pressable
                  onPress={() => setSelectedTime(t)}
                  className={`h-10 rounded-xl items-center justify-center ${
                    selectedTime === t ? 'bg-teal-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[11px] ${selectedTime === t ? 'text-white' : 'text-slate-700'}`}>
                    {t}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View className="px-5 mt-5">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-base text-slate-900 mb-2.5">
            Notes (optional)
          </Text>
          <View className="bg-white rounded-2xl p-3">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add measurements, fabric preferences, etc."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={{ fontFamily: 'Inter_500Medium', fontSize: 13, minHeight: 60, textAlignVertical: 'top' }}
              className="text-slate-900"
            />
          </View>
        </View>

        {/* Summary */}
        <View className="mx-5 mt-5 bg-white rounded-2xl p-4">
          <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900 mb-3">
            Price Summary
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-500">
              {selectedService.name}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-xs text-slate-900">
              KD {selectedService.price.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-xs text-slate-500">
              {visitType === 'home_visit' ? 'Home visit fee' : 'In-store fee'}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-xs text-slate-900">
              KD {visitFee.toFixed(2)}
            </Text>
          </View>
          <View className="border-t border-slate-100 mt-2 pt-3 flex-row justify-between items-center">
            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-slate-900">
              Total
            </Text>
            <Text style={{ fontFamily: 'Inter_800ExtraBold' }} className="text-lg text-teal-700">
              KD {total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 pt-3 pb-8">
        <Pressable
          onPress={confirm}
          disabled={submitting}
          className="h-12 rounded-2xl bg-teal-700 items-center justify-center flex-row active:bg-teal-800"
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white text-sm">
                Confirm Booking · KD {total.toFixed(2)}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 6 }} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
