import { GameEvents, RoomEvents } from '@hypnos/shared/gameevents';
import { Box, Button, Grid, Group, Stack, Text } from '@mantine/core';
import { GameContext } from 'libs/web/network/src/lib/web-network';
import React, { useLayoutEffect } from 'react';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io';

/* eslint-disable-next-line */
export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const [searchParams] = useSearchParams();
  const [roomCode] = useState(searchParams.get('roomId'));
  const navigate = useNavigate();

  const context = useContext(GameContext);

  const handleGameStart = () => {
    if (!context) return;
    const [state] = context;

    (state.me.socket as Socket).emit(RoomEvents.gamestart, state.roomCode);
  };

  useEffect(() => {
    if (!context) return;

    const [state] = context;

    if (!state.me.player.socketId) {
      roomCode ? navigate(`/?roomId=${roomCode}`) : navigate('/');
      return;
    }

    const socket = state.me.socket as Socket;

    if (roomCode) {
      socket.emit(
        RoomEvents.joinroom,
        roomCode,
        state.me.player,
        (error: number) => {
          navigate(`/?e=${error}`);
        }
      );
    }

    console.log(state);
  }, [roomCode]);

  return (
    <Grid justify="center" sx={{ height: '100vh' }}>
      <Grid.Col>
        <Stack justify="space-between" sx={{ height: '100%' }}>
          <Box>
            <Stack align={'center'} spacing={0}>
              <Text>Room code is:</Text>
              <Text size={40} color="teal">
                {roomCode}
              </Text>
              <Button onClick={() => console.log(context?.[0])}>
                Log the state
              </Button>
            </Stack>

            <Stack mx={16} spacing={4}>
              <Text>Connected players:</Text>
              {
                <Group position="apart">
                  <Text>
                    {context?.[0].players.find((p) => p.isMaster)?.name}
                  </Text>
                  <Text>Master</Text>
                </Group>
              }
              {context?.[0].players
                .filter((p) => !p.isMaster)
                .map((player, key) => {
                  return (
                    <Group position="apart" key={key}>
                      <Text>{player.name}</Text>
                    </Group>
                  );
                })}
            </Stack>
          </Box>

          <Stack align="center" mb={50}>
            {context?.[0].me.player.isMaster && (
              <Button onClick={handleGameStart}>Start game!</Button>
            )}
          </Stack>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default Lobby;
