import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router'; // or adjust based on your routing setup

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      {/* Cricket Logo */}
      <Image
        source={require('./image.png')} // adjust path if inside a folder like ./assets/image.png
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />

      {/* App Name */}
      <Text className="text-2xl font-bold mb-6 text-center text-black">
        Cricket Match Tracker
      </Text>

      {/* Navigation Button */}
      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-xl"
        onPress={() => router.push('/screens/TeamSetupScreen')}
      >
        <Text className="text-white text-lg font-semibold">Start Team Setup</Text>
      </TouchableOpacity>
    </View>
  );
}
