import { GameContext } from '@hypnos/web/network';
import { Center, Grid, JsonInput, Stack, Text } from '@mantine/core';
import arrayShuffle from 'array-shuffle';
import { useContext, useEffect, useState } from 'react';

export const Presentation = () => {
  const context = useContext(GameContext);
  const data = usePresentationData();

  return (
    <Center sx={{ height: 'calc(100vh - 50px)' }}>
      <Stack justify="center" align="center">
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
