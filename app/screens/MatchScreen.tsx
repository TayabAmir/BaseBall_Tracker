import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';


export default function MatchScreen() {
  const { teamA, teamB, playersA, playersB, overs, noOfPlayers } = useLocalSearchParams();

  const teamAStr = String(teamA)
  const teamBStr = String(teamB)

  const [teamAStats, setTeamAStats] = useState({ runs: 0, wickets: 0, balls: 0 });
  const [teamBStats, setTeamBStats] = useState({ runs: 0, wickets: 0, balls: 0 });

  const [tossModalVisible, setTossModalVisible] = useState(true);
  const [tossWinner, setTossWinner] = useState<string>('');
  const [tossDecision, setTossDecision] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tossResult, setTossResult] = useState(false);
  const [selectedBall, setSelectedBall] = useState('');
  const [subOptions, setSubOptions] = useState<string[]>([]);
  const [isFirstInnings, setIsFirstInnings] = useState(true);
  const [isSecondInnings, setIsSecondInnings] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<string>('');
  const [battingFirst, setBattingFirst] = useState<string>('');

  useEffect(() => {
    console.log("Current Team changed:", currentTeam);
  }, [currentTeam]);


  // const parsedPlayersA = JSON.parse(playersA as string);
  // const parsedPlayersB = JSON.parse(playersB as string);
  // const [battingTeam, setBattingTeam] = useState<string>('');
  // const [bowlingTeam, setBowlingTeam] = useState<string>('');
  // const [battingPlayers, setBattingPlayers] = useState<string[]>([]);
  // const [selectedBatters, setSelectedBatters] = useState<string[]>([]);
  // const [showBattersModal, setShowBattersModal] = useState(false);
  // const [bowlingPlayers, setBowlingPlayers] = useState<string[]>([]);
  // const [selectedBowler, setSelectedBowler] = useState<string>('');
  // const [showBowlerModal, setShowBowlerModal] = useState(false);


  const handleUpdateBall = () => {
    if (!selectedBall) return;

    let { runs, wickets, balls } = currentTeam === teamAStr ? teamAStats : teamBStats;

    if (selectedBall === 'W') {
      wickets += 1;
      balls += 1;
    } else if (selectedBall === '.' || selectedBall === '0') {
      balls += 1;
    } else if (selectedBall.startsWith('Wd')) {
      const extra = parseInt(selectedBall[0]) || 1;
      runs += extra;
      // no ball counted
    } else if (selectedBall.includes('+Wd')) {
      const extra = parseInt(selectedBall[0]) + 1;
      runs += extra;
      // no ball counted
    } else if (selectedBall.includes('NB')) {
      const extra = parseInt(selectedBall) || 1;
      runs += extra;
    } else if (selectedBall.includes('B')) {
      const bye = parseInt(selectedBall);
      runs += bye;
      balls += 1;
    } else if (selectedBall.includes('LB')) {
      const lb = parseInt(selectedBall);
      runs += lb;
      balls += 1;
    } else {
      // Regular run
      const run = parseInt(selectedBall);
      if (!isNaN(run)) {
        runs += run;
        balls += 1;
      }
    }

    // Update team stats based on the current team
    if (currentTeam === teamAStr) {
      setTeamAStats({ runs, wickets, balls });
    } else {
      setTeamBStats({ runs, wickets, balls });
    }


    // Check if innings should end
    const maxBalls = Number(overs) * 6; // Max balls for the innings
    const totalWickets = Number(noOfPlayers) - 1;

    if (isSecondInnings) {
      const target = currentTeam === teamAStr ? teamBStats.runs : teamAStats.runs;

      // ✅ Winning condition
      if (runs > target) {
        alert(`${currentTeam} won the match!`);
        setModalVisible(false);
        return;
      }

      // ❌ Losing condition - All Out or Overs Ended
      if (wickets >= totalWickets || balls >= maxBalls) {
        if (runs === target) {
          alert(`Match tied!`);
        } else {
          const winner = currentTeam === teamAStr ? teamBStr : teamAStr;
          alert(`${winner} won the match!`);
        }
        setModalVisible(false);
        return;
      }
    }

    if (balls >= maxBalls || wickets >= totalWickets) {
      // End innings condition
      if (isFirstInnings) {
        // Switch to second innings
        setIsFirstInnings(false);
        setIsSecondInnings(true);
        setCurrentTeam(currentTeam === teamAStr ? teamBStr : teamAStr)
        alert('First innings ended. Now batting: ' + battingFirst === teamAStr ? teamBStr : teamAStr)

        setModalVisible(false);
      } else {
        alert('Match Ended');
      }
    } else {
      setModalVisible(false);
      setSelectedBall('');
      setSubOptions([]);
    }
  };



  const handleBallOption = (opt: string) => {
    const optMap: Record<string, string[]> = {
      'More': ['7', '8', '9', '10'],
      'Bye': ['1B', '2B', '3B', '4B', '5B', '6B', '7B'],
      'LB': ['1LB', '2LB', '3LB', '4LB', '5LB', '6LB', '7LB'],
      'Wide': ['Wd', '1+Wd', '2+Wd', '3+Wd', '4+Wd', '5+Wd', '6+Wd'],
      'NB': ['1NB', '2NB', '3NB', '4NB', '5NB', '6NB'],
    };

    if (optMap[opt]) {
      setSubOptions(optMap[opt]);
    } else {
      setSelectedBall(opt);
      setSubOptions([]);
    }
  };

  const handleBallSelection = (option: string) => {
    setSelectedBall(option);
  };


  const handleToss = () => {
    setTossModalVisible(false)
    setTossResult(true)

    if (tossDecision === 'Bat') {
      setCurrentTeam(tossWinner); // Batting team is the toss winner
      setBattingFirst(tossWinner)
    } else {
      setCurrentTeam(tossWinner === teamAStr ? teamBStr : teamAStr); // The non-toss winner starts batting
      setBattingFirst(tossWinner === teamAStr ? teamBStr : teamAStr);
    }
    // console.log("Current: ", currentTeam)

    // if (tossDecision === 'Bat') {
    //   setBattingTeam(tossWinner);
    //   setBowlingTeam(tossWinner === teamA ? teamB as string : teamA as string);
    // } else {
    //   setBowlingTeam(tossWinner);
    //   setBattingTeam(tossWinner === teamA ? teamB as string : teamA as string);
    // }

    // setBattingPlayers(tossDecision === 'Bat' ? parsedPlayersA : parsedPlayersB);
    // setBowlingPlayers(tossDecision === 'Bat' ? parsedPlayersB : parsedPlayersA);
    // setShowBattersModal(true);
  }

  const Scorecard = () => {
    const first = battingFirst === teamAStr ? teamAStats : teamBStats;
    const second = battingFirst === teamAStr ? teamBStats : teamAStats;
    const secondTeamName = battingFirst === teamAStr ? teamBStr : teamAStr;

    const formatOvers = (balls: number) => {
      const overs = Math.floor(balls / 6);
      const rem = balls % 6;
      return `${overs}.${rem}`;
    };

    const teamAStatsText = `${first.runs}/${first.wickets}`;
    const teamAOverText = `(${formatOvers(first.balls)})`;

    const teamBStatsText = isFirstInnings ? 'Yet to Bat' : `${second.runs}/${second.wickets}`;
    const teamBOverText = isFirstInnings ? '' : `(${formatOvers(second.balls)}/${formatOvers(first.balls)})`;

    const target = first.runs + 1;

    return (
      <View className="bg-white p-4 rounded-xl my-4 shadow-md">
        <View className="flex-row justify-between items-center">
          {/* First Team */}
          <View className="flex-1 items-center">
            {/* <Image source={first.flag} className="w-10 h-6 mb-1" resizeMode="contain" /> */}
            <Text className="text-lg font-bold">{battingFirst}</Text>
            <Text className="text-xl font-semibold">{teamAStatsText}</Text>
            <Text className="text-sm text-gray-500">{teamAOverText}</Text>
          </View>

          {/* Spacer */}
          <View className="w-6" />

          {/* Second Team */}
          <View className="flex-1 items-center">
            {/* <Image source={second.flag} className="w-10 h-6 mb-1" resizeMode="contain" /> */}
            <Text className="text-lg font-bold">{secondTeamName}</Text>
            <Text className="text-xl font-semibold">{teamBStatsText}</Text>
            {!isFirstInnings && (
              <>
                <Text className="text-sm text-gray-500">{teamBOverText}</Text>
                <Text className="text-xs text-gray-500 mt-1">Target {target}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (

    <View className="flex-1 bg-white px-4 py-6">
      {tossModalVisible && (
        <Modal visible={tossModalVisible} transparent animationType="slide">
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
            <View className="bg-white p-6 rounded-xl w-full">
              <Text className="text-lg font-bold mb-3">Toss Result</Text>

              <Text className="mb-1">Who won the toss?</Text>
              <TouchableOpacity onPress={() => setTossWinner(teamA as string)} className={`p-2 rounded-md mb-2 ${tossWinner === teamA ? 'bg-blue-300' : 'bg-gray-200'}`}>
                <Text>{teamA}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTossWinner(teamB as string)} className={`p-2 rounded-md mb-2 ${tossWinner === teamB ? 'bg-blue-300' : 'bg-gray-200'}`}>
                <Text>{teamB}</Text>
              </TouchableOpacity>

              <Text className="mt-2 mb-1">What did they choose?</Text>
              <TouchableOpacity onPress={() => setTossDecision('Bat')} className={`p-2 rounded-md mb-2 ${tossDecision === 'Bat' ? 'bg-blue-300' : 'bg-gray-200'}`}>
                <Text>Bat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTossDecision('Bowl')} className={`p-2 rounded-md mb-2 ${tossDecision === 'Bowl' ? 'bg-blue-300' : 'bg-gray-200'}`}>
                <Text>Bowl</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!tossWinner || !tossDecision}
                className="bg-green-600 px-4 py-2 rounded-lg mt-4"
                onPress={() => handleToss()}
              >
                <Text className="text-white font-semibold text-center">Confirm Toss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}


      <Text className="text-2xl font-bold mb-4 text-center text-black">
        {teamA} vs {teamB}
      </Text>
      {
        tossResult ? (
          <Text className={`text-2xl font-bold mb-4 text-center text-green-700`}>
            {tossWinner} has won the toss and decided to {tossDecision} first.
          </Text>
        ) : (
          <Text className={`text-2xl font-bold mb-4 text-center text-red-700`}>
            Toss Pending...
          </Text>
        )
      }

      <Scorecard />
      {/* Select two batters */}
      {/* <Modal visible={showBattersModal} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
          <View className="bg-white p-6 rounded-xl w-full">
            <Text className="text-lg font-bold mb-3">Select 2 Batters</Text>
            {battingPlayers.map((player, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (!selectedBatters.includes(player)) {
                    const updated = [...selectedBatters, player];
                    if (updated.length <= 2) setSelectedBatters(updated);
                  }
                }}
                className={`p-2 rounded-md mb-2 ${selectedBatters.includes(player) ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
              >
                <Text>{player}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              disabled={selectedBatters.length !== 2}
              onPress={() => {
                setShowBattersModal(false);
                setShowBowlerModal(true); // Show bowler picker next
              }}
              className="bg-green-600 px-4 py-2 rounded-lg mt-4"
            >
              <Text className="text-white font-semibold text-center">Confirm Batters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      {/* Select Bowler */}
      {/* <Modal visible={showBowlerModal} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
          <View className="bg-white p-6 rounded-xl w-full">
            <Text className="text-lg font-bold mb-3">Select Bowler</Text>
            {bowlingPlayers.map((player, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedBowler(player)}
                className={`p-2 rounded-md mb-2 ${selectedBowler === player ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
              >
                <Text>{player}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              disabled={!selectedBowler}
              onPress={() => {
                setShowBowlerModal(false);
              }}
              className="bg-green-600 px-4 py-2 rounded-lg mt-4"
            >
              <Text className="text-white font-semibold text-center">Confirm Bowler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      {/* Update Ball Modal */}
      <TouchableOpacity
        className="mt-6 bg-blue-600 p-4 rounded-xl"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Update Ball
        </Text>
      </TouchableOpacity>

      {/* Ball Input Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
          <View className="bg-white p-4 rounded-xl w-full max-h-[90%]">
            <Text className="text-lg font-bold mb-3">Select Ball Result</Text>

            {/* Main Options */}
            <View className="flex-row flex-wrap justify-center gap-2">
              {['1', '2', '3', '4', '5', '6', '.', 'W', 'Wide', 'NB', 'Bye', 'LB', 'More'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  className={`px-4 py-2 rounded-lg ${selectedBall === opt ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onPress={() => handleBallOption(opt)}
                >
                  <Text className={`font-semibold ${selectedBall === opt ? 'text-white' : 'text-black'}`}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sub Options */}
            {subOptions.length > 0 && (
              <>
                <Text className="mt-4 font-semibold text-center">More Options</Text>
                <View className="flex-row flex-wrap justify-center gap-2 mt-2">
                  {subOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      className={`px-4 py-2 rounded-lg ${selectedBall === opt ? 'bg-blue-500' : 'bg-yellow-300'}`}
                      onPress={() => handleBallSelection(opt)}
                    >
                      <Text className={`font-semibold ${selectedBall === opt ? 'text-white' : 'text-black'}`}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                className="bg-red-600 px-4 py-2 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                  setSubOptions([]);
                }}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 px-4 py-2 rounded-lg"
                onPress={handleUpdateBall}
              >
                <Text className="text-white font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}