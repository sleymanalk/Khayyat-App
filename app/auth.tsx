import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme, fonts } from '../src/lib/theme';
import { signInWithEmail, signUpWithEmail, AUTH_CONFIG } from '../lib/auth-client';
import { useRole, type Role } from '../src/lib/role';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; role?: string }>();
  const { setRole } = useRole();
  const [mode, setMode] = useState<'signin' | 'signup'>((params.mode as any) ?? 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = (params.role as Role) ?? 'customer';

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const result = mode === 'signin'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, name);
    setLoading(false);

    if (!result.success) {
      setError(result.error?.message ?? 'Something went wrong');
      return;
    }

    setRole(role);
    if (role === 'tailor') router.replace('/(tailor)');
    else router.replace('/(customer)');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center mb-4" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </Pressable>

        <View className="items-center mb-8 mt-4">
          <View className="w-16 h-16 rounded-3xl items-center justify-center mb-4" style={{ backgroundColor: theme.colors.primarySoft }}>
            <Ionicons name={role === 'tailor' ? 'storefront' : 'sparkles'} size={28} color={theme.colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>
            {mode === 'signin' ? 'Welcome back' : role === 'tailor' ? 'Register your shop' : 'Create your account'}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 6, textAlign: 'center' }}>
            {mode === 'signin'
              ? 'Sign in to continue'
              : role === 'tailor'
                ? 'Join as a master tailor in Kuwait'
                : 'Discover Kuwait master tailors'}
          </Text>
        </View>

        {mode === 'signup' && (
          <View className="mb-3">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>
              Full name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.colors.textMuted}
              style={{
                fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text,
                backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14,
              }}
            />
          </View>
        )}

        <View className="mb-3">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text,
              backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14,
            }}
          />
        </View>

        <View className="mb-3">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            style={{
              fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text,
              backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14,
            }}
          />
        </View>

        {error && (
          <View className="rounded-xl p-3 mb-3" style={{ backgroundColor: theme.colors.danger + '15' }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.danger }}>{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="h-14 rounded-2xl items-center justify-center mt-2"
          style={{ backgroundColor: theme.colors.primary, opacity: loading ? 0.6 : 1 }}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 15 }}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Text>}
        </Pressable>

        <Pressable onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }} className="mt-5 items-center">
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={{ fontFamily: fonts.bold, color: theme.colors.primary }}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
