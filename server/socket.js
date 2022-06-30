export const socketEvents = (io, socket) => {
	console.log(`new client: ${socket.id}`);

	// generate 5 char id?
	let room = '';

	socket.on('joinRoom', (data) => {
		if (data) {
			console.log(`Join room: ${data}`);
			room = data;
			socket.join(data);
		} else if (room === '') {
			// room = generateId(5);
			room = 'foo';

			console.log(`Room: ${room}`);

			socket.join(room);
			io.in(socket.id).emit('setRoom', room);
		}
	});

	socket.on('inputs', (data) => {
		if (room != '') {
			// console.log(data);
			io.to(room).emit('inputs', data);
		}
	});

	socket.on('buttonPress', (data) => {
		console.log(`button pressed: ${data}`);

		io.to(room).emit('buttonPress', data);
	});
};
