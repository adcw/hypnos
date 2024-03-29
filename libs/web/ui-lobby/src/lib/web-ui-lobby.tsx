import { PhrasePhaseEvents, RoomEvents } from '@hypnos/shared/gameevents';
import { color, XCard, XNickname } from '@hypnos/web/ui-design-system';
import { Box, Button, Center, Grid, Group, Stack, Text } from '@mantine/core';
import { GameContext } from 'libs/web/network/src/lib/web-network';
import React, { useLayoutEffect } from 'react';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io';

import { GiCrown } from 'react-icons/gi';
import { ActionType } from 'libs/web/network/src/lib/types';
import { sx } from 'libs/web/ui-design-system/src/lib/buttonSX';

/* eslint-disable-next-line */
export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const [searchParams] = useSearchParams();
  const [roomCode] = useState(searchParams.get('roomId'));
  const navigate = useNavigate();

  const context = useContext(GameContext);

  const handleGameStart = () => {
    if (!context) return;
    const [state, dispatch] = context;

    (state.me.socket as Socket).emit(
      RoomEvents.fetchCards,
      (cards: string[]) => {
        dispatch({ type: ActionType.initRound, payload: cards });
      }
    );
  };

  useEffect(() => {
    if (!context) return;

    const [state] = context;

    if (!state.me.player.socketId) {
      roomCode ? navigate(`/game?roomId=${roomCode}`) : navigate('/game');
      return;
    }

    const socket = state.me.socket as Socket;

    if (roomCode) {
      socket.emit(
        RoomEvents.joinroom,
        roomCode,
        state.me.player,
        (error: number) => {
          navigate(`/game?e=${error}`);
        }
      );
    }

    console.log(state);
  }, [roomCode]);

  return (
    <Grid justify="center" sx={{ height: '100vh' }} m={0}>
      <Grid.Col>
        <Stack justify="space-between" sx={{ height: '100%' }}>
          <Box>
            <Stack align={'center'} spacing={0}>
              <Text color="dimmed">Room code is:</Text>
              <Text size={40} color="teal">
                {roomCode}
              </Text>
              {/* <Button sx={sx} onClick={() => console.log(context?.[0])}>
                Log the state
              </Button> */}
            </Stack>

            <Center>
              <XCard mt="lg" sx={{ width: '400px' }}>
                <Stack mx={16} spacing={4}>
                  <Text>Connected players:</Text>
                  {[0].map(() => {
                    const player = context?.[0].players.find((p) => p.isMaster);
                    return (
                      <Group position="apart" key={0}>
                        <Group spacing={4}>
                          <XNickname
                            value={player?.name}
                            color={player?.color}
                            highlight={
                              context?.[0].players.find((p) => p.isMaster)
                                ?.socketId === context?.[0].me.socket.id
                            }
                          />
                        </Group>
                        <GiCrown color="#666666" />
                      </Group>
                    );
                  })}
                  {context?.[0].players
                    .filter((p) => !p.isMaster)
                    .map((player, key) => {
                      return (
                        <Group key={key} position="apart">
                          <XNickname
                            value={player.name}
                            color={player.color}
                            // highlight={
                            //   player.socketId === context[0].me.socket.id
                            // }
                          />
                        </Group>
                      );
                    })}
                </Stack>
              </XCard>
            </Center>
          </Box>

          <Stack align="center" mb={50}>
            {context?.[0].me.player.isMaster && (
              <Button
                onClick={handleGameStart}
                disabled={context[0].players.length < 3}
                sx={sx}
              >
                Start game!
              </Button>
            )}
            {(context?.[0].players.length ?? 0) < 3 && (
              <Text color="dimmed" size={'sm'}>
                Waiting for at least 3 players
              </Text>
            )}
          </Stack>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default Lobby;
