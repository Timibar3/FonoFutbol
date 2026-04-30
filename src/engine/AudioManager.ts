import { Audio } from 'expo-av';

type LetterKey = 'a' | 'e' | 'i' | 'm' | 'p' | 's' | 't' | 'b';

const LETTER_SOURCES: Record<LetterKey, any> = {
  a: require('../../assets/audio/letras/a.wav'),
  e: require('../../assets/audio/letras/e.wav'),
  i: require('../../assets/audio/letras/i.wav'),
  m: require('../../assets/audio/letras/m.wav'),
  p: require('../../assets/audio/letras/p.wav'),
  s: require('../../assets/audio/letras/s.wav'),
  t: require('../../assets/audio/letras/t.wav'),
  b: require('../../assets/audio/letras/b.wav'),
};

class AudioManagerSingleton {
  private sounds: Partial<Record<LetterKey, Audio.Sound>> = {};
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    await Promise.all(
      (Object.entries(LETTER_SOURCES) as [LetterKey, any][]).map(
        async ([key, src]) => {
          const { sound } = await Audio.Sound.createAsync(src, {
            shouldPlay: false,
            volume: 1.0,
          });
          this.sounds[key] = sound;
        }
      )
    );

    this.initialized = true;
  }

  async playLetter(letter: string): Promise<void> {
    const sound = this.sounds[letter as LetterKey];
    if (!sound) {
      console.warn(`[AudioManager] No sound loaded for letter: "${letter}"`);
      return;
    }
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (err) {
      console.warn('[AudioManager] playLetter error:', err);
    }
  }

  async dispose(): Promise<void> {
    await Promise.all(
      Object.values(this.sounds).map((s) => s?.unloadAsync())
    );
    this.sounds = {};
    this.initialized = false;
  }

  get isReady(): boolean {
    return this.initialized;
  }
}

export const AudioManager = new AudioManagerSingleton();
