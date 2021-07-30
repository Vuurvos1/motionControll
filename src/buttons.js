export function buttonSetup(socket) {
  document.querySelector('.controllerSelect').addEventListener('click', () => {
    document.querySelector('.data').style.display = 'none';
  });
  document.querySelector('.gameSelect').addEventListener('click', () => {
    document.querySelector('.controller').style.display = 'none';

    socket.emit('joinRoom', null);
  });

  const vibrationTime = 5;

  document.querySelector('.up').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);

    console.log('up');
  });
  document.querySelector('.right').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('right');
  });
  document.querySelector('.down').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('down');
  });
  document.querySelector('.left').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('left');
  });

  document.querySelector('.buttonA').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('A');

    socket.emit('buttonPress', 'A');
  });
  document.querySelector('.buttonB').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('B');

    socket.emit('buttonPress', 'B');
  });

  // controller join room
  document.querySelector('.roomController').addEventListener('submit', (e) => {
    e.preventDefault();
    // lowercase and trim
    const id = document.querySelector('.roomInput').value;
    socket.emit('joinRoom', id);
  });
}
