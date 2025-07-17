const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },  // gravedad hacia abajo
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let platforms;
let cursors;

const game = new Phaser.Game(config);

function preload() {
  // Cargar imágenes
  this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
  this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
  this.load.spritesheet('dude',
    'https://labs.phaser.io/assets/sprites/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  // Fondo
  this.add.image(400, 300, 'sky');

  // Plataformas estáticas
  platforms = this.physics.add.staticGroup();

  // Suelo
  platforms.create(400, 584, 'ground').setScale(2).refreshBody();

  // Plataformas flotantes
  platforms.create(600, 450, 'ground');
  platforms.create(50, 350, 'ground');
  platforms.create(750, 300, 'ground');

  // Jugador
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Animaciones del jugador
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Colisión jugador - plataformas
  this.physics.add.collider(player, platforms);

  // Control de teclado
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
