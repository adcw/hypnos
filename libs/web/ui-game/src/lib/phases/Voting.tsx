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
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Card, PlayerList } from 'libs/web/ui-game-controls/src';
import {
  PhrasePhaseEvents,
  VotingPhaseEvents,
} from '@hypnos/shared/gameevents';
import { Socket } from 'socket.io';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import { ActionType, GameEntity } from 'libs/web/network/src/lib/types';
import { useNextPhase } from '../Hooks';
import { arrayShuffle } from '@hypnos/shared/constants';
import { sx } from 'libs/web/ui-design-system/src/lib/buttonSX';

export interface SubmitPayload {
  cardUrl: string;
}

export const VotingPhase = () => {
  const context = useContext(GameContext);

  const [card, setCard] = useState<string | null>();
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sortedCards = useMemo(
    () => (context ? arrayShuffle(context[0]?.round?.playerData ?? []) : []),
    [mounted]
  );

  const nextPhase = useNextPhase();

  const notifySubmit = () => {
    if (!context) return;

    const [state] = context;

    setSubmitted(true);
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

  const handlePhaseEnd = () => {
    if (!context) return;

    const [state, dispatch] = context;

    if (!state.me.player.isMaster) return;

    dispatch({
      type: ActionType.setGame,
      payload: {
        ...state,
        round: {
          ...state.round,
          roundPhase: nextPhase(),
        },
      } as GameEntity,
    });
  };

  useEvent(VotingPhaseEvents.submit, handleSubmit);
  useEvent(VotingPhaseEvents.phaseEnd, handlePhaseEnd);

  return (
    <Grid m={0}>
      <Grid.Col span={2}>
        <PlayerList
          maxValue={30}
          data={
            context?.[0].players.map((p, key) => ({
              player: p,
              highlight: p.socketId === context[0].me.player.socketId,
              state:
                // p.socketId === context[0].round?.currentPlayerSID
                //   ? 'notready'
                //   : 'none',
                p.socketId === context[0].round?.currentPlayerSID
                  ? 'none'
                  : context[0].round?.playerData.find(
                      (pd) => pd.playerSID === p.socketId
                    )?.votedCardUrl
                  ? 'ready'
                  : 'notready',
            })) ?? []
          }
        />
      </Grid.Col>

      <Grid.Col span={10}>
        <Center sx={{ height: '100vh' }}>
          {context && (
            <Stack align="center" justify="center" sx={{ height: '100vh' }}>
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
                {sortedCards.map((p, k) =>
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
                <Button
                  sx={sx}
                  disabled={!card || submitted}
                  onClick={notifySubmit}
                >
                  Ready
                </Button>
              )}
            </Stack>
          )}
        </Center>
      </Grid.Col>
    </Grid>
  );
};
