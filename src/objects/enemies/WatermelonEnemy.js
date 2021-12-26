import Phaser from 'phaser';

import Character from '../Character';

function randomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default class WatermelonEnemy extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'watermelon_enemy');

    this.speed = 30;
    this.setMaxHealth(25);
    this.strength = 0.5;

    this.firing = false;
    this.firingDirection = null;
    this.fireIndex = 3;

    this.fireTimerConfig = {
      delay: 420,
      callback: ( () => this._shoot(scene) ),
      repeat: -1
    }
    this.fireTimer = new Phaser.Time.TimerEvent(this.fireTimerConfig);

    this.seedSpeed = 360;
    this.seedStrength = 3;
    this.strongSeedChance = 15;
    this.strongSeedStrength = 6;

    // this.on('animationupdate', () => this._handleShoot(scene));
    this.anims.play('watermelon_enemy_move', true);

    this.sightRange = 236;
    this.sightColliders = {
      'up': new Phaser.Geom.Rectangle(x, y, 1, this.sightRange),
      'down': new Phaser.Geom.Rectangle(x, y, 1, this.sightRange),
      'left': new Phaser.Geom.Rectangle(x, y, this.sightRange, 1),
      'right': new Phaser.Geom.Rectangle(x, y, this.sightRange, 1),
    }

    this._updateColliders();
  }

  handle(scene)
  {
    let previous = { firingDirection: this.firingDirection, firing: this.firing };
    this.firingDirection = this._inSight(scene, scene.gameStateObj.player);
    this.firing = this.firingDirection != null;

    if(!this.firing)
    {
      if(previous.firing) // turning off.
      {
        scene.time.removeEvent(this.fireTimer);
        this.fireTimer.reset(this.fireTimerConfig);
      }
      this.anims.play('watermelon_enemy_move', true);
      this._follow(scene, scene.gameStateObj.player);
      this._setFlipX();
    }
    else {
      if(!previous.firing) // turning on.
      {
        scene.time.addEvent(this.fireTimer);
      }

      this.setVelocity(0, 0);
      this.anims.play('watermelon_enemy_shoot', true);
    }

    this._updateColliders();
  }

  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'watermelon_enemy',
      'assets/enemies/watermelon_enemy.png',
      { frameWidth: 32, frameHeight: 32 }
    );

    scene.load.spritesheet(
      'watermelon_seed',
      'assets/watermelon_seed.png',
      { frameWidth: 16, frameHeight: 16 }
    );

  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'watermelon_enemy_shoot',
      frames: scene.anims.generateFrameNumbers('watermelon_enemy', { start: 0, end: 10 }),
      frameRate: 30,
      repeat: -1
    });
    scene.anims.create({
      key: 'watermelon_enemy_move',
      frames: scene.anims.generateFrameNumbers('watermelon_enemy', { start: 11, end: 24 }),
      frameRate: 10,
      repeat: -1
    });
  }

  /**
   * Updates the position of this watermelon's sight colliders.
  */
  _updateColliders()
  {
    // Get character dimensions.
    let position = this.getCenter();
    let width = this.width;
    let height = this.height;

    // Collider coords. This is the position of the top left.
    let colliderX;
    let colliderY;
    for(const [axis, collider] of Object.entries(this.sightColliders))
    {
      switch(axis)
      {
        case 'up':
          colliderX = position.x;
          colliderY = position.y - (height / 2) - this.sightRange;
          break;
        case 'down':
          colliderX = position.x;
          colliderY = position.y + (height / 2);
          break;
        case 'left':
          colliderX = position.x - (width / 2) - this.sightRange;
          colliderY = position.y;
          break;
        default: // right.
          colliderX = position.x + (width / 2);
          colliderY = position.y;
      }
      collider.setPosition(colliderX, colliderY);
    }
  }

  /**
   * Checks if the provided character c is in range of this watermelon.
   * @param { Phaser.Scene } scene - The scene the character is currently in.
   * @param { Character } c - Character to check for.
   * @returns { string | null } firingDirection - The direction c was sighted in.
   * firingDirection can only be the values 'up', 'down', 'left' or 'right'.
   * if c is not in this watermelon's sight then it will return null.
  */
  _inSight(scene, c)
  {
    let targetRect = c.getBounds();
    for(const [axis, collider] of Object.entries(this.sightColliders))
    {
      if(Phaser.Geom.Rectangle.Overlaps(targetRect, collider))
      {
        return axis;
      }
    }
    return null;
  }

  /**
   * Handles the watermelon's shooting state / animation.
   * This should be called everytime the watermelon's shooting
   * animation changes frame.
   * @param { Phaser.Scene } scene - The scene the character is currently in.
  */
  _handleShoot(scene)
  {
    if(this.firing && this.anims.currentFrame.index === this.fireIndex){ this._shoot(scene); }
  }

  /**
   * Fires watermelon seed projectile towards player.
   * Precondition: this.firing === true
  */
  _shoot(scene)
  {
    let position = this.getCenter();
    let velocityX = 0;
    let velocityY = 0;

    let roll = randomInt(1, this.strongSeedChance);

    let textureFrame;
    let strength;
    if(roll === this.strongSeedChance)
    {
      textureFrame = 0;
      strength = this.strongSeedStrength;
    }
    else {
      textureFrame = 1;
      strength = this.seedStrength;
    }

    switch(this.firingDirection)
    {
      case 'up':
        velocityY = -this.seedSpeed;
        break;
      case 'down':
        velocityY = this.seedSpeed;
        break;
      case 'left':
        velocityX = -this.seedSpeed;
        break;
      default: // right.
        velocityX = this.seedSpeed;
    }

    let p = scene.setProjectile(position.x, position.y, 'watermelon_seed', strength, velocityX, velocityY);
    p.setFrame(textureFrame);
  }
}
