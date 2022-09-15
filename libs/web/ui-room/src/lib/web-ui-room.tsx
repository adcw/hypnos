import { GameContext } from '@hypnos/web/network';
import { Game } from '@hypnos/web/ui-game';
import { Lobby } from '@hypnos/web/ui-lobby';
import { useContext } from 'react';

/* eslint-disable-next-line */
export interface WebUiRoomProps {}

export function Room(props: WebUiRoomProps) {
  const context = useContext(GameContext);

  return <>{context && context[0].round ? <Game /> : <Lobby />}</>;
}

export default Room;
