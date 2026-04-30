export type Level = 1 | 2 | 3;
export type TeamId = 0 | 1 | 2 | 3;
export type GamePhase = 'playing' | 'scored_player' | 'scored_rival';
export type WordState = 'idle' | 'correct' | 'wrong';

export interface Team {
  id: TeamId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  stripePattern: 'solid' | 'horizontal' | 'vertical' | 'diagonal' | 'stripes';
}

export interface OpponentTeam {
  level: Level;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  stripePattern: 'solid' | 'horizontal' | 'vertical' | 'diagonal';
}

export interface RoundData {
  letter: string;
  correctWord: string;
  options: string[];
}
