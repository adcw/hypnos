import { RoomEvents } from '@hypnos/shared/gameevents';
import { Button, Stack, Text } from '@mantine/core';
import {
  ActionType,
  GameContext,
  PlayerEntity,
} from 'libs/web/network/src/lib/web-network';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io';

/* eslint-disable-next-line */
export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const [searchParams] = useSearchParams();
  const [roomCode] = useState(searchParams.get('roomId'));

  const context = useContext(GameContext);

  useEffect(() => {
    if (!context) return;

    const [state, dispatch] = context;

    const socket = state.me.socket as Socket;

    if (roomCode) {
      socket.emit(
        RoomEvents.joinroom,
        roomCode,
        state.me.player.isMaster,
        (room: any) => {
          console.log(room);
        }
      );
    }

    if (!state.me.player.isMaster) {
      dispatch({
        type: ActionType.initialize,
        payload: {
          socketId: state.me.socket.id,
          isMaster: false,
        } as PlayerEntity,
      });
    }

    console.log(state);

    return () => {
      // socket.emit(RoomEvents.leaveroom, roomCode);
      // console.log('Lobby dismounted');
    };
  }, [roomCode]);

  return (
    <Stack>
      {/* {context && <Text>{JSON.stringify(context[0], null, 4)}</Text>} */}

      <Stack align={'center'} spacing={0}>
        <Text>Room code is:</Text>
        <Text size={40} color="teal">
          {roomCode}
        </Text>
        <Button onClick={() => console.log(context?.[0])}>Log the state</Button>
      </Stack>
    </Stack>
  );
}

// export interface LobbyContextValue {
//   roomCode: string | null;
// }

// export interface LobbyProviderProps {}

// export const LobbyContext = React.createContext<LobbyContextValue | null>(null);

// export const LobbyProvider = (props: LobbyProviderProps) => {
//   const [searchParams] = useSearchParams();
//   const [roomCode] = useState(searchParams.get('roomId'));

//   const context = useContext(GameContext);

//   useEffect(() => {
//     if (!context) return;

//     const [state, dispatch] = context;

//     const socket = state.me.socket as Socket;

//     if (roomCode) {
//       socket.emit(RoomEvents.joinroom, roomCode, (room: any) => {
//         console.log(room);
//       });
//     }

//     return () => {
//       socket.emit(RoomEvents.leaveroom, roomCode);
//       console.log('Lobby dismounted');
//     };
//   }, [roomCode]);

//   console.log(context);

//   return (
//     <LobbyContext.Provider value={{ roomCode: roomCode }}>
//       <Outlet />
//     </LobbyContext.Provider>
//   );
// };

/*
export const GameContext = React.createContext<
  [GameEntity, React.Dispatch<Action>, MeEntity] | null
>(null);

export const GameProvider = (props: GameProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    cards: [],
    players: [],
    me: {
      player: {
        socketId: (props.mySocket as Socket).id,
      },
      socket: props.mySocket,
    },
  } as GameEntity);

  return (
    <GameContext.Provider
      value={[
        state,
        dispatch,
        {
          socket: props.mySocket,
          player: {
            socketId: props.mySocket.id,
          },
        },
      ]}
    >
      {props.children}
    </GameContext.Provider>
  );
};
 */

export default Lobby;
