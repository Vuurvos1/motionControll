<script>
	import { socket } from '$lib/stores';

	let roomCode = '';

	function sendButtonPress(value, vibrationTime = 5) {
		// change click to touch start/end and mousedown/mouseup

		// value could be converted to be just a few bytes for more speed?
		if (vibrationTime > 0) {
			navigator.vibrate(vibrationTime);
		}

		console.log(value);
		$socket.emit('buttonPress', value);
	}

	function joinRoom() {
		// controller join room
		let room = roomCode.toLowerCase().trim();
		console.log('joining:', room);

		$socket.emit('joinRoom', room);
	}

	// TODO send orientation and acceleration data on a timer?
</script>

<section class="controller">
	<div class="dpad">
		<div />
		<button
			class="up"
			on:click={() => {
				sendButtonPress('up');
			}}
		/>
		<div />

		<button
			class="left"
			on:click={() => {
				sendButtonPress('left');
			}}
		/>
		<div class="mid" />
		<button
			class="right"
			on:click={() => {
				sendButtonPress('right');
			}}
		/>

		<div />
		<button
			class="down"
			on:click={() => {
				sendButtonPress('down');
			}}
		/>
		<div />
	</div>

	<div class="buttons">
		<button
			class="buttonA"
			on:click={() => {
				sendButtonPress('A');
			}}
		>
			<span>A</span>
		</button>
		<button
			class="buttonB"
			on:click={() => {
				sendButtonPress('B');
			}}
		>
			<span>B</span>
		</button>
	</div>

	<form action="" on:submit|preventDefault={joinRoom} class="roomController">
		<input class="roomInput" bind:value={roomCode} maxlength="5" type="text" />
		<button>Join</button>
	</form>
</section>

<style lang="scss">
	.controller {
		display: grid;
		place-content: center;
		height: 100vh;

		.dpad {
			display: grid;
			grid-template-rows: 3.75rem 3.5rem 3.75rem;
			grid-template-columns: 3.75rem 3.5rem 3.75rem;
			justify-content: center;

			position: relative;
			margin-bottom: 4.6rem;

			& > button {
				border-radius: 0.25rem;
				position: relative;
				box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);

				transition: box-shadow 0.1s ease-in-out;

				&:active {
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
				}

				&::after {
					content: '';

					position: absolute;
					background-color: rgba(0, 0, 0, 0.4);
					border-radius: 1rem;
				}
			}

			button,
			.mid {
				background-color: hotpink;
			}

			.mid {
				z-index: 5;
			}

			.up,
			.down {
				&::after {
					width: 2px;
					height: 2rem;

					top: 50%;
					transform: translateY(-50%);
				}
			}

			.left,
			.right {
				&::after {
					height: 2px;
					width: 2rem;

					left: 50%;
					transform: translateX(-50%);
				}
			}

			.up {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			.left {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			.right {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}

			.down {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}
		}

		.buttons {
			display: flex;
			flex-direction: column;
			align-items: center;

			margin: 0 auto;

			button {
				display: flex;
				align-items: center;
				justify-content: center;

				width: 3.4rem;
				height: 3.4rem;

				border-radius: 1in;

				background-color: hotpink;
				box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);

				transition: box-shadow 0.1s ease-in-out;

				&:first-child {
					margin-bottom: 2rem;
				}

				&:active {
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.75);
				}
			}
		}
	}
</style>
