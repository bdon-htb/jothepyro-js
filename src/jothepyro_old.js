var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('bg', 'assets/background.png');
  this.load.spritesheet(
    'player',
    'assets/player.png',
    { frameWidth: 32, frameHeight: 32 }
  );
}

function create ()
{
  this.add.image(400, 300, 'bg');

  player = this.physics.add.sprite(100, 450, 'player');
  player.setCollideWorldBounds(true);
  this.anims.create({
    key: 'idle-right',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1}),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-up',
    frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3}),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-down',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5}),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-right',
    frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8}),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-up',
    frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11}),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-down',
    frames: this.anims.generateFrameNumbers('player', { start: 12, end: 14}),
    frameRate: 6,
    repeat: -1
  });

  player.anims.play('idle-right', true);

  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  if (cursors.left.isDown)
  {
    player.setVelocityX(-160);
    player.anims.play('walk-left', true);
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(160);
    player.anims.play('walk-right', true);
  }
  else if (cursors.up.isDown)
  {
    player.setVelocityY(-160);
    player.anims.play('walk-up', true);
  }
  else if (cursors.down.isDown)
  {
    player.setVelocityY(160);
    player.anims.play('walk-down', true);
  }
  else
  {
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('idle-down', true);
  }
}
