import { RoomEvents } from '@hypnos/shared/gameevents';
import {
  Stack,
  TextInput,
  Text,
  Button,
  Grid,
  Group,
  Modal,
  Image,
  Center,
  HueSlider,
} from '@mantine/core';
import { GameContext } from 'libs/web/network/src/lib/web-network';
import { useContext, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { useLocalStorage } from '@mantine/hooks';
import { ErrorCodes } from '@hypnos/shared/constants';
import {
  PlayerEntity,
  ActionType,
  GameEntity,
} from 'libs/web/network/src/lib/types';
import { sx } from '../../../ui-design-system/src/lib/buttonSX';
import { color } from '@hypnos/web/ui-design-system';

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
            cards: [],
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

          navigate(`/game/room/?roomId=${roomCode}`);
        } else {
          setRoomCodeError('Specified room does not exist');
        }
      }
    );
  };

  const onCreate = () => {
    if (!context || !nickname) return;

    setStorageNickname(nickname);

    const [state] = context;

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
      case ErrorCodes.masterDisconnected:
        setConnectionError('Master client disconnected from game!');
        break;
      case ErrorCodes.roomFull:
        setConnectionError('Room is full!');
        break;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!context) return;

    const [state, dispatch] = context;
    const socket = state.me.socket as Socket;

    socket.on(RoomEvents.generatedRoomCode, (code: string) => {
      const player: PlayerEntity = {
        socketId: state.me.socket.id,
        isMaster: true,
        name: nickname ?? undefined,
        cards: [],
        color: color(0),
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

      navigate(`/game/room?roomId=${code}`);
    });

    return () => {
      socket.off(RoomEvents.generatedRoomCode);
    };
  }, [nickname]);

  useEffect(() => {
    setRoomCodeValid(!!roomCode && roomCode.length === 4);
  }, [roomCode]);

  return (
    <Grid justify="center" align="center" sx={{ height: '100vh' }} m={0}>
      <Modal
        opened={!!connectionError}
        onClose={() => false}
        withCloseButton={false}
        centered
      >
        <Text pb={12}>{connectionError}</Text>
        <Button sx={sx} size="sm" onClick={() => navigate('/game')}>
          OK
        </Button>
      </Modal>

      <Grid.Col>
        <Center>
          <Stack spacing={20} p={20} sx={{ width: '360px' }}>
            <TextInput
              pb={24}
              label="Enter nickname"
              value={nickname ?? ''}
              onChange={(event) => setNickname(event.currentTarget.value)}
              maxLength={12}
              autoComplete="off"
            />

            {/* <HueSlider value={}/> */}

            <TextInput
              error={roomCodeError}
              label="Enter room code"
              value={roomCode ?? ''}
              onChange={(event) =>
                setRoomCode(event.currentTarget.value.toUpperCase())
              }
              maxLength={4}
              autoComplete="off"
              rightSection={
                <Button
                  fullWidth
                  disabled={!roomCodeValid || !nickname}
                  onClick={() => onJoin()}
                  sx={sx}
                >
                  Join
                </Button>
              }
              rightSectionWidth={70}
            />

            <Text size="sm" color="yellow">
              Or
            </Text>

            <Button
              disabled={!nickname}
              // color="teal"
              onClick={() => onCreate()}
              sx={sx}
            >
              Create new room
            </Button>
          </Stack>
        </Center>
      </Grid.Col>
    </Grid>
  );
}

export default MainMenu;
