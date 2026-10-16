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
