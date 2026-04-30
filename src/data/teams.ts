import { Team, OpponentTeam } from '../types';

export const PLAYER_TEAMS: Team[] = [
  {
    id: 0,
    name: 'LOS AZULES',
    primaryColor: '#0044CC',
    secondaryColor: '#FFD700',
    stripePattern: 'horizontal',   // azul con banda amarilla horizontal
  },
  {
    id: 1,
    name: 'LOS FRANJAS',
    primaryColor: '#FFFFFF',
    secondaryColor: '#CC0000',
    stripePattern: 'diagonal',     // blanca con banda roja diagonal
  },
  {
    id: 2,
    name: 'LA ACADEMIA',
    primaryColor: '#75AADB',
    secondaryColor: '#FFFFFF',
    stripePattern: 'stripes',      // franjas verticales celeste y blanco
  },
  {
    id: 3,
    name: 'LOS ROJOS',
    primaryColor: '#CC2200',
    secondaryColor: '#FFFFFF',
    stripePattern: 'solid',        // roja lisa con cuello blanco
  },
];

export const OPPONENT_TEAMS: Record<number, OpponentTeam> = {
  1: {
    level: 1,
    name: 'EQUIPO VERDE',
    primaryColor: '#22AA22',
    secondaryColor: '#FFFFFF',
    stripePattern: 'horizontal',
  },
  2: {
    level: 2,
    name: 'EQUIPO AZUL',
    primaryColor: '#2244FF',
    secondaryColor: '#FFFFFF',
    stripePattern: 'vertical',
  },
  3: {
    level: 3,
    name: 'EQUIPO FINAL',
    primaryColor: '#22AA22',
    secondaryColor: '#2244FF',
    stripePattern: 'diagonal',
  },
};
