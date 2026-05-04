import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../../lib/auth-client';
import { tailors } from '../../src/data/tailors';
import { theme, fonts } from '../../src/lib/theme';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(ts).toLocaleDateString();
}

export default function Chats() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const conversations = useQuery(api.queries.listConversations, session ? {} : 'skip');
  const isLoading = isPending || (session && conversations === undefined);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="px-5 pb-4" style={{ paddingTop: 16 }}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: theme.colors.text }}>
          Messages
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, marginTop: 2 }}>
          Chat with your tailors
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : !session ? (
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: theme.colors.primarySoft }}
          >
            <Ionicons name="chatbubbles-outline" size={36} color={theme.colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: theme.colors.text }}>
            Sign in to view messages
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: theme.colors.textMuted,
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            Create an account to chat with tailors
          </Text>
        </View>
      ) : !conversations || conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: theme.colors.primarySoft }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={36} color={theme.colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: theme.colors.text }}>
            No conversations yet
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: theme.colors.textMuted,
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            Tap the chat button on any tailor profile to start a conversation
          </Text>
          <Pressable
            onPress={() => router.push('/(customer)/explore')}
            className="mt-6 px-6 py-3 rounded-full active:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: 'white' }}>
              Browse tailors
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 }}
        >
          {conversations.map((c) => {
            const t = tailors.find((x) => x.id === c.tailorId);
            const img = c.tailorImage ?? t?.image;
            const hasUnread = c.unreadByUser > 0;
            return (
              <Pressable
                key={c._id}
                onPress={() => router.push(`/chat/${c.tailorId}`)}
                className="flex-row items-center p-4 rounded-2xl mb-3 active:opacity-90"
                style={[{ backgroundColor: theme.colors.surface }, theme.shadow.soft]}
              >
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={{ width: 52, height: 52, borderRadius: 26 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: theme.colors.primarySoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="cut" size={22} color={theme.colors.primary} />
                  </View>
                )}
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
                      {c.tailorName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: 11,
                        color: hasUnread ? theme.colors.primary : theme.colors.textMuted,
                      }}
                    >
                      {timeAgo(c.lastMessageAt)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1.5">
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: hasUnread ? fonts.semibold : fonts.medium,
                        fontSize: 13,
                        color: hasUnread ? theme.colors.text : theme.colors.textMuted,
                        flex: 1,
                        marginRight: 8,
                      }}
                    >
                      {c.lastMessage}
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
                          {c.unreadByUser}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
