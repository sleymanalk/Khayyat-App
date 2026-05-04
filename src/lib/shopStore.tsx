import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ShopService = {
  id: string;
  name: string;
  price: number;
  duration: string;
};

export type ShopProfile = {
  name: string;
  nameAr: string;
  specialty: string;
  area: string;
  description: string;
  phone: string;
  openingHours: string;
  startingPrice: number;
  homeVisit: boolean;
  delivery: boolean;
  acceptingOrders: boolean;
  businessType: 'tailor' | 'designer';
  onlineOnly: boolean;
  coverImage: string;
  services: ShopService[];
  gallery: string[];
  tags: string[];
};

const DEFAULT_SHOP: ShopProfile = {
  name: 'Noor Abaya House',
  nameAr: 'دار نور للعبايات',
  specialty: 'Designer Abayas',
  area: 'Hawally',
  description:
    'Contemporary abaya designs with traditional elegance. Custom embroidery and crystal work available.',
  phone: '+965 9999 5678',
  openingHours: '10:00 AM - 11:00 PM',
  startingPrice: 30,
  homeVisit: true,
  delivery: true,
  acceptingOrders: true,
  businessType: 'tailor',
  onlineOnly: false,
  coverImage:
    'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=800&q=80',
  services: [
    { id: 's1', name: 'Classic Abaya', price: 45, duration: '5 days' },
    { id: 's2', name: 'Designer Abaya', price: 95, duration: '10 days' },
    { id: 's3', name: 'Bridal Abaya', price: 250, duration: '21 days' },
    { id: 's4', name: 'Alterations', price: 10, duration: '3 days' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=600&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=600&q=80',
    'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
  ],
  tags: ['Designer', 'Embroidery', 'Bridal'],
};

type Ctx = {
  shop: ShopProfile;
  ready: boolean;
  update: (patch: Partial<ShopProfile>) => void;
  addService: (s: Omit<ShopService, 'id'>) => void;
  updateService: (id: string, patch: Partial<ShopService>) => void;
  removeService: (id: string) => void;
  addGalleryImage: (url: string) => void;
  removeGalleryImage: (url: string) => void;
  toggleTag: (tag: string) => void;
};

const ShopCtx = createContext<Ctx | null>(null);
const KEY = 'khayyat.shop.v1';

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [shop, setShop] = useState<ShopProfile>(DEFAULT_SHOP);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setShop({ ...DEFAULT_SHOP, ...JSON.parse(raw) });
      } catch {}
      setReady(true);
    })();
  }, []);

  const persist = (next: ShopProfile) => {
    setShop(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  };

  const update = (patch: Partial<ShopProfile>) => persist({ ...shop, ...patch });

  const addService = (s: Omit<ShopService, 'id'>) =>
    persist({
      ...shop,
      services: [...shop.services, { ...s, id: 's' + Date.now() }],
    });

  const updateService = (id: string, patch: Partial<ShopService>) =>
    persist({
      ...shop,
      services: shop.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)),
    });

  const removeService = (id: string) =>
    persist({ ...shop, services: shop.services.filter((sv) => sv.id !== id) });

  const addGalleryImage = (url: string) => {
    if (!url || shop.gallery.includes(url)) return;
    persist({ ...shop, gallery: [url, ...shop.gallery] });
  };

  const removeGalleryImage = (url: string) =>
    persist({ ...shop, gallery: shop.gallery.filter((g) => g !== url) });

  const toggleTag = (tag: string) => {
    const has = shop.tags.includes(tag);
    persist({
      ...shop,
      tags: has ? shop.tags.filter((t) => t !== tag) : [...shop.tags, tag],
    });
  };

  return (
    <ShopCtx.Provider
      value={{
        shop,
        ready,
        update,
        addService,
        updateService,
        removeService,
        addGalleryImage,
        removeGalleryImage,
        toggleTag,
      }}
    >
      {children}
    </ShopCtx.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
