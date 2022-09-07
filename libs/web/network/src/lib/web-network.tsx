import { GameEvents, RoomEvents } from '@hypnos/shared/gameevents';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export enum ActionType {
  addPlayer = 'addPlayer',
  initialize = 'initialize',
  setPlayers = 'setPlayers',
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
      const player = payload as GameEntity;
      return {
        ...payload,
      };
    }

    case ActionType.setPlayers: {
      const players = payload as PlayerEntity[];
      return {
        ...state,
        players: players,
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
      <LobbyHandler>{props.children}</LobbyHandler>
    </GameContext.Provider>
  );
};

interface LobbyHandlerProps {
  children: JSX.Element;
}
const LobbyHandler = (props: LobbyHandlerProps) => {
  const context = useContext(GameContext);

  const handleNotifyJoin = (player: PlayerEntity) => {
    if (!context) return;
    const [state, dispatch] = context;

    // console.log(state);

    if (state.me.player.isMaster) {
      console.log(`Add to list: ${player}`);

      dispatch({ type: ActionType.addPlayer, payload: player });
    }
  };

  const handleNotifyLeave = (socketId: string) => {
    if (!context) return;
    const [state, dispatch] = context;

    // console.log(state);

    if (state.me.player.isMaster) {
      console.log(`He left: ${socketId}`);

      dispatch({
        type: ActionType.setPlayers,
        payload: state.players.filter((p) => p.socketId !== socketId),
      });
    }
  };

  const handlePlayerUpdate = (players: PlayerEntity[]) => {
    // console.log('updated list of players: ', players);
    if (!context) return;
    const [state, dispatch] = context;

    dispatch({ type: ActionType.setPlayers, payload: players });
  };

  useEffect(() => {
    if (!context) return;
    const [state, dispatch] = context;

    if (!state.me.player.isMaster) return;

    (state.me.socket as Socket).emit(
      RoomEvents.broadcastplayerupdate,
      state.players
    );
  }, [context?.[0].players, context?.[0].me.player.isMaster]);

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    state.me.socket.on(RoomEvents.notifyjoin, handleNotifyJoin);
    state.me.socket.on(RoomEvents.broadcastplayerupdate, handlePlayerUpdate);
    state.me.socket.on(RoomEvents.notifyleave, handleNotifyLeave);

    return () => {
      state.me.socket.off(RoomEvents.notifyjoin, handleNotifyJoin);
      state.me.socket.off(RoomEvents.broadcastplayerupdate, handlePlayerUpdate);
      state.me.socket.off(RoomEvents.notifyleave, handleNotifyLeave);
    };
  }, [context]);

  return props.children;
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
  roomCode?: string;
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
