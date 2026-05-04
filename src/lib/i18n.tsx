import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'ar';

const dict = {
  en: {
    appName: 'Khayyat',
    tagline: 'Bespoke tailoring at your fingertips',
    chooseRole: 'How will you use Khayyat?',
    roleCustomer: 'I\'m a Customer',
    roleCustomerDesc: 'Find tailors, book fittings, request custom designs',
    roleTailor: 'I\'m a Tailor / Designer',
    roleTailorDesc: 'Showcase work, chat with customers, accept orders & track status',
    continue: 'Continue',
    home: 'Home',
    explore: 'Explore',
    bookings: 'Bookings',
    chats: 'Messages',
    profile: 'Profile',
    dashboard: 'Dashboard',
    portfolio: 'Portfolio',
    inbox: 'Inbox',
    search: 'Search tailors, services...',
    marhaba: 'Marhaba',
    seeAll: 'See all',
    categories: 'Categories',
    featured: 'Featured Tailors',
    nearYou: 'Near You',
    recentWork: 'Recent Work',
  },
  ar: {
    appName: 'خياط',
    tagline: 'خياطة فاخرة بين يديكِ',
    chooseRole: 'كيف ستستخدمين تطبيق خياط؟',
    roleCustomer: 'أنا عميلة',
    roleCustomerDesc: 'ابحثي عن خياطين، احجزي قياسات، اطلبي تصاميم خاصة',
    roleTailor: 'أنا خياطة / مصممة',
    roleTailorDesc: 'اعرضي أعمالكِ، تواصلي مع العملاء، اقبلي الطلبات وتابعي حالتها',
    continue: 'متابعة',
    home: 'الرئيسية',
    explore: 'استكشاف',
    bookings: 'الحجوزات',
    chats: 'الرسائل',
    profile: 'الملف',
    dashboard: 'لوحة التحكم',
    portfolio: 'الأعمال',
    inbox: 'الرسائل',
    search: 'ابحثي عن خياطين، خدمات...',
    marhaba: 'مرحباً',
    seeAll: 'عرض الكل',
    categories: 'الفئات',
    featured: 'الخياطون المميزون',
    nearYou: 'بالقرب منكِ',
    recentWork: 'أعمال حديثة',
  },
};

type Key = keyof typeof dict.en;

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
  isRTL: boolean;
}>({ lang: 'en', setLang: () => {}, t: (k) => k, isRTL: false });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: Key) => dict[lang][key] ?? key;
  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
