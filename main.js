import './style.scss';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
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

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();

// gyro
function handleOrientation(e) {
  const rot = {
    x: (e.beta * Math.PI) / 180 + 360,
    y: (e.alpha * Math.PI) / 180,
    z: (e.gamma * Math.PI) / 180 + 360,
  };

  torus.rotation.x = rot.x;
  torus.rotation.y = rot.y;
  torus.rotation.z = rot.z;
}

window.addEventListener('deviceorientation', handleOrientation, true);

function handleMotion(e) {
  // torus.position.x = e.acceleration.x > 0 ? e.acceleration.x : 0;
  // torus.position.y = e.acceleration.y > 0 ? e.acceleration.y : 0;
  // torus.position.z = e.acceleration.z > 0 ? e.acceleration.z : 0;

  torus.position.x += e.acceleration.x;
  torus.position.y += e.acceleration.y;
  torus.position.z += e.acceleration.z;
}

window.addEventListener('devicemotion', handleMotion);
