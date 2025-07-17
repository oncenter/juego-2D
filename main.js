const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  backgroundColor: '#1d1d1d',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let snake;
let food;
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let lastMoveTime = 0;
let moveInterval = 150;
let gridSize = 20;
let score = 0;
let scoreText;

function preload() {}

function create() {
  snake = [];
  snake.push(this.add.rectangle(100, 100, gridSize, gridSize, 0x00ff00).setOrigin(0));

  placeFood.call(this);

  // Teclado
  this.input.keyboard.on('keydown', event => {
    switch (event.key.toUpperCase()) {
      case 'W':
        if (direction !== 'DOWN') nextDirection = 'UP';
        break;
      case 'S':
        if (direction !== 'UP') nextDirection = 'DOWN';
        break;
      case 'A':
        if (direction !== 'RIGHT') nextDirection = 'LEFT';
        break;
      case 'D':
        if (direction !== 'LEFT') nextDirection = 'RIGHT';
        break;
    }
  });

  scoreText = this.add.text(10, 10, 'Puntaje: 0', { font: '20px Arial', fill: '#ffffff' });
}

function update(time) {
  if (time >= lastMoveTime + moveInterval) {
    lastMoveTime = time;
    moveSnake.call(this);
  }
}

function moveSnake() {
  direction = nextDirection;

  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  if (direction === 'LEFT') newX -= gridSize;
  else if (direction === 'RIGHT') newX += gridSize;
  else if (direction === 'UP') newY -= gridSize;
  else if (direction === 'DOWN') newY += gridSize;

  // Colisión con paredes
  if (newX < 0 || newX >= config.width || newY < 0 || newY >= config.height) {
    gameOver.call(this);
    return;
  }

  // Colisión con sí mismo
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newX && snake[i].y === newY) {
      gameOver.call(this);
      return;
    }
  }

  // Mover la serpiente
  const newHead = this.add.rectangle(newX, newY, gridSize, gridSize, 0x00ff00).setOrigin(0);
  snake.unshift(newHead);

  // Comió la comida
  if (newX === food.x && newY === food.y) {
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
  const foodX = Phaser.Math.Between(0, (config.width / gridSize) - 1) * gridSize;
  const foodY = Phaser.Math.Between(0, (config.height / gridSize) - 1) * gridSize;
  food = this.add.rec
