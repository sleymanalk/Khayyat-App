import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, fonts } from '../../src/lib/theme';
import { useShop, ShopService } from '../../src/lib/shopStore';

export default function EditServices() {
  const router = useRouter();
  const { shop, addService, updateService, removeService } = useShop();
  const [editing, setEditing] = useState<ShopService | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const openAdd = () => {
    setName('');
    setPrice('');
    setDuration('');
    setEditing(null);
    setAdding(true);
  };

  const openEdit = (s: ShopService) => {
    setName(s.name);
    setPrice(String(s.price));
    setDuration(s.duration);
    setEditing(s);
    setAdding(true);
  };

  const save = () => {
    const n = name.trim();
    const p = Number(price.replace(/[^0-9]/g, ''));
    const d = duration.trim();
    if (!n || !p || !d) {
      Alert.alert('Missing info', 'Please fill name, price, and duration.');
      return;
    }
    if (editing) {
      updateService(editing.id, { name: n, price: p, duration: d });
    } else {
      addService({ name: n, price: p, duration: d });
    }
    setAdding(false);
    setEditing(null);
  };

  const onRemove = (s: ShopService) => {
    Alert.alert('Remove service?', `"${s.name}" will no longer be shown to customers.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeService(s.id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center -ml-2" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View className="flex-1 ml-3">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text }}>
            Services & Pricing
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
            {shop.services.length} services
          </Text>
        </View>
        <Pressable
          onPress={openAdd}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <Ionicons name="add" size={20} color="white" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {adding && (
          <View className="rounded-2xl p-5 mb-4" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginBottom: 12 }}>
              {editing ? 'Edit service' : 'New service'}
            </Text>
            <Field label="Service name" value={name} onChangeText={setName} placeholder="e.g. Designer Abaya" />
            <View className="flex-row" style={{ gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="Price (KD)" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="95" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Duration" value={duration} onChangeText={setDuration} placeholder="10 days" />
              </View>
            </View>
            <View className="flex-row mt-2" style={{ gap: 10 }}>
              <Pressable
                onPress={() => {
                  setAdding(false);
                  setEditing(null);
                }}
                className="flex-1 h-12 rounded-2xl items-center justify-center"
                style={{ backgroundColor: theme.colors.bg }}
              >
                <Text style={{ fontFamily: fonts.semibold, color: theme.colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={save}
                className="flex-1 h-12 rounded-2xl items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Text style={{ fontFamily: fonts.bold, color: 'white' }}>{editing ? 'Save' : 'Add'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {shop.services.length === 0 && !adding && (
          <View className="rounded-2xl items-center justify-center py-12" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
            <Ionicons name="pricetags-outline" size={36} color={theme.colors.textMuted} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.colors.text, marginTop: 8 }}>
              No services yet
            </Text>
            <Pressable
              onPress={openAdd}
              className="mt-3 px-5 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: 'white' }}>Add first service</Text>
            </Pressable>
          </View>
        )}

        {shop.services.map((s) => (
          <View
            key={s.id}
            className="rounded-2xl p-4 mb-3 flex-row items-center"
            style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
          >
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="cut-outline" size={20} color={theme.colors.primary} />
            </View>
            <View className="flex-1 ml-3">
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>
                {s.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: theme.colors.primary }}>
                  KD {s.price}
                </Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginLeft: 8 }}>
                  · {s.duration}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => openEdit(s)} className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.bg }}>
              <Ionicons name="create-outline" size={16} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => onRemove(s)} className="w-9 h-9 rounded-full items-center justify-center ml-2" style={{ backgroundColor: theme.colors.bg }}>
              <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
}) {
  return (
    <View className="mb-3">
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        keyboardType={keyboardType}
        style={{
          fontFamily: fonts.medium,
          fontSize: 14,
          color: theme.colors.text,
          backgroundColor: theme.colors.bg,
          borderRadius: 12,
          padding: 12,
        }}
      />
    </View>
  );
}
