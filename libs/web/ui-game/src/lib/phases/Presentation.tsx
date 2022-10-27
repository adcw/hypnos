import { PresentationPhaseEvents } from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import {
  Box,
  Center,
  Grid,
  Group,
  JsonInput,
  Stack,
  Text,
} from '@mantine/core';
import arrayShuffle from 'array-shuffle';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { motion } from 'framer-motion';
import { Card } from '@hypnos/web/ui-game-controls';

export const Presentation = () => {
  const context = useContext(GameContext);
  const data = usePresentationData();

  const [cardIndex, setCardIndex] = useState<null | number>(null);

  const currentRecord = cardIndex ? data[cardIndex] : null;
  const isFinal = cardIndex === data.length;

  const notifyNextScene = () => {
    if (cardIndex === context?.[0].players.length) {
      console.log('End');
      return;
    }
    (context?.[0].me.socket as Socket).emit(
      PresentationPhaseEvents.setScene,
      context?.[0].roomCode,
      (cardIndex ?? 0) + 1
    );
  };

  const handleNextScene = (index: number) => {
    setCardIndex(index);
  };

  useEvent(PresentationPhaseEvents.setScene, handleNextScene);

  return (
    <Center sx={{ height: 'calc(100vh - 50px)' }}>
      <Stack justify="center" align="center">
        {!cardIndex && context?.[0].me.player.isMaster ? (
          <Center
            sx={{ minHeight: '100px', cursor: 'pointer' }}
            onClick={notifyNextScene}
          >
            <motion.div initial={{ y: '-501px' }} animate={{ y: '0px' }}>
              <Text sx={{ fontStyle: 'italic' }} color={'dimmed'} size="xl">
                Click to start Presentations
              </Text>
            </motion.div>
          </Center>
        ) : (
          <>
            <Group>
              <Stack>
                <motion.div
                  initial={{ y: '-1000px' }}
                  animate={{ y: '0px' }}
                  transition={{ delay: 1 }}
                >
                  <Stack spacing="xs" align="center">
                    <Text>Card from:</Text>
                    <Text size={30} variant="gradient">
                      {
                        context?.[0].players.find(
                          (p) => p.socketId === currentRecord?.ownerSID
                        )?.name
                      }
                    </Text>
                  </Stack>
                </motion.div>
                <motion.div initial={{ y: '-1000px' }} animate={{ y: '0px' }}>
                  <Card
                    onClick={notifyNextScene}
                    src={currentRecord?.card ?? ''}
                  />
                </motion.div>
              </Stack>

              <Stack>
                <motion.div
                  initial={{ y: '-1000px' }}
                  animate={{ y: '0px' }}
                  transition={{ delay: 2 }}
                >
                  <Text>Votes on this card:</Text>
                  {currentRecord?.votes.map((vote, i) => {
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 + i * 0.2 }}
                      >
                        <Text>
                          {
                            context?.[0].players.find(
                              (p) => p.socketId === vote.playerSID
                            )?.name
                          }
                        </Text>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </Stack>
            </Group>
          </>
        )}
      </Stack>
    </Center>
  );
};

interface PresentationRecord {
  card: string;
  ownerSID: string;
  forgeryPoints: number;
  narrationPoints: number;
  votes: {
    playerSID: string;
    points: number;
  }[];
}

const usePresentationData = () => {
  const [pointObject, setPointObject] = useState<PresentationRecord[]>([]);
  const context = useContext(GameContext);

  useEffect(() => {
    if (!context || !context[0].round) return;

    const playerData = context[0].round.playerData;

    setPointObject(
      playerData
        .sort((a) =>
          a.playerSID === context[0].round?.currentPlayerSID ? 1 : -1
        )
        .map((player) => {
          const votes = playerData.filter(
            (vote) => vote.votedCardUrl === player.ownedCardUrl
          );

          const isNarrator =
            player.playerSID === context[0].round?.currentPlayerSID;

          return {
            card: player.ownedCardUrl,
            ownerSID: player.playerSID,
            forgeryPoints: !isNarrator ? votes.length : 0,
            narrationPoints:
              isNarrator &&
              votes.length > 0 &&
              votes.length < playerData.length - 1
                ? 3
                : 0,
            votes: votes.map((v) => ({ playerSID: v.playerSID, points: 2 })),
          };
        })
    );
  }, [context]);

  return pointObject;
};
