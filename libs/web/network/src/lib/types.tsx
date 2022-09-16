export enum ActionType {
  addPlayer = 'addPlayer',
  initialize = 'initialize',
  setGame = 'setGame',
  initRound = 'initRound',
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
  cards: string[];
}

export interface GameEntity {
  players: PlayerEntity[];
  cards: string[];
  me: MeEntity;
  roomCode?: string;
  round?: RoundEntity;
}

export interface RoundEntity {
  currentPlayerSID: string;
  phrase?: string;
  roundPhase: RoundPhase;
  realCardUrl?: string;
  playerData: {
    playerSID: string;
    ownedCardUrl: string;
    votedCardUrl?: string;
    points?: number;
  }[];
}

export interface MeEntity {
  player: PlayerEntity;
  socket: any;
}

export enum RoundPhase {
  PHRASE,
  FORGERY,
  VOTING,
  PRESENTATION,
}
