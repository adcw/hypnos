import { CARDS_IN_HANDS } from '@hypnos/shared/constants';
import {
  RoomEvents,
  ForgeryPhaseEvents,
  VotingPhaseEvents,
  PhrasePhaseEvents,
} from '@hypnos/shared/gameevents';
import { PhrasePhase } from '@hypnos/web/ui-game';
import { useDrawCards } from 'libs/web/ui-game/src/lib/phases/hooks';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io';
import { useGameLeave, useEvent } from './hooks';
import { PlayerEntity, ActionType, GameEntity, RoundPhase } from './types';
import { GameContext } from './web-network';

export interface LobbyHandlerProps {
  children: JSX.Element;
}
export const LobbyHandler = (props: LobbyHandlerProps) => {
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
  }, ['game/room', 'game']);

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

      if (state.round && state.round.roundPhase !== RoundPhase.PRESENTATION) {
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

    console.log('update received');

    dispatch({
      type: ActionType.setGame,
      payload: { ...game, me: state.me } as GameEntity,
    });
  };

  const handleGameStart = () => {
    navigate('/game/room');
  };

  // const handleDrawCards = (socketId: string) => {
  //   if (!context) return;
  //   const [state, dispatch] = context;
  //   if (!state.me.player.isMaster) return;

  //   const player = state.players.find((p) => p.socketId === socketId);
  //   const allCards = state.cards;

  //   const playerCards = [
  //     ...(player?.cards || []),
  //     ...allCards.splice(0, CARDS_IN_HANDS - (player?.cards.length ?? 0)),
  //   ];

  //   dispatch({
  //     type: ActionType.setGame,
  //     payload: {
  //       ...state,
  //       cards: allCards,
  //       players: state.players.map((p) =>
  //         p.socketId === socketId ? { ...player, cards: playerCards } : p
  //       ),
  //     } as GameEntity,
  //   });
  // };

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    if (!state.me.player.isMaster) {
      return;
    }

    if (state.players.length === 0) {
      navigate('/game');
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

    if (state.round && state.players.length < 3) {
      console.log('Too few players');
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
  // useEvent(PhrasePhaseEvents.drawCards, handleDrawCards);

  useEffect(() => {
    if (!context) return;
    const [state] = context;

    console.log('Game update: ', state);
  }, [context]);

  return props.children;
};
