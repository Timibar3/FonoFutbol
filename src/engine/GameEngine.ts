import { GAME_DATA, DISTRACTOR_WORDS } from '../data/gameData';
import { Level, RoundData } from '../types';

const LEVEL_KEYS: Record<Level, string> = {
  1: 'nivel_1',
  2: 'nivel_2',
  3: 'nivel_3',
};

export const GOALS_TO_WIN = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class GameEngine {
  private level: Level;
  private usedLetters = new Set<string>();

  constructor(level: Level) {
    this.level = level;
  }

  generateRound(): RoundData {
    const levelData = GAME_DATA[LEVEL_KEYS[this.level]];
    const allLetters = Object.keys(levelData);
    const available = allLetters.filter((l) => !this.usedLetters.has(l));

    // Cycle: restart when all letters exhausted
    if (available.length === 0) this.usedLetters.clear();
    const pool = available.length > 0 ? available : allLetters;

    const letter = pool[Math.floor(Math.random() * pool.length)];
    this.usedLetters.add(letter);

    const words = levelData[letter];
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // 2 distractors that don't start with the current letter
    const distractors = shuffle(
      DISTRACTOR_WORDS.filter((w) => w[0].toLowerCase() !== letter)
    ).slice(0, 2);

    const options = shuffle([correctWord, ...distractors]);

    return { letter, correctWord, options };
  }

  reset(): void {
    this.usedLetters.clear();
  }
}
