import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { PIXEL } from '../src/constants/colors';
import { TournamentManager } from '../src/engine/TournamentManager';

const BG_STARS = ['★', '✦', '⭐', '★', '✦', '★', '⭐', '✦', '★', '✦', '⭐', '★'];

export default function TrophyScreen() {
  const trophyScale = useSharedValue(0.2);
  const trophyRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const starsOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    trophyScale.value = withSequence(
      withSpring(1.3, { damping: 3, stiffness: 150 }),
      withSpring(1.0, { damping: 10, stiffness: 120 })
    );
    trophyRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 350 }),
        withTiming(10, { duration: 350 })
      ),
      -1,
      true
    );

    titleOpacity.value = withTiming(1, { duration: 600 });
    starsOpacity.value = withTiming(1, { duration: 900 });
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const starsStyle = useAnimatedStyle(() => ({ opacity: starsOpacity.value }));

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    TournamentManager.reset();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative background stars */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.bgStars, starsStyle]}>
        {BG_STARS.map((s, i) => (
          <Text
            key={i}
            style={[
              styles.bgStar,
              { opacity: 0.15 + (i % 4) * 0.1, fontSize: 20 + (i % 3) * 12 },
            ]}
          >
            {s}
          </Text>
        ))}
      </Animated.View>

      {/* Trophy */}
      <Animated.Text style={[styles.trophy, trophyStyle]}>🏆</Animated.Text>

      {/* Title */}
      <Animated.View style={[styles.titleGroup, titleStyle]}>
        <Text style={styles.titleMain}>¡CAMPEÓN!</Text>
        <Text style={styles.titleSub}>¡COMPLETASTE EL TORNEO!</Text>
      </Animated.View>

      {/* Stars row */}
      <Animated.View style={[styles.starsRow, starsStyle]}>
        {['★', '★', '★'].map((s, i) => (
          <Text key={i} style={styles.star}>{s}</Text>
        ))}
      </Animated.View>

      {/* Message box */}
      <View style={styles.messageBox}>
        <Text style={styles.message}>
          {'¡APRENDISTE TODOS LOS\nFONEMAS DEL TORNEO!\n¡FELICITACIONES!'}
        </Text>
      </View>

      {/* Restart */}
      <TouchableOpacity
        style={styles.restartBtn}
        onPress={handleRestart}
        activeOpacity={0.8}
      >
        <Text style={styles.restartText}>↺ VOLVER A EMPEZAR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080818',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  bgStars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    padding: 16,
  },
  bgStar: {
    color: PIXEL.gold,
  },
  trophy: {
    fontSize: 100,
  },
  titleGroup: {
    alignItems: 'center',
    gap: 6,
  },
  titleMain: {
    fontSize: 52,
    fontWeight: '900',
    color: PIXEL.gold,
    letterSpacing: 6,
    textAlign: 'center',
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '900',
    color: PIXEL.white,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  star: {
    fontSize: 50,
    color: PIXEL.gold,
    textShadowColor: '#CC6600',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  messageBox: {
    backgroundColor: '#110022',
    borderWidth: 3,
    borderColor: PIXEL.gold,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  message: {
    color: PIXEL.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  restartBtn: {
    backgroundColor: PIXEL.gold,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 7,
    borderBottomColor: PIXEL.goldDark,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  restartText: {
    color: PIXEL.black,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
});
