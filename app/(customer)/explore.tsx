import { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { tailors, categories, areas } from '../../src/data/tailors';
import { theme, fonts } from '../../src/lib/theme';
import { TailorCard } from '../../src/components/TailorCard';

export default function Explore() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(params.category ?? null);
  const [area, setArea] = useState<string | null>(null);

  const list = useMemo(() => {
    return tailors.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q.toLowerCase()) && !t.specialty.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat && !t.specialty.toLowerCase().includes(cat.toLowerCase()) && !t.tags.some(tg => tg.toLowerCase().includes(cat.toLowerCase()))) return false;
      if (area && t.area !== area) return false;
      return true;
    });
  }, [q, cat, area]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pb-3" style={{ paddingTop: 16 }}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>Explore</Text>
        <View className="rounded-2xl px-4 h-12 flex-row items-center mt-3" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search abaya, bridal, suits..."
            placeholderTextColor={theme.colors.textMuted}
            style={{ flex: 1, marginLeft: 8, fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text }}
          />
        </View>
      </View>

      <View className="mb-1">
        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.textMuted, paddingHorizontal: 20, marginBottom: 8 }}>
          CATEGORY
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
        >
          <Chip label="All" active={!cat} onPress={() => setCat(null)} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} active={cat === c.name} onPress={() => setCat(c.name === cat ? null : c.name)} />
          ))}
        </ScrollView>
      </View>

      <View className="mt-3 mb-1">
        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.textMuted, paddingHorizontal: 20, marginBottom: 8 }}>
          AREA
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
        >
          <Chip label="All Areas" active={!area} onPress={() => setArea(null)} />
          {areas.map((a) => (
            <Chip key={a} label={a} active={area === a} onPress={() => setArea(a === area ? null : a)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 10 }}>
          {list.length} tailors found
        </Text>
        {list.map((t) => <TailorCard key={t.id} tailor={t} />)}
        {list.length === 0 && (
          <View className="items-center py-16">
            <Ionicons name="search-outline" size={40} color={theme.colors.textMuted} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: theme.colors.text, marginTop: 12 }}>
              No tailors match your filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.colors.primary : theme.colors.surface,
        borderWidth: 1,
        borderColor: active ? theme.colors.primary : theme.colors.border,
      }}
    >
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: active ? 'white' : theme.colors.text, lineHeight: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}
