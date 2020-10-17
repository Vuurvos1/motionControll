// shorter queryselectors
const q = document.querySelector.bind(document);
const qa = document.querySelectorAll.bind(document);

let socket = io.connect(window.location.host);
let mobile = false;

const sensorFrequency = 30;

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

const accelerometer = new Accelerometer({
  frequency: sensorFrequency,
});

const gyroscope = new Gyroscope({
  frequency: sensorFrequency,
});

let deviceOrientationAlpha = null;
let deviceOrientationBeta = null;
let deviceOrientationGamma = null;

const ball = document.querySelector('.ball');
const garden = document.querySelector('.garden');

const maxX = garden.clientWidth - ball.clientWidth;
const maxY = garden.clientHeight - ball.clientHeight;

if (mobile) {
  accelerometer.start();
  gyroscope.start();

  window.addEventListener('deviceorientation', (e) => {
    deviceOrientationAlpha = e.alpha;
    deviceOrientationBeta = e.beta;
    deviceOrientationGamma = e.gamma;
  });
}

// limit imput rate to requestAnimationFrame (should be same as screen refresh rate)
// might want to lock this to ~90 inputs per second
function animate() {
  if (mobile) {
    // send sensor info to server
    let data = {
      gyro: {
        x: null,
        y: null,
        z: null,
      },

      accel: {
        x: null,
        y: null,
        z: null,
      },

      deviceOrientation: {
        beta: null,
        gamma: null,
        alpha: null,
      },
    };

    if (accelerometer.x) {
      data.accel.x = accelerometer.x.toFixed(2);
      data.accel.y = accelerometer.y.toFixed(2);
      data.accel.z = accelerometer.z.toFixed(2);
    }

    if (gyroscope.x) {
      data.gyro.x = gyroscope.x.toFixed(2);
      data.gyro.y = gyroscope.y.toFixed(2);
      data.gyro.z = gyroscope.z.toFixed(2);
    }

    if (deviceOrientationBeta) {
      data.deviceOrientation.beta = deviceOrientationBeta.toFixed(2);
      data.deviceOrientation.gamma = deviceOrientationGamma.toFixed(2);
      data.deviceOrientation.alpha = deviceOrientationAlpha.toFixed(2);
    }

    socket.emit('motionData', data);
  }

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

socket.on('createRoom', (data) => {
  if (!mobile) {
    q('.roomCode').innerHTML = data;
  }
});

socket.on('motionData', (data) => {
  if (!mobile) {
    q('.sensorData').innerHTML = `
    <h3>Accelerometer</h3>
    x: ${data.accel.x} \n
    y: ${data.accel.y} \n
    z: ${data.accel.z} \n
    <h3>Gyroscope</h3>
    x: ${data.gyro.x} \n
    y: ${data.gyro.y} \n
    z: ${data.gyro.z} \n
    <h3>Deviceorientation</h3>
    x: ${data.deviceOrientation.beta} \n
    y: ${data.deviceOrientation.gamma} \n
    z: ${data.deviceOrientation.alpha} \n
    `;

    let x = data.deviceOrientation.gamma; // In degree in the range [-90,90]
    let y = data.deviceOrientation.beta; // In degree in the range [-180,180]

    x = Math.max(-90, Math.min(x, 90));
    y = Math.max(-90, Math.min(y, 90));

    // prevent top bottom skipping when going from - to +
    ball.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// when DOM is loaded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');

  if (!mobile) {
    socket.emit('createRoom', socket.id);
  }
});
