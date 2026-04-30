import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { PIXEL } from '../src/constants/colors';
import { TournamentManager, WINS_PER_LEVEL } from '../src/engine/TournamentManager';
import { PLAYER_TEAMS, OPPONENT_TEAMS } from '../src/data/teams';
import { PixelJersey } from '../components/PixelJersey';
import { Level } from '../src/types';

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    won: string;
    playerScore: string;
    rivalScore: string;
    level: string;
  }>();

  const playerWon = params.won === '1';
  const playerScore = parseInt(params.playerScore ?? '0', 10);
  const rivalScore = parseInt(params.rivalScore ?? '0', 10);
  const level = (parseInt(params.level ?? '1', 10) || 1) as Level;

  const didRecord = useRef(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [tournamentComplete, setTournamentComplete] = useState(false);

  const emojiScale = useSharedValue(0.4);
  const contentOpacity = useSharedValue(0);

  const tournament = TournamentManager.getState();
  const playerTeam = PLAYER_TEAMS[tournament.selectedTeamId ?? 0];
  const opponent = OPPONENT_TEAMS[level];

  useEffect(() => {
    emojiScale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 180 }),
      withSpring(1.0, { damping: 10, stiffness: 160 })
    );
    contentOpacity.value = withTiming(1, { duration: 400 });

    if (playerWon && !didRecord.current) {
      didRecord.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const result = TournamentManager.recordWin();
      setLevelComplete(result.levelComplete);
      setTournamentComplete(result.tournamentComplete);
      if (result.levelComplete && !result.tournamentComplete) {
        TournamentManager.advanceLevel();
      }
    } else if (!playerWon) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const updatedTournament = TournamentManager.getState();
  const currentWins = updatedTournament.winsAtLevel;

  const handleContinue = () => {
    if (tournamentComplete) {
      router.replace('/trophy');
    } else {
      // Same level, next match → skip team selection
      router.replace('/game');
    }
  };

  const handleRetry = () => {
    // Retry same level → skip team selection
    router.replace('/game');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: playerWon ? '#001800' : '#180000' },
      ]}
    >
      <Animated.Text style={[styles.emoji, emojiStyle]}>
        {playerWon ? '🏆' : '😔'}
      </Animated.Text>

      <Text
        style={[
          styles.title,
          { color: playerWon ? PIXEL.correct : PIXEL.wrong },
        ]}
      >
        {playerWon ? '¡GANASTE!' : '¡PERDISTE!'}
      </Text>

      <Animated.View style={[styles.content, contentStyle]}>
        {/* Level complete banner */}
        {levelComplete && !tournamentComplete && (
          <View style={styles.levelBanner}>
            <Text style={styles.levelBannerText}>🎉 ¡NIVEL COMPLETADO! 🎉</Text>
          </View>
        )}

        {/* Score row */}
        <View style={styles.scoreRow}>
          <View style={styles.teamCol}>
            <PixelJersey
              primaryColor={playerTeam.primaryColor}
              secondaryColor={playerTeam.secondaryColor}
              stripePattern={playerTeam.stripePattern}
              size={70}
            />
            <Text style={styles.teamLabel}>{playerTeam.name}</Text>
          </View>

          <View style={styles.finalScoreBox}>
            <Text style={styles.scoreDigit}>{playerScore}</Text>
            <Text style={styles.scoreDash}>-</Text>
            <Text style={styles.scoreDigit}>{rivalScore}</Text>
          </View>

          <View style={styles.teamCol}>
            <PixelJersey
              primaryColor={opponent.primaryColor}
              secondaryColor={opponent.secondaryColor}
              stripePattern={opponent.stripePattern}
              size={70}
            />
            <Text style={styles.teamLabel}>{opponent.name}</Text>
          </View>
        </View>

        {/* Stars progress */}
        {playerWon && !tournamentComplete && (
          <View style={styles.starsSection}>
            <Text style={styles.starsLabel}>
              PROGRESO NIVEL {updatedTournament.currentLevel}
            </Text>
            <View style={styles.starsRow}>
              {Array.from({ length: WINS_PER_LEVEL }).map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.star,
                    i < currentWins && styles.starFilled,
                  ]}
                >
                  {i < currentWins ? '★' : '☆'}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* CTA */}
        {playerWon ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueBtnText}>
              {tournamentComplete
                ? '🏆 VER LA COPA'
                : levelComplete
                ? '▶ SIGUIENTE NIVEL'
                : '▶ SIGUIENTE PARTIDO'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryBtnText}>↺ VOLVER A INTENTAR</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  emoji: {
    fontSize: 88,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  levelBanner: {
    backgroundColor: '#003300',
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  levelBannerText: {
    color: PIXEL.gold,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000099',
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    width: '100%',
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  jerseyImg: {
    width: 70,  // kept for reference — now unused
    height: 70,
  },
  teamLabel: {
    color: PIXEL.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  finalScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PIXEL.black,
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreDigit: {
    color: PIXEL.gold,
    fontSize: 42,
    fontWeight: '900',
    minWidth: 30,
    textAlign: 'center',
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scoreDash: {
    color: PIXEL.white,
    fontSize: 30,
    fontWeight: '900',
  },
  starsSection: {
    alignItems: 'center',
    gap: 8,
  },
  starsLabel: {
    color: PIXEL.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 34,
    color: '#555555',
  },
  starFilled: {
    color: PIXEL.gold,
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  continueBtn: {
    backgroundColor: PIXEL.btnGreen,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 7,
    borderBottomColor: PIXEL.btnGreenDark,
    paddingVertical: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  continueBtnText: {
    color: PIXEL.white,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  retryBtn: {
    backgroundColor: PIXEL.btnRed,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 7,
    borderBottomColor: PIXEL.btnRedDark,
    paddingVertical: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  retryBtnText: {
    color: PIXEL.white,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
