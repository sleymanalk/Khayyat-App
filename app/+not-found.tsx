import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5" style={{ backgroundColor: '#FAF7F2' }}>
        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-xl text-slate-900">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-3">
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-teal-700">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
