const CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  HUD_HEIGHT: 56, // franja superior del HUD; la bola rebota por debajo de ella
  PADDLE: { w: 100, h: 20, speed: 520, y: 560 }, // px/s
  BALL: { size: 14, speed: 380, maxAngle: 60 },  // px/s, grados desde la vertical
  BRICKS: {
    cols: 10, rows: 6, maxRows: 10, w: 70, h: 24, gap: 4, offsetX: 32, offsetY: 70,
    colors: ['red', 'cyan', 'green', 'magenta', 'yellow', 'hotpink'],
  },
  LIVES: 3,
  POINTS_PER_BRICK: 10,
};
