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

export function useLongPress(
  // callback that is invoked at the specified duration or `onEndLongPress`
  callback: () => any,
  // long press duration in milliseconds
  ms = 300
) {
  // used to persist the timer state
  // non zero values means the value has never been fired before
  const timerRef = useRef<number>(0);

  // clear timed callback
  const endTimer = () => {
    clearTimeout(timerRef.current || 0);
    timerRef.current = 0;
  };

  // init timer
  const onStartLongPress = useCallback(() => {
    // stop any previously set timers
    endTimer();

    // set new timeout
    timerRef.current = window.setTimeout(() => {
      callback();
      endTimer();
    }, ms);
  }, [callback, ms]);

  // determine to end timer early and invoke the callback or do nothing
  const onEndLongPress = useCallback(() => {
    // run the callback fn the timer hasn't gone off yet (non zero)
    if (timerRef.current) {
      endTimer();
      callback();
    }
  }, [callback]);

  return [onStartLongPress, onEndLongPress, endTimer];
}
