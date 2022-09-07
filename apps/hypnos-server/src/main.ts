import { GameEvents, RoomEvents } from '@hypnos/shared/gameevents';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:4200',
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

  socket.on(RoomEvents.leaveroom, (room) => {
    console.log(`Socket ${socket.id} leaving ${room}`);
    socket.leave(room);
  });

  socket.on(RoomEvents.joinroom, (room, player, callback) => {
    console.log(`Socket ${socket.id} joining ${room}`);

    if (!player.isMaster) {
      console.log(`I am notifying that joins: `, player);

      io.in(room).emit(RoomEvents.notifyjoin, player);
    }

    socket.rooms.forEach((prevRoom) => {
      if (prevRoom !== socket.id) {
        console.log('LEAVING: ' + prevRoom);
        socket.leave(prevRoom);
      }
    });

    socket.join(room);

    console.log(io.sockets.adapter.rooms.get(room));
    callback([...io.sockets.adapter.rooms.get(room)]);
  });

  socket.on(RoomEvents.broadcastplayerupdate, (players) => {
    console.log(`${socket.id} tell thera are players:`, players);

    let socketRoom;
    let i = 0;
    socket.rooms.forEach((room) => {
      if (i === 1) {
        socketRoom = room;
      }

      i++;
    });

    if (socketRoom) {
      socket.to(socketRoom).emit(RoomEvents.broadcastplayerupdate, players);
    }
  });

  socket.on(RoomEvents.checkroomexists, (roomCode, callback) => {
    callback(!!io.sockets.adapter.rooms.get(roomCode));
  });

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
    // console.log();
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

const getRandomRoomCode = () =>
  [...Array(4)].map(() => Math.random().toString(36)[2].toUpperCase()).join('');
