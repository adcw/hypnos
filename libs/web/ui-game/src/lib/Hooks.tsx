import { GameContext } from '@hypnos/web/network';
import {
  ActionType,
  GameEntity,
  RoundPhase,
} from 'libs/web/network/src/lib/types';
import { useCallback, useContext } from 'react';

export const useNextPhase = () => {
  const context = useContext(GameContext);
  const order: RoundPhase[] = [
    RoundPhase.PHRASE,
    RoundPhase.FORGERY,
    RoundPhase.VOTING,
    RoundPhase.PRESENTATION,
  ];

  const next = useCallback(() => {
    if (!context) return;

    const state = context[0];
    const dispatch = context[1];

    const prevPhase = state.round?.roundPhase;

    if (prevPhase === undefined) return;

    const nextPhase = order[(order.indexOf(prevPhase) + 1) % order.length];

    dispatch({
      type: ActionType.setGame,
      payload: {
        ...state,
        round: { ...state.round, roundPhase: nextPhase },
      } as GameEntity,
    });
  }, [context]);

  return next;
};
