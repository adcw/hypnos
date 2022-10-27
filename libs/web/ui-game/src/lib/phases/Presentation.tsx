import { PresentationPhaseEvents } from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import { Box, Center, Grid, JsonInput, Stack, Text } from '@mantine/core';
import arrayShuffle from 'array-shuffle';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const Presentation = () => {
  const context = useContext(GameContext);
  const data = usePresentationData();

  const [cardIndex, setCardIndex] = useState<null | number>(null);

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
            <Text sx={{ fontStyle: 'italic' }} color={'dimmed'} size="xl">
              Click to start Presentation
            </Text>
          </Center>
        ) : (
          <>
            <Text onClick={notifyNextScene}>{cardIndex}</Text>
          </>
        )}

        <Text>{JSON.stringify(data)}</Text>
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
      arrayShuffle(playerData)
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
