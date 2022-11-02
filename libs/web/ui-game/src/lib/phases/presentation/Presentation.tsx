import { PresentationPhaseEvents } from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import {
  Affix,
  Box,
  BoxProps,
  Button,
  Center,
  Grid,
  Group,
  JsonInput,
  Stack,
  StackProps,
  Text,
} from '@mantine/core';
import arrayShuffle from 'array-shuffle';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { motion, useAnimationControls } from 'framer-motion';
import { Card } from '@hypnos/web/ui-game-controls';
import { ActionType, GameEntity } from 'libs/web/network/src/lib/types';
import { ShowPoints } from './ShowPoints';

export const Presentation = () => {
  const context = useContext(GameContext);
  const data = usePresentationData();

  const [cardIndex, setCardIndex] = useState<null | number>(null);

  const currentRecord = cardIndex !== null ? data[cardIndex] : null;
  const isFinal = cardIndex === data.length - 1;

  const cardControls = useAnimationControls();
  const nicknameControls = useAnimationControls();
  const votesControls = useAnimationControls();
  const continueControls = useAnimationControls();

  const notifyNextScene = () => {
    if (!context) return;

    const [state, dispatch] = context;

    if (!state.me.player.isMaster) return;

    if (cardIndex === context?.[0].players.length + 1) {
      // dispatch({ type: ActionType.initRound, payload: null });
      console.log('End');

      dispatch({
        type: ActionType.setGame,
        payload: {
          ...state,
          players: state.players.map((p) => {
            const pdata = data.find((d) => d.ownerSID === p.socketId);
            const sum = pdata
              ? pdata?.forgeryPoints +
                pdata?.guessPoints +
                pdata?.narrationPoints
              : 0;

            return {
              ...p,
              points: (p.points ?? 0) + sum,
            };
          }),
        } as GameEntity,
      });

      dispatch({ type: ActionType.initRound, payload: null });

      return;
    }

    (state.me.socket as Socket).emit(
      PresentationPhaseEvents.setScene,
      context?.[0].roomCode,
      cardIndex === null ? 0 : cardIndex + 1
      //  % (state.players.length + 1)
    );
  };

  const handleNextScene = async (index: number) => {
    await continueControls.start({ opacity: 0 });
    await cardControls.start({ y: '-1000px' });
    await nicknameControls.start({ y: '-1000px' });
    await votesControls.start({ y: '-1000px' });

    setCardIndex(index);
  };

  useEffect(() => {
    const animate = async () => {
      await cardControls.start({ y: '0px' });
      await nicknameControls.start({ y: '0px' });
      await votesControls.start({ y: '0px' });
      await continueControls.start({ opacity: 1 });
    };

    animate();
  }, [cardIndex]);

  useEvent(PresentationPhaseEvents.setScene, handleNextScene);

  return (
    <Center sx={{ height: 'calc(100vh - 50px)' }}>
      <Stack justify="center" align="center">
        {cardIndex !== null && cardIndex < (context?.[0].players.length ?? 0) && (
          <Group>
            <Stack>
              <motion.div initial={{ y: '-1000px' }} animate={nicknameControls}>
                <Stack spacing="xs" align="center">
                  {isFinal ? (
                    <Text size={18}>The actual card:</Text>
                  ) : (
                    <Text>Card from:</Text>
                  )}
                  <Text size={30} variant="gradient">
                    {
                      context?.[0].players.find(
                        (p) => p.socketId === currentRecord?.ownerSID
                      )?.name
                    }
                  </Text>
                </Stack>
              </motion.div>
              <motion.div initial={{ y: '-1000px' }} animate={cardControls}>
                <Card
                  src={currentRecord?.card ?? ''}
                  // onClick={notifyNextScene}
                />
              </motion.div>
            </Stack>

            <Stack>
              <motion.div initial={{ y: '-1000px' }} animate={votesControls}>
                <Text>Votes on this card:</Text>
                {currentRecord && currentRecord?.votes.length > 0 ? (
                  currentRecord?.votes.map((vote, i) => {
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <Group>
                          <Text>
                            {
                              context?.[0].players.find(
                                (p) => p.socketId === vote.playerSID
                              )?.name
                            }
                          </Text>
                          {/* <Text>{isFinal ? '' : '+3'}</Text> */}
                        </Group>
                      </motion.div>
                    );
                  })
                ) : (
                  <Text>No votes :/</Text>
                )}
              </motion.div>
            </Stack>
          </Group>
        )}

        {cardIndex !== null &&
          cardIndex === (context?.[0].players.length ?? 0) && (
            <ShowPoints data={data} />
          )}

        {context?.[0].me.player.isMaster && (
          <Center
            sx={{ minHeight: '100px', cursor: 'pointer' }}
            onClick={notifyNextScene}
          >
            <motion.div initial={{ opacity: 0 }} animate={continueControls}>
              <Text sx={{ fontStyle: 'italic' }} color={'dimmed'} size="xl">
                {cardIndex === null ? 'Tap to start' : 'Tap to continue'}
              </Text>
            </motion.div>
          </Center>
        )}
      </Stack>

      <Affix>
        <Text size={10}>
          {JSON.stringify(
            data.map(
              (d) =>
                context?.[0].players.find((p) => p.socketId === d.ownerSID)
                  ?.name
            )
          )}
        </Text>
      </Affix>
    </Center>
  );
};

export interface PresentationRecord {
  card: string;
  ownerSID: string;
  forgeryPoints: number;
  narrationPoints: number;
  guessPoints: number;
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
    playerData.sort((a, b) => {
      if (a.playerSID === context[0].round?.currentPlayerSID) return 1;
      if (b.playerSID === context[0].round?.currentPlayerSID) return -1;
      return (
        (a.votedCardUrl?.charCodeAt(0) ?? 0) -
        (b.votedCardUrl?.charCodeAt(0) ?? 0)
      );
    });

    setPointObject(
      playerData.map((player) => {
        const votes = playerData.filter(
          (vote) => vote.votedCardUrl === player.ownedCardUrl
        );

        const isNarrator =
          player.playerSID === context[0].round?.currentPlayerSID;

        const actualCard = playerData.find(
          (pd) => pd.playerSID === context[0].round?.currentPlayerSID
        )?.ownedCardUrl;

        return {
          card: player.ownedCardUrl,
          ownerSID: player.playerSID,
          forgeryPoints: !isNarrator ? votes.length : 0,

          guessPoints:
            playerData.find((pd) => pd.playerSID === player.playerSID)
              ?.votedCardUrl === actualCard
              ? 2
              : 0,

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
