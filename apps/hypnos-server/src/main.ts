import _d = require('dotenv');
_d.config();

import fs = require('fs');
import express = require('express');
import { getEnv, EnvVars } from './utils';

const app = express();
const imageFolderPath = __dirname + '/assets/public';

const env = getEnv();

const MAX_ROOM_SIZE = 8;

const EXPRESS_PORT = 3302;
const SOCKET_PORT = 3301;
const APP_PORT = env['APP_PORT'] ?? 80;
const DOMAIN = env['DOMAIN'] ?? 'localhost';
const APP_PATH = `http://${DOMAIN}:${APP_PORT}`;
const EXPRESS_PATH = `http://${DOMAIN}:${EXPRESS_PORT}`;

const ORIGINS = [`http://${DOMAIN}:*`, `http://${DOMAIN}`];

app.use('/images', express.static(imageFolderPath));
app.listen(EXPRESS_PORT);

import socketio = require('socket.io');
import {
  ForgeryPhaseEvents,
  PhrasePhaseEvents,
  RoomEvents,
} from '@hypnos/shared/gameevents';
import { ErrorCodes } from '@hypnos/shared/constants';

const io = new socketio.Server(SOCKET_PORT, {
  cors: {
    origin: ORIGINS,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('socket connection : ', socket.id);

  socket.on(RoomEvents.createrooom, () => {
    console.log('Requested room creation from: ', socket.id);
    const roomCode = getFreeRoomCode();

    io.to(socket.id).emit(RoomEvents.generatedRoomCode, roomCode);
  });

  socket.on(RoomEvents.leaveroom, (room, isMaster) => {
    console.log(`Socket ${socket.id} leaving ${room}`);
    socket.leave(room);

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
    let socketRoom;
    let i = 0;
    socket.rooms.forEach((room) => {
      if (i === 1) {
        socketRoom = room;
      }

      i++;
    });

    if (socketRoom) {
      socket.to(socketRoom).emit(RoomEvents.broadcastgameupdate, gameState);
    }
  });

  socket.on(PhrasePhaseEvents.submit, (roomCode, obj) => {
    io.to(roomCode).emit(PhrasePhaseEvents.submit, obj);
  });

  socket.on(ForgeryPhaseEvents.submit, (roomCode, card, sid) => {
    console.log('card: ', card);

    io.to(roomCode).emit(ForgeryPhaseEvents.submit, card, sid);
  });

  socket.on(ForgeryPhaseEvents.phaseEnd, (roomCode) => {
    io.to(roomCode).emit(ForgeryPhaseEvents.phaseEnd);
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

const arrayShuffle = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const getImagePaths = () => {
  return arrayShuffle(
    readDir(imageFolderPath).map((p) => `${EXPRESS_PATH}/images/${p}`)
  );
};

function readDir(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);
}

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

const getRandomRoomCode = () =>
  [...Array(4)].map(() => Math.random().toString(36)[2].toUpperCase()).join('');

console.log(`Express listening on port ${EXPRESS_PORT}`);
console.log(`Socket.io listening on port ${SOCKET_PORT}`);
console.log('CORS: ' + ORIGINS);
