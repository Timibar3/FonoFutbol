import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AudioManager } from '../src/engine/AudioManager';

export default function RootLayout() {
  useEffect(() => {
    AudioManager.init().catch(console.warn);
    return () => {
      AudioManager.dispose().catch(console.warn);
    };
  }, []);

  return (
    <>
      <StatusBar style="light" hidden />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game" options={{ gestureEnabled: false }} />
        <Stack.Screen name="result" options={{ gestureEnabled: false }} />
        <Stack.Screen name="trophy" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
