import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (players: number, overs: number) => void;
}

export default function MatchSettingsModal({ visible, onClose, onConfirm }: Props) {
  const [players, setPlayers] = useState(11);
  const [oversIndex, setOversIndex] = useState(0);

  const oversOptions = [1, 4, 5, 6, 7, 8, 9, 10, 20, 50];

  const incrementPlayers = () => {
    if (players < 11) setPlayers(p => p + 1);
  };

  const decrementPlayers = () => {
    if (players > 3) setPlayers(p => p - 1);
  };

  const nextOverOption = () => {
    if (oversIndex < oversOptions.length - 1) setOversIndex(i => i + 1);
  };

  const prevOverOption = () => {
    if (oversIndex > 0) setOversIndex(i => i - 1);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
        <View className="bg-white p-6 rounded-xl w-full">

          <Text className="text-lg font-bold mb-4">Match Settings</Text>

          {/* Player Count */}
          <Text className="font-semibold mb-1">Select No. of Players</Text>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={decrementPlayers} className="bg-gray-300 px-4 py-2 rounded-md">
              <Text className="text-xl font-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold">{players}</Text>
            <TouchableOpacity onPress={incrementPlayers} className="bg-gray-300 px-4 py-2 rounded-md">
              <Text className="text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>

          {/* Overs */}
          <Text className="font-semibold mb-1">Select No. of Overs</Text>
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={prevOverOption} className="bg-gray-300 px-4 py-2 rounded-md">
              <Text className="text-xl font-bold">{'<'}</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold">{oversOptions[oversIndex]}</Text>
            <TouchableOpacity onPress={nextOverOption} className="bg-gray-300 px-4 py-2 rounded-md">
              <Text className="text-xl font-bold">{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-red-500 px-4 py-2 rounded-md"
              onPress={onClose}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-600 px-4 py-2 rounded-md"
              onPress={() => onConfirm(players, oversOptions[oversIndex])}
            >
              <Text className="text-white font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
