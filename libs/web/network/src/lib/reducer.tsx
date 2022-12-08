import { color } from '@hypnos/web/ui-design-system';
import { getSafeId } from '@mantine/utils';
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
        players: [
          ...state.players,
          { ...player, color: color(state.players.length + 1) },
        ],
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
        cards: cards ?? state.cards,

        round: {
          currentPlayerSID: getNextSID(state),
          roundPhase: RoundPhase.PHRASE,
          playerData: [],
        },
      };
    }
  }
};

const getNextSID = (state: GameEntity) => {
  const nPlayers = state.players.length;
  const lastIndx =
    state.players.findIndex(
      (p) => p.socketId === state.round?.currentPlayerSID
    ) ?? Math.floor(Math.random() * nPlayers);

  return state.players[(lastIndx + 1) % nPlayers].socketId;
};
