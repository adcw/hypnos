import { RoomEvents } from '@hypnos/shared/gameevents';
import { Stack, TextInput, Text, Button, Grid } from '@mantine/core';
import {
  ActionType,
  GameContext,
  GameEntity,
  PlayerEntity,
} from 'libs/web/network/src/lib/web-network';
import { useContext, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

/* eslint-disable-next-line */
export interface MainmenuProps {}

export function MainMenu(props: MainmenuProps) {
  const [searchParams] = useSearchParams();

  const [roomCode, setRoomCode] = useState<string | null>(
    searchParams.get('roomId')
  );
  const [roomCodeValid, setRoomCodeValid] = useState<boolean | undefined>();

  const context = useContext(GameContext);

  const navigate = useNavigate();

  const onJoin = () => {
    if (roomCodeValid && context) {
      const [state, dispatch] = context;

      (state.me.socket as Socket).emit(
        RoomEvents.checkroomexists,
        roomCode,
        (exists: boolean) => {
          if (exists) {
            const player: PlayerEntity = {
              socketId: state.me.socket.id,
              isMaster: false,
            };

            dispatch({
              type: ActionType.initialize,
              payload: {
                cards: [],
                players: [player],
                me: {
                  ...state.me,
                  player: player,
                },
                roomCode: roomCode,
              } as GameEntity,
            });

            navigate(`/lobby?roomId=${roomCode}`);
          }
        }
      );
    }
  };

  const onCreate = () => {
    if (!context) return;

    const [state, dispatch] = context;

    (state.me.socket as Socket).emit(RoomEvents.createrooom);
  };

  useEffect(() => {
    if (!context) return;

    const [state, dispatch] = context;
    const socket = state.me.socket as Socket;

    socket.on(RoomEvents.generatedRoomCode, (code: string) => {
      const player: PlayerEntity = {
        socketId: state.me.socket.id,
        isMaster: true,
      };

      dispatch({
        type: ActionType.initialize,
        payload: {
          cards: [],
          players: [player],
          me: {
            ...state.me,
            player: player,
          },
          roomCode: code,
        } as GameEntity,
      });

      navigate(`/lobby?roomId=${code}`);
    });

    return () => {
      socket.off(RoomEvents.generatedRoomCode);
    };
  }, []);

  useEffect(() => {
    setRoomCodeValid(!!roomCode && roomCode.length === 4);
  }, [roomCode]);

  return (
    <Grid justify="center" align="center" sx={{ height: '100vh' }}>
      <Grid.Col>
        <Stack spacing={20} p={20}>
          <TextInput
            sx={{ textTransform: 'uppercase' }}
            label="Enter room code"
            value={roomCode ?? ''}
            onChange={(event) => setRoomCode(event.currentTarget.value)}
            maxLength={4}
          />
          <Button disabled={!roomCodeValid} onClick={() => onJoin()}>
            Join
          </Button>
          <Text>Or</Text>
          <Button color="teal" onClick={() => onCreate()}>
            Create new room
          </Button>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default MainMenu;
