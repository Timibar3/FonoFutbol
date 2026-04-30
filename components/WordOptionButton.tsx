import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PIXEL } from '../src/constants/colors';
import { WordState } from '../src/types';

interface Props {
  word: string;
  state: WordState;
  onPress: () => void;
  disabled?: boolean;
}

const STATE_STYLE: Record<WordState, { bg: string; bottom: string; top: string }> = {
  idle:    { bg: '#2244AA', bottom: '#112255', top: '#4488FF' },
  correct: { bg: '#00AA33', bottom: '#005511', top: '#00FF66' },
  wrong:   { bg: '#AA2222', bottom: '#551111', top: '#FF4444' },
};

export function WordOptionButton({ word, state, onPress, disabled }: Props) {
  const s = STATE_STYLE[state];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: s.bg,
          borderBottomColor: s.bottom,
          borderTopColor: s.top,
        },
      ]}
    >
      <Text style={styles.word}>{word}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 18,
    borderWidth: 3,
    borderColor: PIXEL.black,
    borderBottomWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  word: {
    fontSize: 16,
    fontWeight: '900',
    color: PIXEL.white,
    letterSpacing: 1,
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
});
