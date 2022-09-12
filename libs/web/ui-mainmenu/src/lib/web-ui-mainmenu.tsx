import { RoomEvents } from '@hypnos/shared/gameevents';
import {
  Stack,
  TextInput,
  Text,
  Button,
  Grid,
  Group,
  Modal,
} from '@mantine/core';
import {
  ActionType,
  GameContext,
  GameEntity,
  PlayerEntity,
} from 'libs/web/network/src/lib/web-network';
import { useContext, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { useLocalStorage } from '@mantine/hooks';
import { errorCodes } from 'libs/web/network/src/lib/errors';

/* eslint-disable-next-line */
export interface MainmenuProps {}

export function MainMenu(props: MainmenuProps) {
  const [searchParams] = useSearchParams();

  const [roomCode, setRoomCode] = useState<string | null>(
    searchParams.get('roomId')
  );

  const [storageNickname, setStorageNickname] = useLocalStorage({
    key: 'hypnos-nickname',
  });

  const [nickname, setNickname] = useState(storageNickname);

  const [roomCodeValid, setRoomCodeValid] = useState<boolean | undefined>();
  const [roomCodeError, setRoomCodeError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const context = useContext(GameContext);

  const navigate = useNavigate();

  const onJoin = () => {
    if (!roomCodeValid || !context || !nickname) {
      return;
    }

    setStorageNickname(nickname);

    const [state, dispatch] = context;

    (state.me.socket as Socket).emit(
      RoomEvents.roomexists,
      roomCode,
      (exists: boolean) => {
        if (exists) {
          const player: PlayerEntity = {
            socketId: state.me.socket.id,
            isMaster: false,
            name: nickname ?? undefined,
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
        } else {
          setRoomCodeError('Specified room does not exist');
        }
      }
    );
  };

  const onCreate = () => {
    if (!context || !nickname) return;

    setStorageNickname(nickname);

    const [state, dispatch] = context;

    (state.me.socket as Socket).emit(RoomEvents.createrooom);
  };

  useEffect(() => {
    if (!nickname) {
      setNickname(storageNickname);
    }
  }, [storageNickname]);

  useEffect(() => {
    const error = searchParams.get('e');

    if (!error) {
      setConnectionError(null);
      return;
    }

    switch (error) {
      case errorCodes.masterDisconnected:
        setConnectionError('Master client disconnected from game!');
        break;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!context) return;

    const [state, dispatch] = context;
    const socket = state.me.socket as Socket;

    socket.on(RoomEvents.generatedRoomCode, (code: string) => {
      console.log('My name is', nickname);

      const player: PlayerEntity = {
        socketId: state.me.socket.id,
        isMaster: true,
        name: nickname ?? undefined,
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
  }, [nickname]);

  useEffect(() => {
    setRoomCodeValid(!!roomCode && roomCode.length === 4);
  }, [roomCode]);

  return (
    <Grid justify="center" align="center" sx={{ height: '100vh' }}>
      <Modal
        opened={!!connectionError}
        onClose={() => false}
        withCloseButton={false}
        centered
      >
        <Text pb={12}>{connectionError}</Text>
        <Button size="sm" onClick={() => navigate('/')}>
          OK
        </Button>
      </Modal>

      <Grid.Col>
        <Stack spacing={20} p={20}>
          <TextInput
            pb={24}
            label="Enter nickname"
            value={nickname ?? ''}
            onChange={(event) => setNickname(event.currentTarget.value)}
            maxLength={12}
            autoComplete="off"
          />

          <TextInput
            error={roomCodeError}
            label="Enter room code"
            value={roomCode ?? ''}
            onChange={(event) => setRoomCode(event.currentTarget.value)}
            maxLength={4}
            autoComplete="off"
            rightSection={
              <Button
                fullWidth
                disabled={!roomCodeValid || !nickname}
                onClick={() => onJoin()}
              >
                Join
              </Button>
            }
            rightSectionWidth={70}
          />

          <Text>Or</Text>
          <Button disabled={!nickname} color="teal" onClick={() => onCreate()}>
            Create new room
          </Button>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default MainMenu;
