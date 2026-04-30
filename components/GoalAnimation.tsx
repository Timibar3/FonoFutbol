import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { PIXEL } from '../src/constants/colors';

interface Props {
  visible: boolean;
  isPlayerGoal: boolean;
}

export function GoalAnimation({ visible, isPlayerGoal }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      bgOpacity.value = withSequence(
        withTiming(0.55, { duration: 150 }),
        withTiming(0.4, { duration: 900 }),
        withTiming(0, { duration: 350 })
      );
      scale.value = withSequence(
        withSpring(1.15, { damping: 4, stiffness: 220 }),
        withTiming(1.15, { duration: 800 }),
        withTiming(0.4, { duration: 350 })
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(1, { duration: 950 }),
        withTiming(0, { duration: 300 })
      );
    } else {
      opacity.value = 0;
      scale.value = 0.3;
      bgOpacity.value = 0;
    }
  }, [visible]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  const bgColor = isPlayerGoal ? '#00AA33' : '#CC2200';
  const textColor = isPlayerGoal ? '#00FF66' : '#FF4444';
  const label = isPlayerGoal ? '⚽  ¡GOL!' : '😤  ¡GOL RIVAL!';

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, bgStyle, { backgroundColor: bgColor, zIndex: 10 }]}
      />
      <Animated.View
        style={[StyleSheet.absoluteFill, textStyle, styles.textWrap]}
      >
        <Text style={[styles.goalText, { color: textColor, borderColor: textColor }]}>
          {label}
        </Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  textWrap: {
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 4,
    backgroundColor: '#000000CC',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 4,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
