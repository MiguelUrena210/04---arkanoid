const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  mode: 'menu', // 'menu' | 'ready' | 'playing' | 'paused' | 'gameover' | 'won'
  score: 0,
  lives: CONFIG.LIVES,
};

const MAX_DT = 1 / 30;
let lastTime = 0;

function update(dt) {
  // Se completa en pasos siguientes.
}

function drawCenteredText(text, y, size) {
  ctx.font = `bold ${size}px monospace`;
  ctx.fillText(text, CONFIG.WIDTH / 2, y);
}

function drawMenu() {
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  drawCenteredText('ARKANOID', CONFIG.HEIGHT / 2 - 20, 56);
  drawCenteredText('Espacio para empezar', CONFIG.HEIGHT / 2 + 30, 22);
}

function draw() {
  ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  if (state.mode === 'menu') drawMenu();
}

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, MAX_DT);
  lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  requestAnimationFrame((time) => {
    lastTime = time;
    requestAnimationFrame(loop);
  });
});
