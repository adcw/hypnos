import {
  GameEntity,
  Action,
  ActionType,
  PlayerEntity,
  RoundPhase,
} from './types';

export const reducer = (state: GameEntity, action: Action): GameEntity => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.addPlayer: {
      const player = payload as PlayerEntity;

      return {
        ...state,
        players: [...state.players, player],
      };
    }

    case ActionType.initialize: {
      return {
        ...payload,
      };
    }

    case ActionType.setGame: {
      const game = payload as GameEntity;
      return { ...state, ...game };
    }

    case ActionType.initRound: {
      return {
        ...state,
        round: {
          currentPlayerSID:
            state.players[Math.floor(Math.random() * state.players.length)]
              .socketId,
          roudPhase: RoundPhase.PHRASE,
          playerData: [],
        },
      };
    }
  }
};
