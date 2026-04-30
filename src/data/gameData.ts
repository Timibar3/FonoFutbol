export const GAME_DATA: Record<string, Record<string, string[]>> = {
  nivel_1: {
    a: ['ala', 'auto'],
    e: ['elefante', 'estrella'],
    i: ['isla', 'iguana'],
  },
  nivel_2: {
    m: ['mano', 'mesa'],
    p: ['pato', 'pelota'],
    s: ['sol', 'sapo'],
    t: ['taza', 'tigre'],
  },
  nivel_3: {
    b: ['boca', 'bola'],
  },
};

// Distractor words — filtered at runtime to exclude words starting with current letter
export const DISTRACTOR_WORDS = [
  'nube', 'flor', 'luna', 'casa', 'gato', 'dedo', 'roca', 'vaca',
  'leña', 'kilo', 'hoja', 'cero', 'zumo', 'queso', 'yema', 'foca',
  'dado', 'lupa', 'nido', 'cielo', 'diez', 'hacha', 'fideo', 'rueda',
  'vela', 'nieve', 'zorro', 'chico', 'llave', 'ducha', 'yate', 'huevo',
  'globo', 'ratón', 'cajón', 'número', 'diente', 'cuna', 'lluvia', 'cohete',
];
