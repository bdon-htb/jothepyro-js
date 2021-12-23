import Phaser from 'phaser';

export default class Flamethrower extends Phaser.Physics.Arcade.Sprite
{
  constructor({ scene, x, y, player})
  {
    super(scene, x, y, 'flamethrower_fire');

    this.direction = player.direction;
    this.player = player;
    this.firing = false;

    this.chain('flamethrower_startup', 'flamethrower_firing');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0,0);
  }

  handle(scene)
  {
    this.setVisible(this.isFiring());

    this._updatePosition();

    if(this.direction != this.player.direction)
    {
      this._setAngle();
    }

    this.direction = this.player.direction;
  }

  isFiring()
  {
    return this.firing;
  }

  setFiring(b)
  {
    // Turning on.
    if(this.firing === false && b === true)
    {
      this.anims.play('flamethrower_startup', true);
    }

    this.firing = b;
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'flamethrower_startup',
      frames: scene.anims.generateFrameNumbers('flamethrower_fire', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 0
    });

    scene.anims.create({
      key: 'flamethrower_firing',
      frames: scene.anims.generateFrameNumbers('flamethrower_fire', { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1
    });
  }

  _setAngle()
    {
      let angle;
      this.flipX = false;
      switch (this.player.direction)
      {
        case 'up':
          angle = 270;
          break;
        case 'down':
          angle = 90;
          break;
        case 'left':
          angle = 0;
          this.flipX = true;
          break;
        default: // right.
          angle = 0
      }
      this.angle = angle;
      this.body.angle = angle;
    }

    _updatePosition()
    {
      let position = this.player.getTopLeft();
      switch (this.player.direction)
      {
        case 'up':
          position.x += (this.width / 4) - 24;
          position.y -= this.width;
          break;
        case 'down':
          position.x += (this.width / 4) - 24;
          position.y += (this.width / 2) - 16;
          break;
        case 'left':
          position.x -= 95;
          position.y += (this.height / 2) - 13;
          break;
        default: // right.
          position.x += 32;
          position.y += (this.height / 2) - 13;
        }
      this.setPosition(position.x, position.y);
    }
}
