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

app.use(express.static('dist'));
app.use(
  cors({ origin: ['http://localhost:3000', 'http://localhost:4000', '*'] })
);

io.on('connection', (socket) => {
  console.log(`A new client connected: ${socket.id}`);

  // socket.join(socketRoom);

  socket.on('buttonPress', (data) => {
    console.log(`button pressed: ${data}`);
  });
});

server.listen(port, () => console.log(`listening at http://localhost:${port}`));
