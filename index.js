require('dotenv').config();
const express = require('express');
const app = express();

// Setup server
let server = app.listen(process.env.PORT || 3000, () => {
  // let host = server.address().address;
  const port = server.address().port;
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static('public'));

let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`We have a new client: ${socket.id}`);
  let room = '';

  // room logic
  socket.on('createRoom', (data) => {
    let x = ~~(Math.random() * 9999);
    // check if room doesn't already exist
    console.log(x);
    socket.join(x);

    room = x;

    socket.emit('createRoom', x);

    console.log(io.sockets.adapter.rooms);
  });

  socket.on('joinRoom', (data) => {
    // ensure only 2 people can be in a room (host and controller)
    socket.join(data);
    room = data;

    console.log(io.sockets.adapter.rooms);
  });

  socket.on('motionData', (data) => {
    socket.to(room).emit('motionData', data);
  });
});
