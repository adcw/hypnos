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
      const me = game.players.find((p) => p.socketId === state.me.socket.id);
      return {
        ...game,
        me: { ...state.me, player: me ?? state.me.player },
      };
    }

    case ActionType.initRound: {
      const cards = payload as string[];
      return {
        ...state,
        cards: cards,
        round: {
          currentPlayerSID:
            state.players[Math.floor(Math.random() * state.players.length)]
              .socketId,
          roundPhase: RoundPhase.PHRASE,
          playerData: [],
        },
      };
    }
  }
};
