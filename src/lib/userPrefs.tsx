import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
  id: string;
  label: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  notes?: string;
  isDefault: boolean;
};

export type Prefs = {
  notifBookings: boolean;
  notifMessages: boolean;
  notifPromos: boolean;
  notifReminders: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  defaultPayment: 'knet' | 'cash' | 'card';
  addresses: Address[];
  favorites: string[];
  savedDesigns: { id: string; uri: string; addedAt: number }[];
  termsAcceptedAt: number | null;
};

const DEFAULT_PREFS: Prefs = {
  notifBookings: true,
  notifMessages: true,
  notifPromos: false,
  notifReminders: true,
  emailUpdates: true,
  smsUpdates: false,
  defaultPayment: 'knet',
  addresses: [
    {
      id: 'a1',
      label: 'Home',
      area: 'Salmiya',
      block: '10',
      street: 'Salem Al-Mubarak St',
      building: '24',
      floor: 'Apt 5',
      notes: 'Ring twice',
      isDefault: true,
    },
    {
      id: 'a2',
      label: 'Office',
      area: 'Sharq',
      block: '4',
      street: 'Arabian Gulf St',
      building: 'Al Hamra Tower',
      floor: 'Floor 22',
      isDefault: false,
    },
  ],
  favorites: [],
  savedDesigns: [],
  termsAcceptedAt: null,
};

const KEY = 'khayyat:prefs:v1';

type Ctx = {
  prefs: Prefs;
  ready: boolean;
  update: (p: Partial<Prefs>) => void;
  toggleFavorite: (id: string) => void;
  addAddress: (a: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, a: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  acceptTerms: () => void;
  reset: () => void;
};

const PrefsCtx = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
      } catch {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(prefs)).catch(() => {});
  }, [prefs, ready]);

  const update = (p: Partial<Prefs>) => setPrefs((cur) => ({ ...cur, ...p }));

  const toggleFavorite = (id: string) =>
    setPrefs((cur) => ({
      ...cur,
      favorites: cur.favorites.includes(id)
        ? cur.favorites.filter((x) => x !== id)
        : [...cur.favorites, id],
    }));

  const addAddress = (a: Omit<Address, 'id'>) =>
    setPrefs((cur) => {
      const id = `a${Date.now()}`;
      const newAddr: Address = { ...a, id };
      let list = [...cur.addresses, newAddr];
      if (a.isDefault) list = list.map((x) => ({ ...x, isDefault: x.id === id }));
      else if (list.length === 1) list = [{ ...newAddr, isDefault: true }];
      return { ...cur, addresses: list };
    });

  const updateAddress = (id: string, a: Partial<Address>) =>
    setPrefs((cur) => ({
      ...cur,
      addresses: cur.addresses.map((x) => (x.id === id ? { ...x, ...a } : x)),
    }));

  const removeAddress = (id: string) =>
    setPrefs((cur) => {
      const remaining = cur.addresses.filter((x) => x.id !== id);
      const removed = cur.addresses.find((x) => x.id === id);
      if (removed?.isDefault && remaining.length > 0) remaining[0].isDefault = true;
      return { ...cur, addresses: remaining };
    });

  const setDefaultAddress = (id: string) =>
    setPrefs((cur) => ({
      ...cur,
      addresses: cur.addresses.map((x) => ({ ...x, isDefault: x.id === id })),
    }));

  const acceptTerms = () =>
    setPrefs((cur) => ({ ...cur, termsAcceptedAt: Date.now() }));

  const reset = () => setPrefs(DEFAULT_PREFS);

  return (
    <PrefsCtx.Provider
      value={{
        prefs,
        ready,
        update,
        toggleFavorite,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        acceptTerms,
        reset,
      }}
    >
      {children}
    </PrefsCtx.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsCtx);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
