import { GameContext } from '@hypnos/web/network';
import { Box, Button, Loader, Modal, Stack, Text } from '@mantine/core';
import { RoundPhase } from 'libs/web/network/src/lib/types';
import { sx } from 'libs/web/ui-design-system/src/lib/buttonSX';
import { useContext, useEffect, useState } from 'react';
import useScreenOrientation from 'react-hook-screen-orientation';
import { useNavigate } from 'react-router-dom';
import { Forgery } from './phases/Forgery';
import { GameOver } from './phases/GameOver';
import { PhrasePhase } from './phases/Phrase';
import { Presentation } from './phases/presentation/Presentation';
import { VotingPhase } from './phases/Voting';

import { AiOutlineRotateLeft } from 'react-icons/ai';
import { useAnimationControls, motion } from 'framer-motion';

/* eslint-disable-next-line */
export interface GameProps {}

export function Game(props: GameProps) {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  const [overlayShown, setOverlayShown] = useState<boolean>(false);

  const screenOrientation = useScreenOrientation();
  const iconControls = useAnimationControls();

  const animateIcon = async () => {
    console.log('Animationg');
    await iconControls.set({ rotate: 90 });
    await iconControls.start({ rotate: 0 });
  };

  useEffect(() => {
    animateIcon();
  }, [screenOrientation]);

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
            <Button sx={sx} onClick={() => navigate('/game')}>
              Exit to menu
            </Button>
          </Stack>
        </Modal>
      )}
      {(screenOrientation === 'portrait-primary' ||
        screenOrientation === 'portrait-secondary') && (
        <Modal
          color="black"
          zIndex={999}
          overlayBlur={3}
          centered
          withCloseButton={false}
          opened={true}
          onClose={() => false}
        >
          <Stack align="center">
            <Text align="center">Rotate your device for better experience</Text>
            <motion.div
              animate={iconControls}
              initial={{ rotate: 90 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <AiOutlineRotateLeft size={30} />
            </motion.div>
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
