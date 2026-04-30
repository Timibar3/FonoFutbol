import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { PIXEL } from '../src/constants/colors';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  darkColor?: string;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export function PixelButton({
  label,
  onPress,
  color = PIXEL.btnBlue,
  darkColor = PIXEL.btnBlueDark,
  textColor = PIXEL.white,
  disabled = false,
  style,
  textStyle,
  size = 'md',
}: Props) {
  const sz = SIZE_MAP[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        sz.btn,
        {
          backgroundColor: disabled ? PIXEL.btnGray : color,
          borderBottomColor: disabled ? PIXEL.btnGrayDark : darkColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          sz.label,
          { color: disabled ? '#99999A' : textColor },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const SIZE_MAP = {
  sm: { btn: { paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 3 }, label: { fontSize: 14 } },
  md: { btn: { paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: 5 }, label: { fontSize: 18 } },
  lg: { btn: { paddingVertical: 18, paddingHorizontal: 32, borderBottomWidth: 6 }, label: { fontSize: 22 } },
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 3,
    borderColor: PIXEL.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: PIXEL.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
