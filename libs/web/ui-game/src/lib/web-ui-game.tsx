import { GameContext } from '@hypnos/web/network';
import { CardDrawer, PlayerList } from '@hypnos/web/ui-game-controls';
import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Overlay,
  Stack,
  Text,
} from '@mantine/core';
import { RoundPhase } from 'libs/web/network/src/lib/types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Forgery } from './phases/Forgery';
import { GameOver } from './phases/GameOver';
import { PhrasePhase } from './phases/Phrase';
import { Presentation } from './phases/presentation/Presentation';
import { VotingPhase } from './phases/Voting';

/* eslint-disable-next-line */
export interface GameProps {}

export function Game(props: GameProps) {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  const [overlayShown, setOverlayShown] = useState<boolean>(false);

  useEffect(() => {
    if (!context) return;
    console.log(context[0]);

    const [state] = context;

    setOverlayShown(state.players.length < 3);
  }, [context]);

  return (
    <Box sx={{ color: 'white' }}>
      {/* <Button onClick={() => console.log(context?.[0])} /> */}
      {overlayShown && (
        <Modal
          opened={overlayShown}
          onClose={() => false}
          color="black"
          overlayBlur={3}
          centered
          withCloseButton={false}
        >
          <Stack align="center">
            <Text align="center">
              There is too few players to play game! Waiting for people to
              connect
            </Text>
            <Loader variant="dots" />
            <Button onClick={() => navigate('/game')}>Exit to menu</Button>
          </Stack>
        </Modal>
      )}
      {context ? (
        <>
          {context[0].round?.roundPhase === RoundPhase.PHRASE && (
            <PhrasePhase />
          )}
          {context[0].round?.roundPhase === RoundPhase.FORGERY && <Forgery />}
          {context[0].round?.roundPhase === RoundPhase.VOTING && (
            <VotingPhase />
          )}
          {context[0].round?.roundPhase === RoundPhase.PRESENTATION && (
            <Presentation />
          )}
          {context[0].round?.roundPhase === RoundPhase.GAME_OVER && (
            <GameOver />
          )}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Game;
