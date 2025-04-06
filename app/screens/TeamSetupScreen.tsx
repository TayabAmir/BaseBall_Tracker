import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import MatchSettingsModal from '@/Modals/MatchSettingModal';

export default function TeamSetupScreen() {

    const [noOfPlayers, setNoOfPlayers] = useState(0);
    const [overs, setOvers] = useState(0);
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
    const [settingsVisible, setSettingsVisible] = useState(true);

    useEffect(() => {
        if (noOfPlayers > 0) {
          setTeamAPlayers(Array(noOfPlayers).fill(''));
          setTeamBPlayers(Array(noOfPlayers).fill(''));
        }
      }, [noOfPlayers]);

    const handleSettingsConfirm = (players: number, overs: number) => {
        setNoOfPlayers(players)
        setOvers(overs)
        setSettingsVisible(false);
    };

    const handleSubmit = () => {
        if (!teamA || !teamB) return;
        router.push({
            pathname: '/screens/MatchScreen',
            params: {
                teamA,
                teamB,
                playersA: JSON.stringify(teamAPlayers),
                playersB: JSON.stringify(teamBPlayers),
                overs,
                noOfPlayers
            },
        });
    };

    const renderPlayerInputs = (
        players: string[],
        setPlayers: React.Dispatch<React.SetStateAction<string[]>>,
        teamName: string,
      ) => {
        return players.map((player, index) => (
            <TextInput
              key={index}
              placeholder={`${teamName} Player ${index + 1}`}
              value={player}
              onChangeText={(text) => {
                const newPlayers = [...players];
                newPlayers[index] = text;
                setPlayers(newPlayers);
              }}
              className="border border-gray-300 rounded-lg p-2 mb-2"
            />
          ));
      };
      

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <MatchSettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                onConfirm={handleSettingsConfirm}
            />
            <Text className="text-2xl font-bold text-center mb-6"> Team Setup</Text>

            <Text className="text-lg font-semibold mb-2">Team A Name</Text>
            <TextInput
                placeholder="Enter Team A Name"
                value={teamA}
                onChangeText={setTeamA}
                className="border border-gray-300 rounded-lg p-2 mb-4"
            />

            <Text className="text-lg font-semibold mb-2">Team A Players</Text>
            {renderPlayerInputs(teamAPlayers, setTeamAPlayers, teamA || 'Team A')}

            <Text className="text-lg font-semibold mt-6 mb-2">Team B Name</Text>
            <TextInput
                placeholder="Enter Team B Name"
                value={teamB}
                onChangeText={setTeamB}
                className="border border-gray-300 rounded-lg p-2 mb-4"
            />

            <Text className="text-lg font-semibold mb-2">Team B Players</Text>
            {renderPlayerInputs(teamBPlayers, setTeamBPlayers, teamB || 'Team B')}

            <TouchableOpacity
                className="mt-6 bg-green-600 p-4 rounded-xl"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center text-lg font-semibold">
                    Start Match
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
