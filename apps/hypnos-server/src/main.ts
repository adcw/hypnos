/* SETUP end */
import _d = require('dotenv');
_d.config();

import {
  VotingPhaseEvents,
  PhrasePhaseEvents,
  RoomEvents,
  ForgeryPhaseEvents,
  PresentationPhaseEvents,
} from '@hypnos/shared/gameevents';

import { arrayShuffle, ErrorCodes } from '@hypnos/shared/constants';
import { getRandomRoomCode, readDir } from './utils';
import { imageFolderPath, io, SERVER_PATH } from './Config';

const MAX_ROOM_SIZE = 8;

io.on('connection', (socket) => {
  console.log('socket connection : ', socket.id);

  socket.on(RoomEvents.createrooom, () => {
    console.log('Requested room creation from: ', socket.id);
    const roomCode = getFreeRoomCode();

    io.to(socket.id).emit(RoomEvents.generatedRoomCode, roomCode);
  });

  socket.on(RoomEvents.leaveroom, (room, isMaster) => {
    console.log(`Socket ${socket.id} leaving ${room}`);
    // socket.leave(room);

    for (const room of socket.rooms.values()) {
      socket.leave(room);
    }

    io.to(room).emit(RoomEvents.notifyleave, socket.id);
  });

  socket.on(RoomEvents.joinroom, (room, player, callback) => {
    const rooomSize = io.sockets.adapter.rooms.get(room)?.size ?? 0;

    if (rooomSize == MAX_ROOM_SIZE) {
      callback(ErrorCodes.roomFull);
      return;
    }

    console.log(`Socket ${socket.id} joining ${room}`);

    if (!player.isMaster) {
      console.log(`I am notifying that joins: `, player);

      io.in(room).emit(RoomEvents.notifyjoin, player);
    }

    socket.rooms.forEach((prevRoom) => {
      if (prevRoom !== socket.id) {
        console.log('LEAVING: ' + prevRoom);
        io.to(room).emit(RoomEvents.notifyleave, socket.id);
      }
    });

    socket.join(room);
  });

  socket.on(RoomEvents.broadcastgameupdate, (gameState) => {
    // let socketRoom;
    // let i = 0;
    socket.rooms.forEach((room) => {
      socket.to(room).emit(RoomEvents.broadcastgameupdate, gameState);
    });

    // console.log('Socket rooms are: ');
    // for (const entry of socket.rooms.entries()) {
    //   console.log(entry);
    // }

    // if (socketRoom) {
    //   socket.to(socketRoom).emit(RoomEvents.broadcastgameupdate, gameState);
    // }
  });

  socket.on(PhrasePhaseEvents.submit, (roomCode, obj) => {
    io.to(roomCode).emit(PhrasePhaseEvents.submit, obj);
  });

  // socket.on(PhrasePhaseEvents.drawCards, (roomCode) => {
  //   io.to(roomCode).emit(PhrasePhaseEvents.drawCards, socket.id);
  // });

  socket.on(VotingPhaseEvents.submit, (roomCode, card, sid) => {
    console.log('card: ', card);

    io.to(roomCode).emit(VotingPhaseEvents.submit, card, sid);
  });

  socket.on(VotingPhaseEvents.phaseEnd, (roomCode) => {
    console.log('Voting end');

    io.to(roomCode).emit(VotingPhaseEvents.phaseEnd);
  });

  socket.on(ForgeryPhaseEvents.submit, (roomCode, card, sid) => {
    io.to(roomCode).emit(ForgeryPhaseEvents.submit, card, sid);
  });

  socket.on(ForgeryPhaseEvents.phaseEnd, (roomCode) => {
    io.to(roomCode).emit(ForgeryPhaseEvents.phaseEnd);
  });

  socket.on(PresentationPhaseEvents.setScene, (roomCode, sceneIndex) => {
    io.to(roomCode).emit(PresentationPhaseEvents.setScene, sceneIndex);
  });

  socket.on(RoomEvents.gamestart, (roomCode) =>
    io.to(roomCode).emit(RoomEvents.gamestart)
  );

  socket.on(RoomEvents.roomexists, (roomCode, callback) => {
    callback(!!io.sockets.adapter.rooms.get(roomCode));
  });

  socket.on(RoomEvents.issocketinroom, (roomCode, callback) => {
    callback(socket.rooms.has(roomCode));
  });

  socket.on(RoomEvents.fetchCards, (callback) => {
    callback(getImagePaths());
  });

  socket.on('disconnecting', () => {
    console.log(`socket ${socket.id} disconnecting`);

    let i = 0;

    socket.rooms.forEach((room) => {
      if (i > 0) {
        socket.to(room).emit(RoomEvents.notifyleave, socket.id);
      }
      i++;
    });
  });
});

const getFreeRoomCode = () => {
  let randomCode = getRandomRoomCode();
  const MAX_ITER = 200;
  let curr_iter = 0;

  while (io.sockets.adapter.rooms.get(randomCode)) {
    if (curr_iter > MAX_ITER) {
      randomCode = getRandomRoomCode();
      curr_iter++;
    } else {
      return null;
    }
  }

  return randomCode;
};

const getImagePaths = () => {
  return arrayShuffle(
    readDir(imageFolderPath).map((p) => `${SERVER_PATH}/images/${p}`)
  );
};
