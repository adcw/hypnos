import { CARDS_IN_HANDS } from '@hypnos/shared/constants';
import { GameContext } from '@hypnos/web/network';
import { ActionType, GameEntity } from 'libs/web/network/src/lib/types';
import { useCallback, useContext, useRef } from 'react';

export const useDrawCards = () => {
  const context = useContext(GameContext);

  const draw = () => {
    if (!context) return;
    const [state, dispatch] = context;

    const cards = state.cards;
    const playerhands = state.players.map((p) => {
      const oldhands = p.cards;

      const toTake = CARDS_IN_HANDS - oldhands.length;

      return cards.splice(0, toTake);
    });

    dispatch({
      type: ActionType.setGame,
      payload: {
        ...state,
        cards: cards,
        players: state.players.map((p, i) => ({ ...p, cards: playerhands[i] })),
      } as GameEntity,
    });
  };

  return draw;
};

export const useNextPlayerSID = () => {
  const context = useContext(GameContext);

  const callback: () => string | undefined = () => {
    if (!context) return;
    const [state] = context;

    const prevSID = state.round?.currentPlayerSID;
    const nPlayers = state.players.length;

    if (prevSID) {
      const indx = state.players.findIndex((p) => p.socketId === prevSID);
      if (indx) return state.players[(indx + 1) % nPlayers].socketId;
    }

    return state.players[Math.floor(Math.random() * nPlayers)].socketId;
  };

  return callback;
};
