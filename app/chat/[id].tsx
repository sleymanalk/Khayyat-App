import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../../lib/auth-client';
import { tailors } from '../../src/data/tailors';
import { theme, fonts } from '../../src/lib/theme';

const QUICK_REPLIES = [
  'Hi! I\'d like to ask about your services.',
  'Are you available this week?',
  'Do you offer home visits?',
  'Can you send me a price quote?',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400',
];

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: session } = useSession();
  const tailor = tailors.find((x) => x.id === id) ?? tailors[0];
  const [text, setText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const conversation = useQuery(
    api.queries.getConversation,
    session ? { tailorId: tailor.id } : 'skip'
  );
  const messages = useQuery(
    api.queries.listMessages,
    conversation?._id ? { conversationId: conversation._id } : 'skip'
  );
  const sendMessage = useMutation(api.mutations.sendMessage);
  const markRead = useMutation(api.mutations.markConversationRead);

  useEffect(() => {
    if (conversation?._id && conversation.unreadByUser > 0) {
      markRead({ conversationId: conversation._id }).catch(() => {});
    }
  }, [conversation?._id, conversation?.unreadByUser, markRead]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages?.length]);

  const send = async (opts: { text?: string; imageUrl?: string }) => {
    if (!session) {
      Alert.alert('Sign in required', 'Please sign in to chat with tailors.');
      return;
    }
    if (!opts.text && !opts.imageUrl) return;
    setSending(true);
    setText('');
    setShowAttach(false);
    try {
      await sendMessage({
        tailorId: tailor.id,
        tailorName: tailor.name,
        tailorImage: tailor.image,
        text: opts.text,
        imageUrl: opts.imageUrl,
      });
    } catch (e: any) {
      Alert.alert('Send failed', e?.message ?? 'Try again');
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    send({ text: trimmed });
  };

  const showEmpty = !messages || messages.length === 0;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{ backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
      >
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Pressable
          onPress={() => router.push(`/tailor/${tailor.id}`)}
          className="flex-row items-center flex-1 ml-1"
        >
          <Image source={{ uri: tailor.image }} className="w-9 h-9 rounded-full" resizeMode="cover" />
          <View className="ml-3 flex-1">
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>
              {tailor.name}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: theme.colors.success }} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: theme.colors.textMuted }}>
                Active now
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/book/${tailor.id}`)}
          className="px-3 py-2 rounded-full"
          style={{ backgroundColor: theme.colors.primarySoft }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: theme.colors.primary }}>Book</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tailor intro card */}
          <View
            className="items-center p-5 rounded-2xl mb-4"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <Image source={{ uri: tailor.image }} className="w-16 h-16 rounded-full mb-3" resizeMode="cover" />
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>{tailor.name}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.textMuted, marginTop: 2 }}>
              {tailor.specialty} · {tailor.area}
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={12} color={theme.colors.accent} />
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.text, marginLeft: 4 }}>
                {tailor.rating} · {tailor.reviewCount} reviews
              </Text>
            </View>
          </View>

          {showEmpty && session && (
            <View className="items-center py-4">
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                }}
              >
                Start a conversation. Share design references or ask about pricing.
              </Text>
              <View className="flex-row flex-wrap justify-center mt-4 gap-2">
                {QUICK_REPLIES.map((q) => (
                  <Pressable
                    key={q}
                    onPress={() => send({ text: q })}
                    className="px-3 py-2 rounded-full"
                    style={{ backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }}
                  >
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: theme.colors.text }}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {messages?.map((m) => {
            const isUser = m.senderRole === 'user';
            return (
              <View key={m._id} className={`flex-row mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <Image
                    source={{ uri: tailor.image }}
                    className="w-7 h-7 rounded-full mr-2 mt-auto"
                    resizeMode="cover"
                  />
                )}
                <View style={{ maxWidth: '75%' }}>
                  <View
                    className="px-4 py-2.5"
                    style={{
                      backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
                      borderRadius: 18,
                      borderBottomRightRadius: isUser ? 4 : 18,
                      borderBottomLeftRadius: isUser ? 18 : 4,
                    }}
                  >
                    {m.imageUrl && (
                      <Image
                        source={{ uri: m.imageUrl }}
                        style={{ width: 200, height: 200, borderRadius: 12, marginBottom: m.text ? 8 : 0 }}
                        resizeMode="cover"
                      />
                    )}
                    {m.text && (
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: isUser ? 'white' : theme.colors.text,
                          lineHeight: 20,
                        }}
                      >
                        {m.text}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 10,
                      color: theme.colors.textMuted,
                      marginTop: 4,
                      textAlign: isUser ? 'right' : 'left',
                    }}
                  >
                    {formatTime(m.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}

          {sending && (
            <View className="flex-row justify-end mb-2">
              <View
                className="px-4 py-3 rounded-2xl"
                style={{ backgroundColor: theme.colors.primarySoft }}
              >
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Attachment tray */}
        {showAttach && (
          <View
            className="px-4 py-3"
            style={{ backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: theme.colors.textMuted, marginBottom: 8 }}>
              Send a design reference
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {SAMPLE_IMAGES.map((url) => (
                <Pressable key={url} onPress={() => send({ imageUrl: url })} className="mr-2">
                  <Image source={{ uri: url }} style={{ width: 80, height: 80, borderRadius: 12 }} resizeMode="cover" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Composer */}
        <View
          className="flex-row items-end px-3 py-2"
          style={{ backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border }}
        >
          <Pressable
            onPress={() => setShowAttach((s) => !s)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons
              name={showAttach ? 'close-circle' : 'image-outline'}
              size={24}
              color={showAttach ? theme.colors.primary : theme.colors.textMuted}
            />
          </Pressable>
          <View
            className="flex-1 px-4 py-2 mx-1"
            style={{
              backgroundColor: theme.colors.bg,
              borderRadius: 22,
              minHeight: 40,
              maxHeight: 120,
              justifyContent: 'center',
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Message..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              style={{ fontFamily: fonts.medium, fontSize: 14, color: theme.colors.text, paddingTop: 0, paddingBottom: 0 }}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: text.trim() ? theme.colors.primary : theme.colors.border }}
          >
            <Ionicons name="send" size={18} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
