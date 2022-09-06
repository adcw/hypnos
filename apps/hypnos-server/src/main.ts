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

    // console.log(
    //   JSON.stringify(Array.from(io.adapter.rooms.entries()), null, 4)
    // );
  });

  socket.on(RoomEvents.joinroom, (room, isMaster, callback) => {
    console.log(`Socket ${socket.id} joining ${room}`);

    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        console.log('LEAVING: ' + room);

        io.emit(RoomEvents.roomleft, room, socket.id);
        socket.leave(room);
      }
    });

    socket.join(room);

    console.log('Rooms:', socket.rooms);

    console.log('IsMaster', isMaster);

    // console.log(
    //   JSON.stringify(Array.from(io.adapter.rooms.entries()), null, 4)
    // );

    console.log(io.sockets.adapter.rooms.get(room));
    callback([...io.sockets.adapter.rooms.get(room)]);
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
