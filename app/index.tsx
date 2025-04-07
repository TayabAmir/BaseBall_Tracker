import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Image
        source={require('./image.png')}
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold mb-6 text-center text-black">
        Cricket Match Tracker
      </Text>

      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-xl"
        onPress={() => router.push('/screens/TeamSetupScreen')}
      >
        <Text className="text-white text-lg font-semibold">Start Team Setup</Text>
      </TouchableOpacity>
    </View>
  );
}
