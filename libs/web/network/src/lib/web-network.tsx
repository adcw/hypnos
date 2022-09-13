import { GameEvents, RoomEvents } from '@hypnos/shared/gameevents';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ErrorCodes } from '@hypnos/shared/constants';

import { useGameLeave } from './hooks';
import {
  Action,
  ActionType,
  GameEntity,
  MeEntity,
  PlayerEntity,
} from './types';

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
      return {
        ...payload,
      };
    }

    case ActionType.setGame: {
      const game = payload as GameEntity;
      return { ...state, ...game };
    }
  }
};

export interface GameProviderProps {
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
      <LobbyHandler>
        <Outlet />
      </LobbyHandler>
    </GameContext.Provider>
  );
};

interface LobbyHandlerProps {
  children: JSX.Element;
}
const LobbyHandler = (props: LobbyHandlerProps) => {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  useGameLeave(() => {
    if (!context) return;
    const [state] = context;

    (state.me.socket as Socket).emit(
      RoomEvents.leaveroom,
      state.roomCode,
      state.me.player.isMaster
    );
  }, ['lobby', 'game']);

  const handleNotifyJoin = (player: PlayerEntity) => {
    if (!context) return;
    const [state, dispatch] = context;

    if (state.me.player.isMaster) {
      dispatch({ type: ActionType.addPlayer, payload: player });
    }
  };

  const handleNotifyLeave = (socketId: string) => {
    if (!context) return;
    const [state, dispatch] = context;

    let newMaster: PlayerEntity | undefined;

    if (state.players.find((p) => p.socketId === socketId)?.isMaster) {
      // Master client disconnected

      // navigate(`/?e=${ErrorCodes.masterDisconnected}`);

      newMaster = state.players.find(
        (p) => p.socketId !== socketId && !p.isMaster
      );
    }

    if (state.me.player.isMaster || newMaster) {
      dispatch({
        type: ActionType.setGame,
        payload: {
          ...state,
          players: state.players
            .filter((p) => p.socketId !== socketId)
            .map((p) =>
              newMaster && p.socketId === newMaster.socketId
                ? ({ ...p, isMaster: true } as PlayerEntity)
                : p
            ),
          me:
            state.me.socket.id === newMaster?.socketId
              ? { ...state.me, player: { ...state.me.player, isMaster: true } }
              : state.me,
        } as GameEntity,
      });
    }
  };

  const handleGameUpdate = (game: GameEntity) => {
    if (!context) return;
    const [state, dispatch] = context;

    console.log('New game: ', { ...game, me: state.me });

    dispatch({
      type: ActionType.setGame,
      payload: { ...game, me: state.me } as GameEntity,
    });
  };

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    if (!state.me.player.isMaster) {
      return;
    }

    console.log('New players notification');

    (state.me.socket as Socket).emit(RoomEvents.broadcastgameupdate, {
      cards: state.cards,
      players: state.players,
    } as GameEntity);
  }, [context?.[0]]);

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    state.me.socket.on(RoomEvents.notifyjoin, handleNotifyJoin);
    state.me.socket.on(RoomEvents.broadcastgameupdate, handleGameUpdate);
    state.me.socket.on(RoomEvents.notifyleave, handleNotifyLeave);

    return () => {
      state.me.socket.off(RoomEvents.notifyjoin, handleNotifyJoin);
      state.me.socket.off(RoomEvents.broadcastgameupdate, handleGameUpdate);
      state.me.socket.off(RoomEvents.notifyleave, handleNotifyLeave);
    };
  }, [context]);

  return props.children;
};
