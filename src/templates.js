export const controllerTemplate = `
    <section class="controller">
      <div class="dpad">
        <div></div>
        <button class="up"></button>
        <div></div>

        <button class="left"></button>
        <div class="mid"></div>
        <button class="right"></button>

        <div></div>
        <button class="down"></button>
        <div></div>
      </div>

      <div class="buttons">
        <button class="buttonA">
          <span>A</span>
        </button>
        <button class="buttonB">
          <span>B</span>
        </button>
      </div>

      <form action="" class="roomController">
        <input class="roomInput" maxlength="5" type="text" />
        <button>Join</button>
      </form>
    </section>`;

export const gameTemplate = `
    <section class="data">
      <canvas id="bg"></canvas>

      <p class="roomCode">room code:</p>

      <b>Gyro</b>
      <p class="gyroData">beta:</p>
      <p>alpha:</p>
      <p>gamma:</p>

      <b>Acceleration</b>
      <p class="accelData"></p>

      <b>Dpad</b>
      <p class="dpadData"></p>

      <b>Buttons</b>
      <p class="buttonData">A</p>
      <p>B</p>
    </section>`;
