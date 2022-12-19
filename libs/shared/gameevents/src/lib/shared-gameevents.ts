export const PhrasePhaseEvents = {
  submit: 'ppSubmit',
  // drawCards: 'ppDrawCards',
};

export const ForgeryPhaseEvents = {
  submit: 'fpSubmit',
  phaseEnd: 'fpphaseEnd',
};

export const VotingPhaseEvents = {
  submit: 'vpSubmit',
  phaseEnd: 'vpphaseEnd',
};

export const PresentationPhaseEvents = {
  setScene: 'ppnextScene',
};

export const RoomEvents = {
  joinroom: 'joinroom',

  leaveroom: 'leaveroom',
  createrooom: 'createroom',
  generatedRoomCode: 'generatedRoomCode',

  notifyjoin: 'notifyjoin',
  notifyleave: 'notifyleave',
  broadcastgameupdate: 'broadcastgameupdate',

  roomexists: 'checkroomexists',
  issocketinroom: 'issocketinroom',

  gamestart: 'gamestart',
  fetchCards: 'fetchCards',

  gameend: 'gameend',
};
