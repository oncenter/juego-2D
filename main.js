const config = {
  type: Phaser.AUTO,
  width: 600, height: 600,
  scene: { preload, create, update }
};
const game = new Phaser.Game(config);

let snake = [], billete, direction = 'RIGHT', nextDir = 'RIGHT';
let lastTime = 0, interval = 150, size = 32, score = 0, scoreText;

function preload() {
  this.load.image('road', 'road.png');
  this.load.image('limousine', 'limousine.png');
  this.load.image('billete', 'billete.png');
}

function create() {
  this.add.tileSprite(300, 300, 600, 600, 'road');

  snake = [this.add.image(100, 100, 'limousine').setOrigin(0).setDisplaySize(size, size)];

  placeBillete.call(this);

  this.input.keyboard.on('keydown', e => {
    const k = e.key.toUpperCase();
    if(k==='W' && direction!=='DOWN') nextDir='UP';
    if(k==='S' && direction!=='UP') nextDir='DOWN';
    if(k==='A' && direction!=='RIGHT') nextDir='LEFT';
    if(k==='D' && direction!=='LEFT') nextDir='RIGHT';
  });

  scoreText = this.add.text(10, 10, 'Puntaje: 0', { font: '20px Arial', fill: '#fff' });
}

function update(time) {
  if(time >= lastTime + interval) {
    lastTime = time;
    move.call(this);
  }
}

function move() {
  direction = nextDir;
  const head = snake[0];
  let x = head.x, y = head.y;

  if(direction==='LEFT') x -= size;
  if(direction==='RIGHT') x += size;
  if(direction==='UP') y -= size;
  if(direction==='DOWN') y += size;

  if(x<0||x>=config.width||y<0||y>=config.height
    || snake.some(s => s.x===x && s.y===y)) return this.scene.restart();

  const seg = this.add.image(x, y, 'limousine').setOrigin(0).setDisplaySize(size, size);
  snake.unshift(seg);

  if(billete.x===x && billete.y===y) {
    billete.destroy();
    placeBillete.call(this);
    score += 10;
    scoreText.setText('Puntaje: ' + score);
  } else {
    const tail = snake.pop();
    tail.destroy();
  }
}

function placeBillete() {
  const cols = config.width / size, rows = config.height / size;
  const fx = Phaser.Math.Between(0, cols-1) * size;
  const fy = Phaser.Math.Between(0, rows-1) * size;
  billete = this.add.image(fx, fy, 'billete').setOrigin(0).setDisplaySize(size, size);
}

