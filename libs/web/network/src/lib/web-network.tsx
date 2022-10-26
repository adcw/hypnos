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
          // round:
          //   {
          //     ...state.round,
          //     currentPlayerSID: state.round?.currentPlayerSID === socketId ?
          //   }
        } as GameEntity,
      });

      if (state.round) {
        dispatch({
          type: ActionType.initRound,
          payload: [
            ...state.cards,
            ...(state.players.find((p) => p.socketId === socketId)?.cards ||
              []),
          ],
        });
      }
    }
  };

  const handleGameUpdate = (game: GameEntity) => {
    if (!context) return;
    const [state, dispatch] = context;

    dispatch({
      type: ActionType.setGame,
      payload: { ...game, me: state.me } as GameEntity,
    });
  };

  const handleGameStart = () => {
    navigate('/game');
  };

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    if (!state.me.player.isMaster) {
      return;
    }

    if (state.players.length === 0) {
      navigate('/');
    }

    // Notify if everyone has chosen their card
    if (
      state.round?.roundPhase === RoundPhase.FORGERY &&
      state.round.playerData.length === state.players.length &&
      !state.round.playerData.find((d) => !d.ownedCardUrl)
    ) {
      (state.me.socket as Socket).emit(
        ForgeryPhaseEvents.phaseEnd,
        state.roomCode
      );
    }

    // Notify if everyone has chosen their vote
    if (
      state.round?.roundPhase === RoundPhase.VOTING &&
      state.round.playerData.length === state.players.length &&
      !state.round.playerData.find(
        (d) => !d.votedCardUrl && d.playerSID !== state.round?.currentPlayerSID
      )
    ) {
      (state.me.socket as Socket).emit(
        VotingPhaseEvents.phaseEnd,
        state.roomCode
      );
    }

    (state.me.socket as Socket).emit(RoomEvents.broadcastgameupdate, {
      cards: state.cards,
      players: state.players,
      round: state.round,
      roomCode: state.roomCode,
    } as GameEntity);
  }, [context?.[0]]);

  useEvent(RoomEvents.notifyjoin, handleNotifyJoin);
  useEvent(RoomEvents.broadcastgameupdate, handleGameUpdate);
  useEvent(RoomEvents.notifyleave, handleNotifyLeave);
  useEvent(RoomEvents.gamestart, handleGameStart);

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    console.log('Game update: ', state);
  }, [context]);

  return props.children;
};
