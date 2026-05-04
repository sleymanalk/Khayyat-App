import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, fonts } from '../../src/lib/theme';
import { Ionicons } from '@expo/vector-icons';

const MOCK = [
  { id: '1', name: 'Fatima Al-Sabah', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', last: 'Can you do crystal work on cuffs?', time: '2m', unread: 2 },
  { id: '2', name: 'Mariam Al-Otaibi', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', last: '📷 Photo', time: '1h', unread: 1 },
  { id: '3', name: 'Aisha Al-Mutawa', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80', last: 'Thank you so much! ❤️', time: 'Yesterday', unread: 0 },
  { id: '4', name: 'Noura Al-Khalifa', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', last: 'When can I come for fitting?', time: '2d', unread: 0 },
  { id: '5', name: 'Layla Al-Saleh', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80', last: 'Perfect, see you Saturday', time: '3d', unread: 0 },
];

export default function TailorChats() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pt-2 pb-4">
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>
          Messages
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 2 }}>
          Reply to customer enquiries
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 }}
      >
        {MOCK.map((c) => {
          const hasUnread = c.unread > 0;
          return (
            <Pressable
              key={c.id}
              className="flex-row items-center p-4 rounded-2xl mb-3 active:opacity-90"
              style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
            >
              <Image
                source={{ uri: c.img }}
                style={{ width: 52, height: 52, borderRadius: 26 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 15,
                      color: theme.colors.text,
                      flex: 1,
                      marginRight: 8,
                    }}
                    numberOfLines={1}
                  >
                    {c.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 11,
                      color: hasUnread ? theme.colors.primary : theme.colors.textMuted,
                    }}
                  >
                    {c.time}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-1.5">
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontFamily: hasUnread ? fonts.semibold : fonts.medium,
                      fontSize: 13,
                      color: hasUnread ? theme.colors.text : theme.colors.textMuted,
                      marginRight: 8,
                    }}
                  >
                    {c.last}
                  </Text>
                  {hasUnread && (
                    <View
                      style={{
                        minWidth: 20,
                        height: 20,
                        paddingHorizontal: 6,
                        borderRadius: 10,
                        backgroundColor: theme.colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: 'white' }}>
                        {c.unread}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}

        <View className="flex-row items-center justify-center py-4 mt-2">
          <Ionicons name="lock-closed-outline" size={12} color={theme.colors.textMuted} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted, marginLeft: 6 }}>
            Messages are end-to-end encrypted
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
