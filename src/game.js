const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  mode: 'menu', // 'menu' | 'ready' | 'playing' | 'paused' | 'gameover' | 'won'
  score: 0,
  lives: CONFIG.LIVES,
  paddle: createPaddle(),
  ball: createBall(),
  level: 0, // índice 0-based en LEVELS
  bricks: createBricks(0),
  explosions: [], // { x, y, w, h, color, t } con t en ms
};

attachBall(state.ball, state.paddle);

const bounceSound = new Audio('assets/sounds/ball-bounce.mp3');
const breakSound = new Audio('assets/sounds/break-sound.mp3');

// Clona el audio para permitir solapamiento; ignora el rechazo de autoplay.
function playSound(sound) {
  sound.cloneNode().play().catch(() => {});
}

function updateExplosions(dt) {
  for (const e of state.explosions) e.t += dt * 1000;
  state.explosions = state.explosions.filter((e) => e.t < EXPLOSION_DURATION);
}

function drawExplosions() {
  for (const e of state.explosions) {
    const frames = EXPLOSION_FRAMES[e.color];
    const i = Math.min(frames.length - 1, Math.floor((e.t / EXPLOSION_DURATION) * frames.length));
    drawFrame(ctx, frames[i], e.x, e.y, e.w, e.h);
  }
}

const MAX_DT = 1 / 30;
let lastTime = 0;

function resetGame() {
  state.score = 0;
  state.lives = CONFIG.LIVES;
  state.level = 0;
  state.bricks = createBricks(state.level);
  state.paddle = createPaddle();
  state.explosions = [];
  attachBall(state.ball, state.paddle);
}

function update(dt) {
  if (state.mode === 'menu') {
    if (pressed.has('Space')) state.mode = 'ready';
    clearPressed();
    return;
  }
  if (state.mode !== 'paused') updateExplosions(dt);
  if (state.mode === 'gameover' || state.mode === 'won') {
    if (pressed.has('Space')) {
      resetGame();
      state.mode = 'ready';
    }
    clearPressed();
    return;
  }
  if (pressed.has('KeyP')) {
    if (state.mode === 'playing') state.mode = 'paused';
    else if (state.mode === 'paused') state.mode = 'playing';
  }
  if (state.mode === 'paused') {
    clearPressed();
    return;
  }
  if (state.mode === 'ready' || state.mode === 'playing') {
    updatePaddle(state.paddle, dt);
  }
  if (state.mode === 'ready') {
    attachBall(state.ball, state.paddle);
    if (pressed.has('Space')) {
      launchBall(state.ball);
      state.mode = 'playing';
    }
  } else if (state.mode === 'playing') {
    const hitWall = updateBall(state.ball, dt);
    const hitPaddle = collideBallPaddle(state.ball, state.paddle);
    const brick = collideBallBricks(state.ball, state.bricks);
    if (hitWall || hitPaddle || brick) playSound(bounceSound);
    if (brick) {
      state.score += CONFIG.POINTS_PER_BRICK;
      state.explosions.push({ x: brick.x, y: brick.y, w: brick.w, h: brick.h, color: brick.color, t: 0 });
      playSound(breakSound);
    }
    if (!state.bricks.some((b) => b.alive)) {
      state.mode = 'won';
    } else if (state.ball.y > CONFIG.HEIGHT) {
      state.lives--;
      state.mode = state.lives === 0 ? 'gameover' : 'ready';
    }
  }
  clearPressed();
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

function drawHud() {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Puntaje: ${state.score}`, 32, 40);
  ctx.textAlign = 'right';
  ctx.fillText(`Vidas: ${state.lives}`, CONFIG.WIDTH - 32, 40);
  ctx.textAlign = 'center';
}

const STATE_TEXTS = {
  ready: ['Espacio para lanzar'],
  paused: ['PAUSA', 'P para continuar'],
  gameover: ['GAME OVER', 'Espacio para reiniciar'],
  won: ['¡GANASTE!', 'Espacio para reiniciar'],
};

function drawStateText() {
  const lines = STATE_TEXTS[state.mode];
  if (!lines) return;
  if (state.mode !== 'ready') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  if (state.mode === 'ready') {
    drawCenteredText(lines[0], CONFIG.HEIGHT / 2 + 80, 22);
  } else {
    drawCenteredText(lines[0], CONFIG.HEIGHT / 2 - 10, 56);
    drawCenteredText(lines[1], CONFIG.HEIGHT / 2 + 35, 22);
  }
}

function draw() {
  ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  if (state.mode === 'menu') {
    drawMenu();
    return;
  }
  drawBricks(ctx, state.bricks);
  drawExplosions();
  drawPaddle(ctx, state.paddle);
  drawBall(ctx, state.ball);
  drawHud();
  drawStateText();
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
