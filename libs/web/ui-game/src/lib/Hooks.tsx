import { GameContext } from '@hypnos/web/network';
import {
  ActionType,
  GameEntity,
  RoundPhase,
} from 'libs/web/network/src/lib/types';
import { useCallback, useContext, useEffect, useState } from 'react';

export const useNextPhase = () => {
  const context = useContext(GameContext);
  const order: RoundPhase[] = [
    RoundPhase.PHRASE,
    RoundPhase.FORGERY,
    RoundPhase.VOTING,
    RoundPhase.PRESENTATION,
  ];

  return () => {
    if (!context) return;

    const curr = context[0].round?.roundPhase;

    if (curr === undefined) return;
    console.log('Found');

    const n = order[(order.indexOf(curr) + 1) % order.length];
    return n;
  };
};
