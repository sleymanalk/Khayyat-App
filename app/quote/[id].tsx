import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, fonts } from '../../src/lib/theme';

export default function QuoteScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3" style={{ backgroundColor: theme.colors.surface }}>
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: theme.colors.text }}>Request Quote</Text>
        <View style={{ width: 40 }} />
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: theme.colors.textMuted, textAlign: 'center' }}>
          Image-based quote requests coming in the next phase.
        </Text>
      </View>
    </SafeAreaView>
  );
}
