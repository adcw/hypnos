import { GameContext } from '@hypnos/web/network';
import { CardDrawer, PlayerList } from '@hypnos/web/ui-game-controls';
import { Box, Button, Card, Group, Text } from '@mantine/core';
import { RoundPhase } from 'libs/web/network/src/lib/types';
import { useContext, useEffect, useState } from 'react';
import { Forgery } from './phases/Forgery';
import { PhrasePhase } from './phases/Phrase';

/* eslint-disable-next-line */
export interface GameProps {}

export function Game(props: GameProps) {
  const context = useContext(GameContext);

  useEffect(() => {
    if (context) {
      console.log(context[0]);
    }
  }, [context]);

  return (
    <Box sx={{ color: 'white' }}>
      <Button onClick={() => console.log(context?.[0])} />
      {context ? (
        <>
          {context[0].round?.roundPhase === RoundPhase.PHRASE && (
            <PhrasePhase />
          )}
          {context[0].round?.roundPhase === RoundPhase.FORGERY && <Forgery />}
          {context[0].round?.roundPhase === RoundPhase.VOTING && (
            <Text>3. Voting</Text>
          )}
          {context[0].round?.roundPhase === RoundPhase.PRESENTATION && (
            <Text>4. Presentation</Text>
          )}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Game;
