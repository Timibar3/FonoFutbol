import { Level, TeamId } from '../types';

export const WINS_PER_LEVEL = 1;

interface TournamentState {
  currentLevel: Level;
  winsAtLevel: number;
  selectedTeamId: TeamId | null;
  completed: boolean;
}

let _state: TournamentState = {
  currentLevel: 1,
  winsAtLevel: 0,
  selectedTeamId: null,
  completed: false,
};

export const TournamentManager = {
  getState(): Readonly<TournamentState> {
    return { ..._state };
  },

  setTeam(teamId: TeamId): void {
    _state.selectedTeamId = teamId;
  },

  recordWin(): { levelComplete: boolean; tournamentComplete: boolean } {
    _state.winsAtLevel += 1;

    if (_state.winsAtLevel >= WINS_PER_LEVEL) {
      if (_state.currentLevel >= 3) {
        _state.completed = true;
        return { levelComplete: true, tournamentComplete: true };
      }
      return { levelComplete: true, tournamentComplete: false };
    }
    return { levelComplete: false, tournamentComplete: false };
  },

  advanceLevel(): void {
    if (_state.currentLevel < 3) {
      _state.currentLevel = (_state.currentLevel + 1) as Level;
      _state.winsAtLevel = 0;
    }
  },

  reset(): void {
    _state = {
      currentLevel: 1,
      winsAtLevel: 0,
      selectedTeamId: null,
      completed: false,
    };
  },
};
