function createPaddle() {
  const { w, h, y } = CONFIG.PADDLE;
  return { x: (CONFIG.WIDTH - w) / 2, y, w, h };
}

function updatePaddle(paddle, dt) {
  let dir = 0;
  if (keys.ArrowLeft || keys.KeyA) dir -= 1;
  if (keys.ArrowRight || keys.KeyD) dir += 1;
  paddle.x += dir * CONFIG.PADDLE.speed * dt;
  paddle.x = Math.max(0, Math.min(CONFIG.WIDTH - paddle.w, paddle.x));
}

function drawPaddle(ctx, paddle) {
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h);
}

function createBall() {
  return { x: 0, y: 0, vx: 0, vy: 0, size: CONFIG.BALL.size };
}

// Coloca la bola centrada sobre la pala y detenida.
function attachBall(ball, paddle) {
  ball.x = paddle.x + (paddle.w - ball.size) / 2;
  ball.y = paddle.y - ball.size;
  ball.vx = 0;
  ball.vy = 0;
}

function launchBall(ball) {
  const angle = (20 * Math.PI) / 180; // desde la vertical, hacia la derecha
  ball.vx = CONFIG.BALL.speed * Math.sin(angle);
  ball.vy = -CONFIG.BALL.speed * Math.cos(angle);
}

// Mueve la bola y rebota en paredes laterales y techo. Devuelve true si rebotó.
function updateBall(ball, dt) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  let bounced = false;
  if (ball.x < 0) {
    ball.x = 0;
    ball.vx = Math.abs(ball.vx);
    bounced = true;
  } else if (ball.x + ball.size > CONFIG.WIDTH) {
    ball.x = CONFIG.WIDTH - ball.size;
    ball.vx = -Math.abs(ball.vx);
    bounced = true;
  }
  if (ball.y < 0) {
    ball.y = 0;
    ball.vy = Math.abs(ball.vy);
    bounced = true;
  }
  return bounced;
}

// Rebote en la pala: el ángulo depende del punto de impacto (centro = vertical,
// extremos = maxAngle) y la rapidez se mantiene constante. Devuelve true si rebotó.
function collideBallPaddle(ball, paddle) {
  const overlaps =
    ball.vy > 0 &&
    ball.x + ball.size > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y &&
    ball.y < paddle.y + paddle.h;
  if (!overlaps) return false;

  const ballCenter = ball.x + ball.size / 2;
  const paddleCenter = paddle.x + paddle.w / 2;
  const offset = Math.max(-1, Math.min(1, (ballCenter - paddleCenter) / (paddle.w / 2)));
  const angle = (offset * CONFIG.BALL.maxAngle * Math.PI) / 180;

  ball.vx = CONFIG.BALL.speed * Math.sin(angle);
  ball.vy = -CONFIG.BALL.speed * Math.cos(angle);
  ball.y = paddle.y - ball.size;
  return true;
}

function drawBall(ctx, ball) {
  drawSprite(ctx, 'ball', ball.x, ball.y, ball.size, ball.size);
}
