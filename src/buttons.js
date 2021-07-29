export function buttonSetup() {
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
  });
  document.querySelector('.buttonB').addEventListener('click', (e) => {
    navigator.vibrate(vibrationTime);
    console.log('B');
  });
}
