// eslint-disable-next-line @typescript-eslint/no-var-requires
const socket = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

socket.on('connection', (socket) => {
  console.log('socket connection : ', socket.id);
});
