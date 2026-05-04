import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { incomingBookings, TailorBooking, TailorBookingStatus } from '../data/tailorBookings';

type StatusOverrides = Record<string, TailorBookingStatus>;

type Ctx = {
  bookings: TailorBooking[];
  ready: boolean;
  setStatus: (id: string, status: TailorBookingStatus) => void;
};

const TBCtx = createContext<Ctx | null>(null);
const KEY = 'khayyat.tailorBookings.v1';

export function TailorBookingsProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<StatusOverrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setOverrides(JSON.parse(raw));
      } catch {}
      setReady(true);
    })();
  }, []);

  const setStatus = (id: string, status: TailorBookingStatus) => {
    const next = { ...overrides, [id]: status };
    setOverrides(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  };

  const bookings = incomingBookings.map((b) => ({
    ...b,
    status: overrides[b.id] ?? b.status,
  }));

  return (
    <TBCtx.Provider value={{ bookings, ready, setStatus }}>{children}</TBCtx.Provider>
  );
}

export function useTailorBookings() {
  const ctx = useContext(TBCtx);
  if (!ctx) throw new Error('useTailorBookings must be used within TailorBookingsProvider');
  return ctx;
}
