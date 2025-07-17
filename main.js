const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  backgroundColor: '#1d1d1d',
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let snake, food, direction = 'RIGHT', nextDirection = 'RIGHT';
let lastTime = 0, interval = 150, size = 20, score = 0;
let scoreText;

function preload() {}

function create() {
  snake = [this.add.rectangle(100, 100, size, size, 0x00ff00).setOrigin(0)];
  placeFood.call(this);
  this.input.keyboard.on('keydown', e => {
    const up = e.key.toUpperCase();
    if (up === 'W' && direction !== 'DOWN') nextDirection = 'UP';
    if (up === 'S' && direction !== 'UP') nextDirection = 'DOWN';
    if (up === 'A' && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (up === 'D' && direction !== 'LEFT') nextDirection = 'RIGHT';
  });
  scoreText = this.add.text(10, 10, 'Puntaje: 0', { font: '20px Arial', fill: '#fff' });
}

function update(time) {
  if (time >= lastTime + interval) {
    lastTime = time;
    move.call(this);
  }
}

function move() {
  direction = nextDirection;
  const head = snake[0];
  let x = head.x, y = head.y;

  if (direction === 'LEFT') x -= size;
  if (direction === 'RIGHT') x += size;
  if (direction === 'UP') y -= size;
  if (direction === 'DOWN') y += size;

  if (x < 0 || x >= config.width || y < 0 || y >= config.height || snake.some(s => s.x === x && s.y === y)) {
    this.scene.restart();
    return;
  }

  const h = this.add.rectangle(x, y, size, size, 0x00ff00).setOrigin(0);
  snake.unshift(h);

  if (food.x === x && food.y === y) {
    food.destroy();
    placeFood.call(this);
    score += 10;
    scoreText.setText('Puntaje: ' + score);
  } else {
    const tail = snake.pop();
    tail.destroy();
  }
}

function placeFood() {
  const fx = Phaser.Math.Between(0, config.width / size - 1) * size;
  const fy = Phaser.Math.Between(0, config.height / size - 1) * size;
  food = this.add.rectangle(fx, fy, size, size, 0xff0000).setOrigin(0);
}
