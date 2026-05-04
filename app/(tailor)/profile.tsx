import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { theme, fonts } from '../../src/lib/theme';
import { useRole } from '../../src/lib/role';
import { useShop } from '../../src/lib/shopStore';
import { areas } from '../../src/data/tailors';

const SPECIALTIES = ['Designer Abayas', 'Wedding & Evening', 'Modern Dresses', 'Ramadan & Eid Wear', 'Tailored Suits', 'Bridal Couture', 'Alterations', 'Contemporary Fusion'];
const TAG_OPTIONS = ['Designer', 'Embroidery', 'Bridal', 'Luxury', 'Couture', 'Modern', 'European', 'Occasion', 'Traditional', 'Express', 'Khaleeji', 'Premium', 'Italian Fabric', 'Bespoke', 'Trendy', 'Affordable'];

export default function TailorProfile() {
  const router = useRouter();
  const { setRole } = useRole();
  const { shop, update, toggleTag } = useShop();
  const upsertShop = useMutation(api.mutations.upsertShop);
  const myShop = useQuery(api.queries.getMyShop, {});
  const [saving, setSaving] = useState(false);

  const saveToCloud = async () => {
    setSaving(true);
    try {
      await upsertShop({
        name: shop.name, nameAr: shop.nameAr, specialty: shop.specialty, area: shop.area,
        description: shop.description, phone: shop.phone, openingHours: shop.openingHours,
        startingPrice: shop.startingPrice, homeVisit: shop.homeVisit, delivery: shop.delivery,
        acceptingOrders: shop.acceptingOrders, businessType: shop.businessType, onlineOnly: shop.onlineOnly,
        coverImage: shop.coverImage,
        services: shop.services, gallery: shop.gallery, tags: shop.tags,
      });
      Alert.alert('Saved', myShop ? 'Your shop has been updated and is live for customers.' : 'Your shop is now live and visible to customers across Kuwait.');
    } catch (e: any) {
      Alert.alert('Save failed', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const switchRole = () => {
    setRole(null);
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>Shop Profile</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
              How customers see your shop
            </Text>
          </View>
          <Pressable
            onPress={switchRole}
            className="w-11 h-11 rounded-full items-center justify-center"
            style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
          >
            <Ionicons name="swap-horizontal" size={18} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Cover */}
        <View className="mx-5 mt-5 rounded-3xl overflow-hidden" style={[{ height: 180, backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Image source={{ uri: shop.coverImage }} className="w-full h-full absolute" resizeMode="cover" />
          <View className="absolute inset-0" style={{ backgroundColor: 'rgba(31,26,36,0.35)' }} />
          <View className="flex-1 p-4 justify-end">
            <View className="flex-row items-center">
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: 'white' }} numberOfLines={1}>
                {shop.name}
              </Text>
              {shop.acceptingOrders ? (
                <View className="ml-2 px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.colors.success }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: 'white' }}>OPEN</Text>
                </View>
              ) : (
                <View className="ml-2 px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.colors.danger }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: 'white' }}>PAUSED</Text>
                </View>
              )}
            </View>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: 'white', opacity: 0.95, marginTop: 4 }}>
              {shop.specialty} · {shop.area}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              const newUrl =
                shop.coverImage.includes('1623580905752')
                  ? 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80'
                  : 'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=800&q=80';
              update({ coverImage: newUrl });
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
          >
            <Ionicons name="camera" size={16} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Business type selector */}
        <SectionHeader title="Business Type" />
        <View className="mx-5 rounded-2xl p-1.5 flex-row" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <BizChoice
            icon="cut-outline"
            label="Tailor Shop"
            sub="Physical atelier"
            active={shop.businessType === 'tailor'}
            onPress={() => update({ businessType: 'tailor' })}
          />
          <BizChoice
            icon="color-palette-outline"
            label="Designer"
            sub="Custom designs"
            active={shop.businessType === 'designer'}
            onPress={() => update({ businessType: 'designer' })}
          />
        </View>

        {/* Availability toggles */}
        <SectionHeader title="Availability" />
        <View className="mx-5 rounded-2xl p-1" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Toggle
            icon="globe-outline"
            label="Online only business"
            help={shop.businessType === 'designer' ? 'No physical store — work remotely' : 'No physical shop — visits only'}
            value={shop.onlineOnly}
            onValueChange={(v) => update({ onlineOnly: v, homeVisit: v ? false : shop.homeVisit })}
          />
          <Divider />
          <Toggle
            icon="storefront-outline"
            label="Accepting new orders"
            help="Pause to hide booking buttons"
            value={shop.acceptingOrders}
            onValueChange={(v) => update({ acceptingOrders: v })}
          />
          <Divider />
          {!shop.onlineOnly && (
            <>
              <Toggle
                icon="home-outline"
                label="Home visits"
                help="Visit customers at their home"
                value={shop.homeVisit}
                onValueChange={(v) => update({ homeVisit: v })}
              />
              <Divider />
            </>
          )}
          <View style={{ display: 'none' }} />
          <Toggle
            icon="cube-outline"
            label="Delivery available"
            help="Deliver finished orders"
            value={shop.delivery}
            onValueChange={(v) => update({ delivery: v })}
          />
        </View>

        {/* Basic info */}
        <SectionHeader title="Basic Info" />
        <View className="mx-5 rounded-2xl p-5" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Field
            label="Shop name (English)"
            value={shop.name}
            onChangeText={(v) => update({ name: v })}
            placeholder="e.g. Noor Abaya House"
          />
          <Field
            label="Shop name (Arabic)"
            value={shop.nameAr}
            onChangeText={(v) => update({ nameAr: v })}
            placeholder="اسم المحل"
          />
          <PickerField
            label="Specialty"
            value={shop.specialty}
            onPress={() => setShowSpecPicker(!showSpecPicker)}
            isOpen={showSpecPicker}
          />
          {showSpecPicker && (
            <View className="flex-row flex-wrap mb-3" style={{ gap: 8 }}>
              {SPECIALTIES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={shop.specialty === s}
                  onPress={() => {
                    update({ specialty: s });
                    setShowSpecPicker(false);
                  }}
                />
              ))}
            </View>
          )}
          <PickerField
            label="Area"
            value={shop.area}
            onPress={() => setShowAreaPicker(!showAreaPicker)}
            isOpen={showAreaPicker}
          />
          {showAreaPicker && (
            <View className="flex-row flex-wrap mb-3" style={{ gap: 8 }}>
              {areas.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  active={shop.area === a}
                  onPress={() => {
                    update({ area: a });
                    setShowAreaPicker(false);
                  }}
                />
              ))}
            </View>
          )}
          <Field
            label="Phone"
            value={shop.phone}
            onChangeText={(v) => update({ phone: v })}
            keyboardType="phone-pad"
            placeholder="+965 9999 0000"
          />
          <View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>
              Description
            </Text>
            <TextInput
              value={shop.description}
              onChangeText={(v) => update({ description: v })}
              multiline
              numberOfLines={4}
              placeholder="Tell customers about your atelier..."
              placeholderTextColor={theme.colors.textMuted}
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: theme.colors.text,
                backgroundColor: theme.colors.bg,
                borderRadius: 12,
                padding: 12,
                minHeight: 90,
                textAlignVertical: 'top',
              }}
            />
          </View>
        </View>

        {/* Hours */}
        <SectionHeader title="Working Hours" />
        <View className="mx-5 rounded-2xl p-5" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Field
            label="Hours"
            value={shop.openingHours}
            onChangeText={(v) => update({ openingHours: v })}
            placeholder="10:00 AM - 11:00 PM"
          />
          <View className="flex-row mt-1" style={{ gap: 8 }}>
            {['9:00 AM - 10:00 PM', '10:00 AM - 11:00 PM', 'By Appointment'].map((h) => (
              <Chip key={h} label={h} active={shop.openingHours === h} onPress={() => update({ openingHours: h })} small />
            ))}
          </View>
        </View>

        {/* Pricing */}
        <SectionHeader title="Starting Price" />
        <View className="mx-5 rounded-2xl p-5" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>
            Cheapest service price (KD)
          </Text>
          <TextInput
            value={String(shop.startingPrice)}
            onChangeText={(v) => update({ startingPrice: Number(v.replace(/[^0-9]/g, '')) || 0 })}
            keyboardType="numeric"
            style={{
              fontFamily: fonts.bold,
              fontSize: 18,
              color: theme.colors.text,
              backgroundColor: theme.colors.bg,
              borderRadius: 12,
              padding: 12,
            }}
          />
        </View>

        {/* Tags */}
        <SectionHeader title="Tags" right={
          <Pressable onPress={() => setShowTagPicker(!showTagPicker)}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.primary }}>
              {showTagPicker ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        } />
        <View className="mx-5 rounded-2xl p-5" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          {shop.tags.length === 0 ? (
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted }}>
              No tags yet. Tap Edit to add some.
            </Text>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {shop.tags.map((t) => (
                <View key={t} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.primarySoft }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: theme.colors.primary }}>{t}</Text>
                </View>
              ))}
            </View>
          )}
          {showTagPicker && (
            <View className="flex-row flex-wrap mt-4 pt-4 border-t" style={{ gap: 8, borderColor: theme.colors.border }}>
              {TAG_OPTIONS.map((t) => (
                <Chip key={t} label={t} active={shop.tags.includes(t)} onPress={() => toggleTag(t)} small />
              ))}
            </View>
          )}
        </View>

        {/* Manage links */}
        <SectionHeader title="Manage" />
        <View className="mx-5 rounded-2xl overflow-hidden" style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}>
          <ManageRow
            icon="pricetags-outline"
            label="Services & Pricing"
            sub={`${shop.services.length} services`}
            onPress={() => router.push('/shop/edit-services')}
          />
          <Divider />
          <ManageRow
            icon="images-outline"
            label="Portfolio Gallery"
            sub={`${shop.gallery.length} photos`}
            onPress={() => router.push('/(tailor)/portfolio')}
          />
          <Divider />
          <ManageRow
            icon="calendar-outline"
            label="Bookings"
            sub="Accept or decline orders"
            onPress={() => router.push('/(tailor)/bookings')}
          />
          <Divider />
          <ManageRow
            icon="chatbubbles-outline"
            label="Customer messages"
            sub="Reply to enquiries"
            onPress={() => router.push('/(tailor)/chats')}
          />
        </View>

        {/* Featured upgrade CTA */}
        <Pressable
          onPress={() => router.push('/shop/featured')}
          className="mx-5 mt-6 rounded-2xl p-4 flex-row items-center"
          style={[{ backgroundColor: theme.colors.primary }, theme.shadow.soft]}
        >
          <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name="star" size={20} color="white" />
          </View>
          <View className="flex-1 ml-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: 'white' }}>
              {myShop?.isFeatured ? 'You are Featured ★' : 'Become a Featured Shop'}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: 'white', opacity: 0.9, marginTop: 2 }}>
              {myShop?.isFeatured ? 'Manage your subscription' : 'Top placement · 5× more bookings'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>

        <Pressable
          onPress={saveToCloud}
          disabled={saving}
          className="mx-5 mt-3 h-14 rounded-2xl items-center justify-center flex-row"
          style={[{ backgroundColor: theme.colors.text, opacity: saving ? 0.6 : 1 }, theme.shadow.soft]}
        >
          <Ionicons name="cloud-upload" size={18} color="white" />
          <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 14, marginLeft: 8 }}>
            {saving ? 'Publishing...' : myShop ? 'Save & publish' : 'Publish my shop'}
          </Text>
        </Pressable>
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

