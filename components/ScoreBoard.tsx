import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PIXEL } from '../src/constants/colors';
import { PLAYER_TEAMS, OPPONENT_TEAMS } from '../src/data/teams';
import { PixelJersey } from './PixelJersey';

interface Props {
  playerScore: number;
  rivalScore: number;
  teamId: number;
  level: number;
}

export function ScoreBoard({ playerScore, rivalScore, teamId, level }: Props) {
  const player = PLAYER_TEAMS[teamId] ?? PLAYER_TEAMS[0];
  const opponent = OPPONENT_TEAMS[level];

  return (
    <View style={styles.container}>
      <View style={styles.teamSide}>
        <PixelJersey
          primaryColor={player.primaryColor}
          secondaryColor={player.secondaryColor}
          stripePattern={player.stripePattern}
          size={56}
        />
        <Text style={styles.teamName} numberOfLines={1}>{player.name}</Text>
      </View>

      <View style={styles.scoreBox}>
        <Text style={styles.digit}>{playerScore}</Text>
        <Text style={styles.dash}>-</Text>
        <Text style={styles.digit}>{rivalScore}</Text>
      </View>

      <View style={styles.teamSide}>
        <PixelJersey
          primaryColor={opponent.primaryColor}
          secondaryColor={opponent.secondaryColor}
          stripePattern={opponent.stripePattern}
          size={56}
        />
        <Text style={styles.teamName} numberOfLines={1}>{opponent.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PIXEL.scoreBg,
    borderBottomWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  teamSide: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    color: PIXEL.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  digit: {
    color: PIXEL.gold,
    fontSize: 38,
    fontWeight: '900',
    minWidth: 28,
    textAlign: 'center',
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  dash: {
    color: PIXEL.white,
    fontSize: 28,
    fontWeight: '900',
  },
});
