import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PIXEL } from '../src/constants/colors';
import { AudioManager } from '../src/engine/AudioManager';
import { GameEngine, GOALS_TO_WIN } from '../src/engine/GameEngine';
import { TournamentManager } from '../src/engine/TournamentManager';
import { ScoreBoard } from '../components/ScoreBoard';
import { GoalAnimation } from '../components/GoalAnimation';
import { WordOptionButton } from '../components/WordOptionButton';
import { Level, RoundData, WordState, GamePhase } from '../src/types';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const tournament = TournamentManager.getState();
  const level = (tournament.currentLevel as Level) || 1;
  const teamId = tournament.selectedTeamId ?? 0;

  const engineRef = useRef(new GameEngine(level));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [round, setRound] = useState<RoundData>(() => engineRef.current.generateRound());
  const [wordStates, setWordStates] = useState<WordState[]>(['idle', 'idle', 'idle']);
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [locked, setLocked] = useState(false);

  const goToResult = (ps: number, rs: number) => {
    router.replace({
      pathname: '/result',
      params: {
        won: String(ps >= GOALS_TO_WIN ? 1 : 0),
        playerScore: String(ps),
        rivalScore: String(rs),
        level: String(level),
      },
    });
  };

  const handleAnswer = useCallback(
    (word: string) => {
      if (locked) return;
      setLocked(true);

      const isCorrect = word === round.correctWord;

      // Reveal all correct/wrong states
      setWordStates(
        round.options.map((w) => (w === round.correctWord ? 'correct' : 'wrong'))
      );

      let nextPS = playerScore;
      let nextRS = rivalScore;

      if (isCorrect) {
        nextPS = playerScore + 1;
        setPlayerScore(nextPS);
        setPhase('scored_player');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        nextRS = rivalScore + 1;
        setRivalScore(nextRS);
        setPhase('scored_rival');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // After animation delay: advance or finish
      timerRef.current = setTimeout(() => {
        if (nextPS >= GOALS_TO_WIN || nextRS >= GOALS_TO_WIN) {
          goToResult(nextPS, nextRS);
        } else {
          setPhase('playing');
          setWordStates(['idle', 'idle', 'idle']);
          setRound(engineRef.current.generateRound());
          setLocked(false);
        }
      }, 1600);
    },
    [locked, round, playerScore, rivalScore]
  );

  const handleAudio = async () => {
    await AudioManager.playLetter(round.letter);
  };

  const showGoal = phase !== 'playing';
  const isGameOver = playerScore >= GOALS_TO_WIN || rivalScore >= GOALS_TO_WIN;

  return (
    <SafeAreaView style={styles.container}>
      <ScoreBoard
        playerScore={playerScore}
        rivalScore={rivalScore}
        teamId={teamId}
        level={level}
      />

      {/* Field */}
      <View style={styles.field}>
        <View style={styles.fieldMarkings}>
          <View style={styles.centerLine} />
          <View style={styles.centerCircle} />
        </View>

        {/* Level pill */}
        <View style={styles.levelPill}>
          <Text style={styles.levelPillText}>NIVEL {level}</Text>
        </View>

        {/* Audio section */}
        <View style={styles.audioSection}>
          <Text style={styles.prompt}>¿QUÉ LETRA ESCUCHÁS?</Text>

          <TouchableOpacity
            style={styles.audioBtn}
            onPress={handleAudio}
            activeOpacity={0.8}
          >
            <Text style={styles.audioBtnIcon}>🔊</Text>
            <Text style={styles.audioBtnText}>ESCUCHAR</Text>
          </TouchableOpacity>

        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsPrompt}>
            ¿QUÉ PALABRA EMPIEZA CON ESA LETRA?
          </Text>
          <View style={styles.optionsRow}>
            {round.options.map((word, idx) => (
              <WordOptionButton
                key={`${round.letter}-${word}-${idx}`}
                word={word}
                state={wordStates[idx]}
                onPress={() => handleAnswer(word)}
                disabled={locked || isGameOver}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Goal overlay */}
      <GoalAnimation
        visible={showGoal && !isGameOver}
        isPlayerGoal={phase === 'scored_player'}
      />

      {/* Game-over overlay (brief, while navigating) */}
      {isGameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>
            {playerScore >= GOALS_TO_WIN ? '⚽ ¡GANASTE!' : '😤 ¡PERDISTE!'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PIXEL.bgDark,
  },
  field: {
    flex: 1,
    backgroundColor: PIXEL.bgField,
    margin: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF33',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  fieldMarkings: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF22',
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#FFFFFF22',
  },
  levelPill: {
    backgroundColor: '#22004488',
    borderWidth: 2,
    borderColor: PIXEL.gold,
    paddingHorizontal: 16,
    paddingVertical: 4,
    zIndex: 1,
  },
  levelPillText: {
    color: PIXEL.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
  },
  audioSection: {
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  prompt: {
    color: PIXEL.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PIXEL.gold,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 7,
    borderBottomColor: PIXEL.goldDark,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  audioBtnIcon: {
    fontSize: 26,
  },
  audioBtnText: {
    color: PIXEL.black,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  optionsSection: {
    width: '100%',
    gap: 8,
    zIndex: 1,
  },
  optionsPrompt: {
    color: PIXEL.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  optionsRow: {
    flexDirection: 'row',
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000CC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  gameOverText: {
    color: PIXEL.gold,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
});