function PickerField({
  label,
  value,
  onPress,
  isOpen,
}: {
  label: string;
  value: string;
  onPress: () => void;
  isOpen: boolean;
}) {
  return (
    <View className="mb-3">
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 }}>
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: theme.colors.bg,
          borderRadius: 12,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text }}>{value}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  small,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: small ? 12 : 14,
        paddingVertical: small ? 7 : 9,
        borderRadius: 999,
        backgroundColor: active ? theme.colors.primary : theme.colors.bg,
        borderWidth: 1,
        borderColor: active ? theme.colors.primary : theme.colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.semibold,
          fontSize: small ? 11 : 12,
          color: active ? 'white' : theme.colors.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function BizChoice({
  icon,
  label,
  sub,
  active,
  onPress,
}: {
  icon: any;
  label: string;
  sub: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 14,
        backgroundColor: active ? theme.colors.primary : 'transparent',
        alignItems: 'center',
      }}
    >
      <Ionicons name={icon} size={20} color={active ? 'white' : theme.colors.primary} />
      <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: active ? 'white' : theme.colors.text, marginTop: 6 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: active ? 'rgba(255,255,255,0.85)' : theme.colors.textMuted, marginTop: 2 }}>
        {sub}
      </Text>
    </Pressable>
  );
}

function Toggle({
  icon,
  label,
  help,
  value,
  onValueChange,
}: {
  icon: any;
  label: string;
  help: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center p-4">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View className="flex-1 ml-3">
        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{label}</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>
          {help}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor="white"
      />
    </View>
  );
}

function ManageRow({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: any;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center p-4">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: theme.colors.primarySoft }}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View className="flex-1 ml-3">
        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }}>{label}</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginTop: 1 }}>
          {sub}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />;
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View className="px-5 mt-6 mb-3 flex-row items-center justify-between">
      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>{title}</Text>
      {right}
    </View>
  );
}
