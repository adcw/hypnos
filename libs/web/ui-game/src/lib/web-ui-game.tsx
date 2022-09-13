import { GameContext } from '@hypnos/web/network';
import { Text } from '@mantine/core';
import { useContext, useEffect } from 'react';

/* eslint-disable-next-line */
export interface GameProps {}

export function Game(props: GameProps) {
  const context = useContext(GameContext);

  useEffect(() => {
    if (context) {
      console.log(context[0]);
    }
  }, [context]);

  return <Text>Game</Text>;
}

export default Game;
