export enum ActionType {
  addPlayer = 'addPlayer',
  initialize = 'initialize',
  setGame = 'setGame',
}

export interface Action {
  type: ActionType;
  payload: any;
}

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
