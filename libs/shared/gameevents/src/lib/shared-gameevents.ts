export const PhrasePhaseEvents = {
  submit: 'ppSubmit',
};

export const ForgeryPhaseEvents = {
  submit: 'fpSubmit',
  phaseEnd: 'fpphaseEnd',
};

export const VotingPhaseEvents = {
  submit: 'vpSubmit',
  phaseEnd: 'vpphaseEnd',
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
};
