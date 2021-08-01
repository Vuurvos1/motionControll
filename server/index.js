require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const port = process.env.PORT || 4000;

let app = express();
let server = http.createServer(app);
let io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('./dist'));
app.use(
  cors({ origin: ['http://localhost:3000', 'http://localhost:4000', '*'] })
);

io.on('connection', (socket) => {
  console.log(`A new client connected: ${socket.id}`);

  // generate 5 char id
  let room = '';

  socket.on('joinRoom', (data) => {
    if (data) {
      console.log(`Join room: ${data}`);
      room = data;
      socket.join(data);
    } else if (room === '') {
      room = generateId(5);
      console.log(`Room: ${room}`);
      socket.join(room);
      socket.emit('roomCode', room);
    }
  });

  socket.on('inputs', (data) => {
    if (room != '') {
      // console.log(data);
      socket.to(room).emit('inputs', data);
    }
  });

  socket.on('buttonPress', (data) => {
    console.log(`button pressed: ${data}`);
  });
});

function generateId(length) {
  let result = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += chars[~~(Math.random() * chars.length)];
  }

  return result;
}

server.listen(port, () => console.log(`listening at http://localhost:${port}`));
