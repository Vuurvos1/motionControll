import './style.scss';

import { io } from 'socket.io-client';
const url = import.meta.env.VITE_SERVER;
const socket = io(`https://${url || 'localhost:4000'}`);

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { buttonSetup } from './buttons';
import { gameSetup } from './game';
import { controllerTemplate, gameTemplate } from './templates';

// gameSetup(socket);

function _gameSetup() {
  document.querySelector('main').innerHTML = gameTemplate;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);

  function resizeCanvas() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  window.addEventListener('resize', resizeCanvas);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });

  resizeCanvas();

  renderer.setPixelRatio(window.devicePixelRatio);
  camera.position.setZ(30);

  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6347,
  });
  const torus = new THREE.Mesh(geometry, material);

  scene.add(torus);

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(10, 10, 10);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate(time) {
    // console.log(time);

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

function _controllerSetup() {
  document.querySelector('main').innerHTML = controllerTemplate;

  buttonSetup(socket);

  // gyro
  function handleOrientation(e) {
    const rot = {
      x: (e.beta * Math.PI) / 180 + 360,
      y: (e.alpha * Math.PI) / 180,
      z: (e.gamma * Math.PI) / 180 + 360,
    };

    controllerData.rot = rot;
  }

  window.addEventListener('deviceorientation', handleOrientation, true);

  function handleMotion(e) {
    // torus.position.x = e.acceleration.x > 0 ? e.acceleration.x : 0;
    // torus.position.y = e.acceleration.y > 0 ? e.acceleration.y : 0;
    // torus.position.z = e.acceleration.z > 0 ? e.acceleration.z : 0;

    // torus.position.x += e.acceleration.x;
    // torus.position.y += e.acceleration.y;
    // torus.position.z += e.acceleration.z;

    controllerData.accel = {
      x: e.acceleration.x,
      y: e.acceleration.y,
      z: e.acceleration.z,
    };

    // let speed = geolocationCoordinatesInstance.speed;
    // console.log(speed);
  }

  window.addEventListener('devicemotion', handleMotion);
}

let controllerData = { rot: { x: null, y: 0, z: 0 } };
let phone = false;
document.querySelector('.controllerSelect').addEventListener('click', () => {
  _controllerSetup(null);
  phone = true;

  setInterval(() => {
    if (controllerData.rot.x != null) {
      // console.log('send', controllerData);
      socket.emit('inputs', controllerData);
    }
  }, 500);
});
document.querySelector('.gameSelect').addEventListener('click', () => {
  _gameSetup(null);

  socket.emit('joinRoom', null);
});

socket.on('inputs', (data) => {
  // console.log(data);
  torus.rotation.x = data.rot.x;
  torus.rotation.y = data.rot.y;
  torus.rotation.z = data.rot.z;
});

socket.on('roomCode', (data) => {
  document.querySelector('.roomCode').textContent = `roomcode: ${data}`;
});
