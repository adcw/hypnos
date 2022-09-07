import { RoomEvents } from '@hypnos/shared/gameevents';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';
import React, { createContext, useEffect, useReducer } from 'react';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export enum ActionType {
  addPlayer = 'addPlayer',
  initialize = 'initialize',
}

export interface Action {
  type: ActionType;
  payload: any;
}

const reducer = (state: GameEntity, action: Action): GameEntity => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.addPlayer: {
      const player = payload as PlayerEntity;
      return {
        ...state,
        players: [...state.players, player],
      };
    }

    case ActionType.initialize: {
      const player = payload as PlayerEntity;
      return {
        cards: [],
        players: [player],
        me: {
          ...state.me,
          player: player,
          // player: {
          //   ...player,
          //   socketId: state.me.socket.id,
          // },
        },
      };
    }
  }
};

export interface GameProviderProps {
  children: JSX.Element;
  mySocket: any;
}

export interface GameReducer {
  gameState: [GameEntity, any];
}

export interface GameProviderValue {
  gameState: GameReducer;
  me: MeEntity;
}

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

  useEffect(() => {
    const socket = props.mySocket as Socket;

    socket.on(RoomEvents.leaveroom, (room, socketId) => {
      console.log('Left room: ', room);
    });

    return () => {
      // socket.off(RoomEvents.roomleft);
    };
  }, []);

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

// const NetworkCtx = React.createContext<NetworkContextType | null>(null);
// export const NetworkContextProvider = NetworkCtx.Provider;
// export default NetworkCtx;

export interface PlayerEntity {
  socketId: string;
  name?: string;
  points?: number;
  isMaster?: boolean;
  cards?: string[];
}

export interface GameEntity {
  players: PlayerEntity[];
  cards: string[];
  me: MeEntity;
}

export interface RoundEntity {
  currentPlayer: PlayerEntity;
  phrase: string | null;
  card: string;
  fakeCards: [{ card: string; player: PlayerEntity }];
}

export interface MeEntity {
  player: PlayerEntity;
  socket: any;
}
