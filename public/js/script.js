// shorter queryselectors
const q = document.querySelector.bind(document);
const qa = document.querySelectorAll.bind(document);

let socket = io.connect(window.location.host);
let mobile = false;

// check device
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // true for mobile device
  console.log('mobile device');
  mobile = true;
} else {
  // false for not mobile device
  console.log('not mobile device');
  mobile = false;
}

q('.joinRoom').addEventListener('click', (e) => {
  e.preventDefault();

  if (mobile) {
    const x = q('.roomInput').value.trim();
    socket.emit('joinRoom', x);
  }
});

// limit imput rate to requestAnimationFrame (should be same as screen refresh rate)
// might want to lock this to ~90 inputs per second
function animate() {
  if (mobile) {
    // send sensor info to server
  }

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

socket.on('createRoom', (data) => {
  if (!mobile) {
    q('.roomCode').innerHTML = data;
  }
});

if (mobile) {
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

  const ball = document.querySelector('.ball');
  const garden = document.querySelector('.garden');
  const output = document.querySelector('.output');

  const maxX = garden.clientWidth - ball.clientWidth;
  const maxY = garden.clientHeight - ball.clientHeight;

  window.addEventListener('deviceorientation', (e) => {
    //   var x = e.beta; // In degree in the range [-180,180]
    //   var y = e.gamma; // In degree in the range [-90,90]
    let x = e.gamma;
    let y = e.beta;

    output.innerHTML = 'beta: ' + x + '\n';
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
  });
}

// when DOM is loaded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');

  if (!mobile) {
    socket.emit('createRoom', socket.id);
  }
});
