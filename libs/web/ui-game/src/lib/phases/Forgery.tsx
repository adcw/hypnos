import {
  ForgeryPhaseEvents,
  VotingPhaseEvents,
} from '@hypnos/shared/gameevents';
import { GameContext } from '@hypnos/web/network';
import { CardDrawer, PlayerList, Card } from '@hypnos/web/ui-game-controls';
import { Button, Center, Grid, Stack, Text } from '@mantine/core';
import { useEvent } from 'libs/web/network/src/lib/hooks';
import {
  ActionType,
  GameEntity,
  PlayerEntity,
} from 'libs/web/network/src/lib/types';
import { sx } from 'libs/web/ui-design-system/src/lib/buttonSX';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Socket } from 'socket.io';
import { useNextPhase } from '../Hooks';

export const Forgery = () => {
  const context = useContext(GameContext);

  const [cardsOpened, setCardsOpened] = useState(false);
  const [card, setCard] = useState<string | null>(null);

  const nextPhase = useNextPhase();

  const handleCardChange = (src: string) => {
    setCard(src);
  };

  const notifySubmit = () => {
    if (!context) return;

    const [state] = context;

    (state.me.socket as Socket).emit(
      ForgeryPhaseEvents.submit,
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
          players: state.players.map((p) =>
            p.socketId === sid
              ? ({
                  ...p,
                  cards: p.cards.filter((c) => c !== card),
                } as PlayerEntity)
              : p
          ),
          round: {
            ...state.round,
            playerData: [
              ...(state.round?.playerData ?? []),
              {
                playerSID: sid,
                ownedCardUrl: card,
              },
            ],
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

  useEvent(ForgeryPhaseEvents.submit, handleSubmit);
  useEvent(ForgeryPhaseEvents.phaseEnd, handlePhaseEnd);

  return (
    <>
      <CardDrawer
        opened={cardsOpened}
        setOpened={setCardsOpened}
        mode={'select'}
        onChange={handleCardChange}
        value={card}
      />
      <Grid m={0}>
        <Grid.Col span={2}>
          <PlayerList
            maxValue={30}
            data={
              context?.[0].players.map((p, key) => ({
                player: p,
                highlight: p.socketId === context[0].me.player.socketId,
                state: context[0].round?.playerData.find(
                  (pp) => pp.playerSID === p.socketId
                )
                  ? 'ready'
                  : 'notready',
              })) ?? []
            }
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Center sx={{ height: '100vh' }}>
            <Stack justify="center" align="center">
              {context &&
              context[0].me.socket.id === context[0].round?.currentPlayerSID ? (
                <Text>{`Wait for other players to choose the most convincing card for your prompt`}</Text>
              ) : (
                <Stack justify="center" align="center">
                  <Text color="teal" size={26}>
                    {context?.[0].round?.phrase}
                  </Text>
                  <Text>Chose a card matching this phrase the best</Text>

                  {card && <Card src={card} />}
                  {!context?.[0].round?.playerData.find(
                    (p) => p.playerSID === context[0].me.player.socketId
                  ) ? (
                    <Button
                      sx={sx}
                      disabled={!prompt || !card}
                      onClick={notifySubmit}
                    >
                      Ready
                    </Button>
                  ) : (
                    <Text>Wait for other players</Text>
                  )}
                </Stack>
              )}
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
};
