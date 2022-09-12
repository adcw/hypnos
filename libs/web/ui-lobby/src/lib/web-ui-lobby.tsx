import { RoomEvents } from '@hypnos/shared/gameevents';
import { Button, Group, Stack, Text } from '@mantine/core';
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
        (room: any) => {
          console.log(room);
        }
      );
    }

    console.log(state);
  }, [roomCode]);

  return (
    <Stack>
      <Stack align={'center'} spacing={0}>
        <Text>Room code is:</Text>
        <Text size={40} color="teal">
          {roomCode}
        </Text>
        <Button onClick={() => console.log(context?.[0])}>Log the state</Button>
      </Stack>

      <Stack mx={16} spacing={4}>
        <Text>Connected players:</Text>
        {
          <Group position="apart">
            <Text>{context?.[0].players.find((p) => p.isMaster)?.name}</Text>
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
    </Stack>
  );
}

export default Lobby;
