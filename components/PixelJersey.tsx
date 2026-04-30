import React from 'react';
import { View, StyleSheet } from 'react-native';

type StripePattern = 'solid' | 'horizontal' | 'vertical' | 'diagonal' | 'stripes';

interface Props {
  primaryColor: string;
  secondaryColor: string;
  stripePattern?: StripePattern;
  size?: number;
}

export function PixelJersey({
  primaryColor,
  secondaryColor,
  stripePattern = 'solid',
  size = 80,
}: Props) {
  const w = size;
  const h = size * 0.95;

  return (
    <View style={{ width: w, height: h }}>
      {/* Left sleeve */}
      <View
        style={[
          styles.sleeve,
          {
            backgroundColor: primaryColor,
            left: 0,
            top: h * 0.12,
            width: w * 0.22,
            height: h * 0.32,
            transform: [{ rotate: '-8deg' }],
          },
        ]}
      />
      {/* Right sleeve */}
      <View
        style={[
          styles.sleeve,
          {
            backgroundColor: primaryColor,
            right: 0,
            top: h * 0.12,
            width: w * 0.22,
            height: h * 0.32,
            transform: [{ rotate: '8deg' }],
          },
        ]}
      />

      {/* Body */}
      <View
        style={[
          styles.body,
          {
            backgroundColor: primaryColor,
            left: w * 0.18,
            right: w * 0.18,
            top: h * 0.18,
            bottom: 0,
          },
        ]}
      >
        {stripePattern === 'horizontal' && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '35%',
              height: '22%',
              backgroundColor: secondaryColor,
            }}
          />
        )}

        {stripePattern === 'vertical' && (
          <>
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: '18%', width: '18%', backgroundColor: secondaryColor }} />
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: '18%', backgroundColor: secondaryColor }} />
          </>
        )}

        {/* Franjas verticales alternadas (ej. Argentina) */}
        {stripePattern === 'stripes' &&
          Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${i * (100 / 6)}%`,
                width: `${100 / 6}%`,
                backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              }}
            />
          ))}

        {stripePattern === 'diagonal' && (
          <View
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-30%',
              width: '75%',
              height: '150%',
              backgroundColor: secondaryColor,
              transform: [{ rotate: '25deg' }],
            }}
          />
        )}
      </View>

      {/* Collar — usa el color secundario del equipo */}
      <View
        style={[
          styles.collar,
          {
            backgroundColor: secondaryColor,
            top: h * 0.12,
            left: w * 0.35,
            right: w * 0.35,
            height: h * 0.1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sleeve: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#000',
  },
  body: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  collar: {
    position: 'absolute',
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 10,
  },
});
