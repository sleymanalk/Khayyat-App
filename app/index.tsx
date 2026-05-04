import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { theme, fonts } from '../src/lib/theme';
import { useI18n } from '../src/lib/i18n';
import { useRole, type Role } from '../src/lib/role';
import { useSession } from '../lib/auth-client';
import { TermsModal } from '../src/components/TermsModal';
import { usePrefs } from '../src/lib/userPrefs';

const HERO_IMAGE = 'https://cdn.shipper.now/image/users/cmoq32jl80012l504n4jq8d0c/1777840882395-fbtj0qj0u27-image.png';

export default function RoleSelect() {
  const router = useRouter();
  const { t, lang, setLang, isRTL } = useI18n();
  const { role, setRole, ready } = useRole();
  const { data: session, isPending } = useSession();
  const { prefs, acceptTerms } = usePrefs();
  const [selected, setSelected] = useState<Role>('customer');
  const [showTerms, setShowTerms] = useState(false);

  // If signed in and role is set, jump straight in
  useEffect(() => {
    if (!ready || isPending) return;
    if (session && role === 'customer') router.replace('/(customer)');
    else if (session && role === 'tailor') router.replace('/(tailor)');
  }, [ready, isPending, session, role]);

  const proceed = () => {
    if (session) {
      setRole(selected);
      if (selected === 'tailor') router.replace('/(tailor)');
      else router.replace('/(customer)');
    } else {
      router.push({ pathname: '/auth', params: { mode: 'signup', role: selected ?? 'customer' } });
    }
  };

  const go = () => {
    if (selected === 'customer' && !prefs.termsAcceptedAt && !session) {
      setShowTerms(true);
    } else {
      proceed();
    }
  };

  if (!ready || isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: theme.colors.bg }}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']} style={{ backgroundColor: theme.colors.bg }}>
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-6 pt-4 pb-3">
          <Pressable
            onPress={() => router.push({ pathname: '/auth', params: { mode: 'signin' } })}
            className="flex-row items-center bg-white px-4 h-10 rounded-full"
            style={theme.shadow.soft}
          >
            <Ionicons name="log-in-outline" size={15} color={theme.colors.primary} />
            <Text style={{ fontFamily: fonts.semibold, color: theme.colors.primary, fontSize: 12, marginLeft: 6 }}>
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex-row items-center bg-white px-4 h-10 rounded-full"
            style={theme.shadow.soft}
          >
            <Ionicons name="globe-outline" size={15} color={theme.colors.primary} />
            <Text style={{ fontFamily: fonts.semibold, color: theme.colors.primary, fontSize: 12, marginLeft: 6 }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </Text>
          </Pressable>
        </View>

        <View style={{ width: '100%', height: 280, marginTop: 4 }}>
          <Image source={{ uri: HERO_IMAGE }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        <View className="items-center px-6" style={{ marginTop: 18 }}>
          <View className="flex-row items-center justify-center" style={{ gap: 16 }}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>Khayyat</Text>
            <View style={{ width: 2, height: 24, backgroundColor: theme.colors.primary, borderRadius: 1 }} />
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>خياط</Text>
          </View>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 8, textAlign: 'center', letterSpacing: 0.5 }}>
            {t('tagline')}
          </Text>
        </View>

        <View className="px-6 flex-1" style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.textMuted, marginBottom: 12, textAlign: isRTL ? 'right' : 'left', letterSpacing: 0.8, textTransform: 'uppercase' }}>
            {t('chooseRole')}
          </Text>

          <RoleCard icon="sparkles" title={t('roleCustomer')} desc={t('roleCustomerDesc')} active={selected === 'customer'} onPress={() => setSelected('customer')} />
          <View style={{ height: 12 }} />
          <RoleCard icon="storefront" title={t('roleTailor')} desc={t('roleTailorDesc')} active={selected === 'tailor'} onPress={() => setSelected('tailor')} />
        </View>

        <View className="px-6" style={{ paddingBottom: 16, paddingTop: 8 }}>
          <Pressable onPress={go} className="h-14 rounded-2xl items-center justify-center active:opacity-90" style={{ backgroundColor: theme.colors.primary }}>
            <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 15, letterSpacing: 0.5 }}>
              {session ? t('continue') : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>

      <TermsModal
        visible={showTerms}
        mode="accept"
        onAccept={() => { acceptTerms(); setShowTerms(false); proceed(); }}
        onClose={() => setShowTerms(false)}
      />
    </SafeAreaView>
  );
}

function RoleCard({ icon, title, desc, active, onPress }: { icon: any; title: string; desc: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-3xl flex-row items-center"
      style={[{ padding: 16 }, theme.shadow.soft, active && { borderWidth: 2, borderColor: theme.colors.primary }]}
    >
      <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: active ? theme.colors.primary : theme.colors.primarySoft }}>
        <Ionicons name={icon} size={22} color={active ? 'white' : theme.colors.primary} />
      </View>
      <View className="flex-1" style={{ marginLeft: 14 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{title}</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 3 }}>{desc}</Text>
      </View>
      <View className="w-6 h-6 rounded-full items-center justify-center" style={{ borderWidth: 2, borderColor: active ? theme.colors.primary : theme.colors.border, backgroundColor: active ? theme.colors.primary : 'transparent' }}>
        {active && <Ionicons name="checkmark" size={14} color="white" />}
      </View>
    </Pressable>
  );
}
