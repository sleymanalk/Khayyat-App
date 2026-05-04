import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ConvexReactClient } from 'convex/react';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { authClient } from '../lib/auth-client';
import { I18nProvider } from '../src/lib/i18n';
import { RoleProvider } from '../src/lib/role';
import { ShopProvider } from '../src/lib/shopStore';
import { TailorBookingsProvider } from '../src/lib/tailorBookingsStore';
import { PrefsProvider } from '../src/lib/userPrefs';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL ?? 'https://placeholder.convex.cloud',
  { unsavedChangesWarning: false }
);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider initialMetrics={{
      insets: { top: 47, bottom: 34, left: 0, right: 0 },
      frame: { x: 0, y: 0, width: 393, height: 852 },
    }}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <I18nProvider>
        <RoleProvider>
          <ShopProvider>
            <TailorBookingsProvider>
             <PrefsProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FAF6F0' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" options={{ presentation: 'card' }} />
                <Stack.Screen name="(customer)" />
                <Stack.Screen name="(tailor)" />
                <Stack.Screen name="tailor/[id]" options={{ presentation: 'card' }} />
                <Stack.Screen name="book/[id]" options={{ presentation: 'modal' }} />
                <Stack.Screen name="chat/[id]" />
                <Stack.Screen name="quote/[id]" options={{ presentation: 'modal' }} />
                <Stack.Screen name="shop/edit-services" options={{ presentation: 'modal' }} />
                <Stack.Screen name="shop/analytics" options={{ presentation: 'card' }} />
                <Stack.Screen name="shop/featured" options={{ presentation: 'modal' }} />
                <Stack.Screen name="settings/addresses" options={{ presentation: 'card' }} />
                <Stack.Screen name="settings/notifications" options={{ presentation: 'card' }} />
                <Stack.Screen name="settings/favorites" options={{ presentation: 'card' }} />
                <Stack.Screen name="settings/payment" options={{ presentation: 'card' }} />
              </Stack>
             </PrefsProvider>
            </TailorBookingsProvider>
          </ShopProvider>
        </RoleProvider>
      </I18nProvider>
      </ConvexBetterAuthProvider>
    </SafeAreaProvider>
  );
}
