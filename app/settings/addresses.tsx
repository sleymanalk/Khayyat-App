import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, fonts } from '../../src/lib/theme';
import { usePrefs, type Address } from '../../src/lib/userPrefs';
import { areas } from '../../src/data/tailors';

const LABEL_OPTIONS = ['Home', 'Office', 'Family', 'Other'];

export default function AddressesScreen() {
  const router = useRouter();
  const { prefs, addAddress, updateAddress, removeAddress, setDefaultAddress } = usePrefs();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    area: areas[0],
    block: '',
    street: '',
    building: '',
    floor: '',
    notes: '',
    isDefault: false,
  });
  const [showAreaList, setShowAreaList] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm({ label: 'Home', area: areas[0], block: '', street: '', building: '', floor: '', notes: '', isDefault: prefs.addresses.length === 0 });
    setShowForm(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({ ...a });
    setShowForm(true);
  };

  const save = () => {
    if (!form.block.trim() || !form.street.trim() || !form.building.trim()) {
      Alert.alert('Missing info', 'Please fill block, street and building.');
      return;
    }
    if (editing) updateAddress(editing.id, form);
    else addAddress(form);
    setShowForm(false);
  };

  const confirmDelete = (a: Address) =>
    Alert.alert('Remove address?', `${a.label} · ${a.area}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeAddress(a.id) },
    ]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center -ml-2" style={{ backgroundColor: theme.colors.surface }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View className="flex-1 ml-3">
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: theme.colors.text }}>Saved Addresses</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
            For home visits and deliveries
          </Text>
        </View>
        <Pressable onPress={openNew} className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
          <Ionicons name="add" size={22} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {prefs.addresses.length === 0 ? (
          <View className="items-center py-16">
            <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
              <Ionicons name="location-outline" size={36} color={theme.colors.primary} />
            </View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text, marginTop: 14 }}>No addresses yet</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 4 }}>
              Add one to speed up bookings
            </Text>
            <Pressable onPress={openNew} className="mt-5 px-6 py-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: 'white' }}>Add address</Text>
            </Pressable>
          </View>
        ) : (
          prefs.addresses.map((a) => (
            <View key={a.id} className="rounded-2xl p-4 mb-3" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
                  <Ionicons name={a.label === 'Home' ? 'home' : a.label === 'Office' ? 'business' : 'location'} size={18} color={theme.colors.primary} />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center">
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{a.label}</Text>
                    {a.isDefault && (
                      <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.colors.success + '20' }}>
                        <Text style={{ fontFamily: fonts.bold, fontSize: 9, color: theme.colors.success }}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 3, lineHeight: 17 }}>
                    {a.area} · Block {a.block}, Street {a.street}{'\n'}
                    Building {a.building}{a.floor ? ` · ${a.floor}` : ''}
                  </Text>
                  {a.notes ? (
                    <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 4, fontStyle: 'italic' }}>
                      Note: {a.notes}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View className="flex-row items-center mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, gap: 8 }}>
                {!a.isDefault && (
                  <Pressable onPress={() => setDefaultAddress(a.id)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.primarySoft }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.primary }}>Set default</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => openEdit(a)} className="px-3 py-1.5 rounded-full flex-row items-center" style={{ backgroundColor: theme.colors.bg }}>
                  <Ionicons name="pencil" size={11} color={theme.colors.text} />
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.text, marginLeft: 4 }}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => confirmDelete(a)} className="ml-auto px-3 py-1.5 rounded-full flex-row items-center">
                  <Ionicons name="trash-outline" size={12} color={theme.colors.danger} />
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.danger, marginLeft: 4 }}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Pressable className="flex-1" onPress={() => setShowForm(false)} />
          <View className="rounded-t-3xl p-5" style={{ backgroundColor: theme.colors.surface, maxHeight: '85%' }}>
            <View className="items-center mb-4">
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, color: theme.colors.text }}>
                {editing ? 'Edit address' : 'New address'}
              </Text>
              <Pressable onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={22} color={theme.colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 8 }}>Label</Text>
              <View className="flex-row mb-4" style={{ gap: 8 }}>
                {LABEL_OPTIONS.map((l) => (
                  <Pressable key={l} onPress={() => setForm({ ...form, label: l })}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                      backgroundColor: form.label === l ? theme.colors.primary : theme.colors.bg,
                      borderWidth: 1, borderColor: form.label === l ? theme.colors.primary : theme.colors.border }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: form.label === l ? 'white' : theme.colors.text }}>{l}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 8 }}>Area</Text>
              <Pressable onPress={() => setShowAreaList(!showAreaList)}
                className="flex-row items-center justify-between mb-3"
                style={{ backgroundColor: theme.colors.bg, borderRadius: 12, padding: 12 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text }}>{form.area}</Text>
                <Ionicons name={showAreaList ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textMuted} />
              </Pressable>
              {showAreaList && (
                <View className="flex-row flex-wrap mb-3" style={{ gap: 6 }}>
                  {areas.map((a) => (
                    <Pressable key={a} onPress={() => { setForm({ ...form, area: a }); setShowAreaList(false); }}
                      style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
                        backgroundColor: form.area === a ? theme.colors.primary : theme.colors.bg,
                        borderWidth: 1, borderColor: form.area === a ? theme.colors.primary : theme.colors.border }}>
                      <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: form.area === a ? 'white' : theme.colors.text }}>{a}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <FormInput label="Block" value={form.block} onChangeText={(v) => setForm({ ...form, block: v })} placeholder="e.g. 10" />
              <FormInput label="Street" value={form.street} onChangeText={(v) => setForm({ ...form, street: v })} placeholder="e.g. Salem Al-Mubarak" />
              <FormInput label="Building" value={form.building} onChangeText={(v) => setForm({ ...form, building: v })} placeholder="e.g. 24" />
              <FormInput label="Floor / Apartment (optional)" value={form.floor || ''} onChangeText={(v) => setForm({ ...form, floor: v })} placeholder="e.g. Apt 5" />
              <FormInput label="Notes (optional)" value={form.notes || ''} onChangeText={(v) => setForm({ ...form, notes: v })} placeholder="e.g. Ring twice" multi />

              <View className="flex-row items-center justify-between mt-1 mb-4 px-1">
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: theme.colors.text }}>Set as default</Text>
                <Switch value={form.isDefault} onValueChange={(v) => setForm({ ...form, isDefault: v })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }} thumbColor="white" />
              </View>

              <Pressable onPress={save} className="h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: 'white' }}>
                  {editing ? 'Save changes' : 'Add address'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FormInput({ label, value, onChangeText, placeholder, multi }: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string; multi?: boolean }) {
  return (
    <View className="mb-3">
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.colors.textMuted}
        multiline={multi} numberOfLines={multi ? 3 : 1}
        style={{ fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text,
          backgroundColor: theme.colors.bg, borderRadius: 12, padding: 12,
          minHeight: multi ? 70 : undefined, textAlignVertical: multi ? 'top' : 'auto' }} />
    </View>
  );
}
