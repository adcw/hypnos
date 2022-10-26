import { GameContext } from '@hypnos/web/network';
import {
  Button,
  Center,
  Grid,
  Stack,
  TextInput,
  Text,
  Group,
  Popover,
  Tooltip,
  Box,
} from '@mantine/core';
import { useCallback, useContext, useEffect, useState } from 'react';

import { Card, PlayerList } from 'libs/web/ui-game-controls/src';
import {
  PhrasePhaseEvents,
  VotingPhaseEvents,
} from '@hypnos/shared/gameevents';
import { Socket } from 'socket.io';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { ActionType, GameEntity } from 'libs/web/network/src/lib/types';

export interface SubmitPayload {
  cardUrl: string;
}

export const VotingPhase = () => {
  const context = useContext(GameContext);

  const [card, setCard] = useState<string | null>();

  const notifySubmit = () => {
    if (!context) return;

    const [state] = context;

    (state.me.socket as Socket).emit(
      VotingPhaseEvents.submit,
      state.roomCode,
      card,
      state.me.player.socketId
    );
  };

  const handleSubmit = useCallback(
    (card: string, sid: string) => {
      if (!context) return;

      const [state, dispatch] = context;

      if (!state.me.player.isMaster) return;

      console.log(`${sid} has a card: ${card}`);

      dispatch({
        type: ActionType.setGame,
        payload: {
          ...state,
          round: {
            ...state.round,
            playerData: state.round?.playerData.map((p) =>
              p.playerSID === sid ? { ...p, votedCardUrl: card } : p
            ),
          },
        } as GameEntity,
      });
    },
    [context?.[0]]
  );

  useEvent(VotingPhaseEvents.submit, handleSubmit);

  return (
    <Grid>
      <Grid.Col span={2}>
        <PlayerList
          players={
            context?.[0].players.map((p, key) => ({
              name: p.name ?? '???',
              highlight: p.socketId === context[0].me.player.socketId,
              state:
                p.socketId === context[0].round?.currentPlayerSID
                  ? 'notready'
                  : 'none',
            })) ?? []
          }
        />
      </Grid.Col>

      <Grid.Col span={10}>
        <Center sx={{ height: 'calc(100vh - 24px)' }}>
          {context && (
            <Stack align="center">
              {context[0].me.player.socketId ===
              context[0].round?.currentPlayerSID ? (
                <Text>Waiting for players to guess your card</Text>
              ) : (
                <Text>Try to guess original card</Text>
              )}
              <Text color="teal" size={26}>
                {context[0].round?.phrase ?? '?'}
              </Text>
              <Group>
                {context[0].round?.playerData.map((p, k) =>
                  p.playerSID === context[0].me.player.socketId ? (
                    <Card
                      key={k}
                      src={p.ownedCardUrl ?? ''}
                      disabled
                      text="Your card"
                    />
                  ) : (
                    <Card
                      chosen={p.ownedCardUrl === card}
                      onClick={() => setCard(p.ownedCardUrl)}
                      key={k}
                      src={p.ownedCardUrl ?? ''}
                      disabled={
                        context[0].me.player.socketId ===
                        context[0].round?.currentPlayerSID
                      }
                    />
                  )
                )}
              </Group>
              {context[0].me.player.socketId !==
                context[0].round?.currentPlayerSID && (
                <Button disabled={!card} onClick={notifySubmit}>
                  Submit
                </Button>
              )}
            </Stack>
          )}
        </Center>
      </Grid.Col>
    </Grid>
  );
};
