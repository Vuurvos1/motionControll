// check device
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // true for mobile device
  console.log('mobile device');
} else {
  // false for not mobile device
  console.log('not mobile device');
}

// let accelerometer = new Accelerometer({
//   frequency: 1,
// });

// accelerometer.addEventListener('reading', (e) => {
//   console.log('Accel along X' + accelerometer.x);
//   console.log('Accel along Y' + accelerometer.y);
//   console.log('Accel along Z' + accelerometer.z);
// });

// accelerometer.start();

// let gyroscope = new Gyroscope({
//   frequency: 1,
// });

// gyroscope.addEventListener('reading', (e) => {
//   console.log('ang vel X' + gyroscope.x);
//   console.log('ang vel Y' + gyroscope.y);
//   console.log('ang vel Z' + gyroscope.z);
// });

// gyroscope.start();

var ball = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');

var maxX = garden.clientWidth - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {
  //   var x = event.beta; // In degree in the range [-180,180]
  //   var y = event.gamma; // In degree in the range [-90,90]
  let x = event.gamma;
  let y = event.beta;

  output.innerHTML = 'beta : ' + x + '\n';
  output.innerHTML += 'gamma: ' + y + '\n';

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top = (maxY * y) / 180 - 10 + 'px';
  ball.style.left = (maxX * x) / 180 - 10 + 'px';
}

window.addEventListener('deviceorientation', handleOrientation);
