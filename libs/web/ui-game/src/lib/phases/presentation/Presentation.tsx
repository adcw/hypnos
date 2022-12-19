import { PresentationPhaseEvents } from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import { Center, Group, Stack, Text } from '@mantine/core';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { Card } from '@hypnos/web/ui-game-controls';
import { motion, useAnimationControls } from 'framer-motion';
import {
  ActionType,
  GameEntity,
  RoundPhase,
} from 'libs/web/network/src/lib/types';
import { ShowPoints } from './ShowPoints';
import { useMediaQuery } from '@mantine/hooks';

export const MAX_POINTS = 30;

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

  const isMobile = useMediaQuery('(max-width: 900px)');
  const [canContinue, setCanContinue] = useState(true);

  const notifyNextScene = () => {
    if (!canContinue || !context) return;

    const [state, dispatch] = context;

    if (!state.me.player.isMaster) return;

    const areCardsSufficient = cardSufficient();
    const areMaxPointsReached = maxPointsReached();

    if (cardIndex === context?.[0].players.length) {
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

          round:
            !areCardsSufficient || areMaxPointsReached
              ? {
                  ...state.round,
                  roundPhase: RoundPhase.GAME_OVER,
                }
              : state.round,
        } as GameEntity,
      });

      areCardsSufficient &&
        !areMaxPointsReached &&
        dispatch({ type: ActionType.initRound, payload: null });

      return;
    }

    (state.me.socket as Socket).emit(
      PresentationPhaseEvents.setScene,
      context[0].roomCode,
      cardIndex === null ? 0 : cardIndex + 1
    );
  };

  const cardSufficient = () => {
    return !context?.[0].players.find((p) => p.cards.length == 1);
  };

  const maxPointsReached = () => {
    return !!context?.[0].players.find((p) => {
      const player = data.find((pd) => pd.ownerSID === p.socketId);
      return (
        (p.points ?? 0) +
          (player?.forgeryPoints ?? 0) +
          (player?.guessPoints ?? 0) +
          (player?.narrationPoints ?? 0) >=
        MAX_POINTS
      );
    });
  };

  const handleNextScene = async (index: number) => {
    setCanContinue(false);

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

      setCanContinue(true);
    };

    animate();
  }, [cardIndex]);

  useEvent(PresentationPhaseEvents.setScene, handleNextScene);

  return (
    <Center>
      <Stack justify="center" align="center" sx={{ height: '100vh' }}>
        {cardIndex === null && !context?.[0].me.player.isMaster && (
          <Center>
            <Text color="dimmed">Waiting for master to start presentation</Text>
          </Center>
        )}

        {cardIndex !== null &&
          cardIndex < (context?.[0].players.length ?? 0) && (
            <Group>
              <Stack>
                <motion.div
                  initial={{ y: '-1000px' }}
                  animate={nicknameControls}
                >
                  <Group spacing="xs" align="center">
                    {isFinal ? (
                      <Text size={18}>The actual card:</Text>
                    ) : (
                      <Text>Card from</Text>
                    )}
                    <Text size={18} variant="gradient">
                      {
                        context?.[0].players.find(
                          (p) => p.socketId === currentRecord?.ownerSID
                        )?.name
                      }
                    </Text>
                  </Group>
                </motion.div>
                <motion.div initial={{ y: '-1000px' }} animate={cardControls}>
                  <Card
                    src={currentRecord?.card ?? ''}
                    width={isMobile ? 120 : undefined}
                    height={isMobile ? 180 : undefined}
                  />
                </motion.div>
              </Stack>

              <Stack>
                <motion.div initial={{ y: '-1000px' }} animate={votesControls}>
                  <Text>Votes on this card:</Text>
                  {currentRecord && currentRecord?.votes.length > 0 ? (
                    currentRecord?.votes.map((vote, i) => {
                      const player = context?.[0].players.find(
                        (p) => p.socketId === vote.playerSID
                      );
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                        >
                          <Group>
                            <Text color={player?.color}>{player?.name}</Text>
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

        {context?.[0].me.player.isMaster ? (
          <Center
            sx={{ minHeight: '50px', cursor: 'pointer' }}
            onClick={notifyNextScene}
          >
            <motion.div initial={{ opacity: 0 }} animate={continueControls}>
              <Text sx={{ fontStyle: 'italic' }} color={'dimmed'} size="md">
                {cardIndex === null ? 'Tap to start' : 'Tap to continue'}
              </Text>
            </motion.div>
          </Center>
        ) : (
          <Center sx={{ minHeight: '50px' }}>
            <></>
          </Center>
        )}
      </Stack>
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
              ?.votedCardUrl === actualCard ||
            (player.votedCardUrl !== undefined &&
              !playerData.find((pd) => pd.votedCardUrl === actualCard))
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
