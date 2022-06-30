<script>
	import { onMount } from 'svelte';

	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	// this also could be done with svelts tween functions?
	// import TWEEN from '@tweenjs/tween.js';

	import { deg2rad } from '$lib/utils';
	import { socket } from '$lib/stores';

	let roomCode = '';

	let canvas;

	// three.js setup
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
	camera.position.setZ(-30);
	camera.position.setY(10);

	let renderer;

	// geometry
	const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
	// const geometry = new THREE.BoxGeometry(5, 1, 12);
	const material = new THREE.MeshStandardMaterial({
		color: 0xff6347
	});
	const torus = new THREE.Mesh(geometry, material);
	scene.add(torus);

	// lights
	const pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(10, 10, 10);

	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(pointLight, ambientLight);

	const lightHelper = new THREE.PointLightHelper(pointLight);
	const gridHelper = new THREE.GridHelper(200, 50);
	scene.add(lightHelper, gridHelper);

	// socket events
	$socket.on('setRoom', (room) => {
		console.log('recieved room', room);
		roomCode = room;
	});

	$socket.on('inputs', (data) => {
		// console.log(data);
		torus.rotation.x = data.rot.x;
		torus.rotation.y = data.rot.y;
		torus.rotation.z = data.rot.z;
	});

	$socket.on('buttonPress', (data) => {
		console.log('recieved button');
	});

	$socket.on('rotation', (data) => {});

	//   // gyro
	//   function handleOrientation(e) {
	//     const rot = {
	//       x: (e.beta * Math.PI) / 180 + 360,
	//       y: (e.alpha * Math.PI) / 180,
	//       z: (e.gamma * Math.PI) / 180 + 360,
	//     };

	//     controllerData.rot = rot;
	//   }

	//   window.addEventListener('deviceorientation', handleOrientation, true);

	//   function handleMotion(e) {
	//     // torus.position.x = e.acceleration.x > 0 ? e.acceleration.x : 0;
	//     // torus.position.y = e.acceleration.y > 0 ? e.acceleration.y : 0;
	//     // torus.position.z = e.acceleration.z > 0 ? e.acceleration.z : 0;

	//     // torus.position.x += e.acceleration.x;
	//     // torus.position.y += e.acceleration.y;
	//     // torus.position.z += e.acceleration.z;

	//     controllerData.accel = {
	//       x: e.acceleration.x,
	//       y: e.acceleration.y,
	//       z: e.acceleration.z,
	//     };

	//     // let speed = geolocationCoordinatesInstance.speed;
	//     // console.log(speed);
	//   }

	//   window.addEventListener('devicemotion', handleMotion);
	// }

	// let controllerData = { rot: { x: null, y: 0, z: 0 } };

	// document.querySelector('.controllerSelect').addEventListener('click', () => {
	//   setInterval(() => {
	//     if (controllerData.rot.x != null) {
	//       // console.log('send', controllerData);
	//       socket.emit('inputs', controllerData);
	//     }
	//   }, 42);
	// });

	// this should be moved to the controller?
	function deviceRotation(ev) {
		console.log('device rotation');
		const rotation = new THREE.Euler(
			deg2rad(-ev.beta),
			deg2rad(ev.alpha),
			deg2rad(ev.gamma),
			'YXZ'
		);
		torus.setRotationFromEuler(rotation);
	}

	function deviceMotion(ev) {}

	function resizeCanvas(ev) {
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
		//   }
	}

	onMount(() => {
		// connect to new room
		$socket.emit('joinRoom', '');

		// three.js rendering
		renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.setPixelRatio(window.devicePixelRatio);

		const controls = new OrbitControls(camera, renderer.domElement);
		resizeCanvas();

		// animation loop
		let frame = requestAnimationFrame(loop);
		function loop(time) {
			frame = requestAnimationFrame(loop);
			// console.log(time);

			controls.update();
			renderer.render(scene, camera);
		}

		return () => {
			cancelAnimationFrame(frame);
		};
	});
</script>

<svelte:window on:deviceorientation={deviceRotation} on:resize={resizeCanvas} />

<section class="data">
	<canvas bind:this={canvas} />

	<p class="roomCode">room code: {roomCode}</p>

	<b>Gyro</b>
	<p class="gyroData">beta:</p>
	<p>alpha:</p>
	<p>gamma:</p>

	<b>Acceleration</b>
	<p class="accelData" />

	<b>Dpad</b>
	<p class="dpadData" />

	<b>Buttons</b>
	<p class="buttonData">A</p>
	<p>B</p>
</section>

<style lang="scss">
	canvas {
		width: 75vw;
		max-width: 100%;
		height: 70vh;
		max-height: 100%;
	}
</style>
