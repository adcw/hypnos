import {
  VotingPhaseEvents,
  PhrasePhaseEvents,
  RoomEvents,
  ForgeryPhaseEvents,
} from '@hypnos/shared/gameevents';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ErrorCodes } from '@hypnos/shared/constants';

import { useEvent, useGameLeave } from './hooks';
import {
  Action,
  ActionType,
  GameEntity,
  MeEntity,
  PlayerEntity,
  RoundPhase,
} from './types';
import { reducer } from './reducer';
import { LobbyHandler } from './LobbyHandler';

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
        cards: [],
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
            cards: [],
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
