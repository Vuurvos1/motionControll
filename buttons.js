export function buttonSetup() {
  document.querySelector('.up').addEventListener('click', (e) => {
    console.log('up');
  });
  document.querySelector('.right').addEventListener('click', (e) => {
    console.log('right');
  });
  document.querySelector('.down').addEventListener('click', (e) => {
    console.log('down');
  });
  document.querySelector('.left').addEventListener('click', (e) => {
    console.log('left');
  });

  document.querySelector('.buttonA').addEventListener('click', (e) => {
    console.log('A');
  });
  document.querySelector('.buttonB').addEventListener('click', (e) => {
    console.log('B');
  });
}
