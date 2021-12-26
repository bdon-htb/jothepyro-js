import Phaser from 'phaser';

export default class Flamethrower extends Phaser.Physics.Arcade.Sprite
{
  constructor({ scene, x, y, player})
  {
    super(scene, x, y, 'flamethrower_fire');

    this.direction = player.direction;
    this.player = player;

    this.active = false;
    this.maxFuel = 100;
    this.fuel = this.maxFuel;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.fuelTimerConfig = {
      delay: 17,
      callback: ( () => this._updateFuel(scene) ),
      repeat: -1
    }
    this.fuelTimer = new Phaser.Time.TimerEvent(this.fuelTimerConfig);
    scene.time.addEvent(this.fuelTimer);

    this.setOrigin(0,0);
  }

  handle(scene)
  {
    this.setVisible(this._isActive());

    this._updatePosition();

    if(this.direction != this.player.direction)
    {
      this._setAngle();
    }

    this.direction = this.player.direction;
  }

  _isActive()
  {
    return this.active;
  }

  _setActive(b)
  {
    // Turning on.
    if(this.active === false && b === true)
    {
      this.anims.play('flamethrower_startup');
      this.anims.chain('flamethrower_firing');
    }
    // Turning off.
    else if(this.active === true && b === false)
    {
      this.anims.chain();
      this.anims.stop();
    }

    this.active = b;
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'flamethrower_startup',
      frames: scene.anims.generateFrameNumbers('flamethrower_fire', { start: 0, end: 2 }),
      frameRate: 60,
      repeat: 0
    });

    scene.anims.create({
      key: 'flamethrower_firing',
      frames: scene.anims.generateFrameNumbers('flamethrower_fire', { start: 3, end: 5 }),
      frameRate: 30,
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

      // Don't try to think about these values too much.
      // I based them on the og code and they looked pretty arbitrary
      // at a quick glance.
      // Rotation also messes with the positioning I think too so we
      // gotta account for that as well.
      switch(this.player.direction)
      {
        case 'up':
          // Current position is fine.
          break;
        case 'down':
          position.x += 32;
          position.y += 32;
          break;
        case 'left':
          position.x -= 96;
          position.y += 3;
          break;
        default: // right.
          position.x += 32;
          position.y += 3;
        }
      this.setPosition(position.x, position.y);
    }

    _updateFuel(scene)
    {
      let newAmount = this.fuel;
      if(this.player.firing && this.fuel > 0)
      {
        newAmount = Math.max(this.fuel - 0.2, 0);
      }
      else if(!this.player.firing && this.fuel < this.maxFuel)
      {
        newAmount = Math.min(this.fuel + 0.075, this.maxFuel);
      }

      if(newAmount != this.fuel)
      {
        this.fuel = newAmount;
        scene.gameStateObj.fuelBar.setValue(newAmount);
      }

      this._setActive(this.fuel > 0 && this.player.firing);
    }
}
