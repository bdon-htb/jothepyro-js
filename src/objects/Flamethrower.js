import Phaser from 'phaser';

export default class Flamethrower extends Phaser.Physics.Arcade.Sprite
{
  constructor({ scene, x, y, player})
  {
    super(scene, x, y, 'flamethrower_fire');

    this.direction = player.direction;
    this.player = player;

    this.flameActive = false;
    this.maxFuel = 100;
    this.fuel = this.maxFuel;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Timer is for handling the subtraction / adding
    // of fuel. We use a timer event so it's frame indep.
    this.fuelTimerConfig = {
      delay: 17,
      callback: ( () => this._updateFuel(scene) ),
      repeat: -1
    }
    this.fuelTimer = new Phaser.Time.TimerEvent(this.fuelTimerConfig);
    scene.time.addEvent(this.fuelTimer);

    // For "rotation"
    this.dimensions = {
      width: 96,
      height: 32
    }

    // this.setOrigin(0,0);
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

  addFuel(v)
  {
    this.fuel = Math.min(this.maxFuel, this.fuel + v);
  }

  subtractFuel(v)
  {
    this.fuel = Math.max(0, this.fuel - v);
  }

  _isActive()
  {
    return this.flameActive;
  }

  _setActive(b)
  {
    // Turning on.
    if(this.flameActive === false && b === true)
    {
      this.anims.play('flamethrower_startup');
      this.anims.chain('flamethrower_firing');
    }
    // Turning off.
    else if(this.flameActive === true && b === false)
    {
      this.anims.chain();
      this.anims.stop();
    }

    this.flameActive = b;
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
    }

    _updatePosition()
    {
      let position = this.player.getTopLeft();

      // Don't try to think about these values too much.
      // They are hardcoded based on trial and error to be
      // identical to the og positioning.

      let width;
      let height;
      switch(this.player.direction)
      {
        case 'up':
          // Current position is fine.
          width = this.dimensions.height;
          height = this.dimensions.width;
          position.x += 16;
          position.y -= 48;
          break;
        case 'down':
          width = this.dimensions.height;
          height = this.dimensions.width;
          position.x += 16;
          position.y += 80;
          break;
        case 'left':
          width = this.dimensions.width;
          height = this.dimensions.height;
          position.x -= 48;
          position.y += 19;
          break;
        default: // right.
          width = this.dimensions.width;
          height = this.dimensions.height;
          position.x += 80;
          position.y += 19;
        }
      this.setPosition(position.x, position.y);
      this.body.setSize(width, height);
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
