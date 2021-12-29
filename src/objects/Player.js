import Phaser from 'phaser';

import Flamethrower from './Flamethrower';
import Character from './Character';

/**
 * The player character.
 * @extends Character
*/
export default class Player extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'player');

    this.isEnemy = false;
    this._allStates = ['idle', 'moving'];
    this.state = 'idle';
    this._allDirections = ['up', 'down', 'left', 'right'];
    this.direction = 'right';

    this.firing = false;
    this.flamethrower = new Flamethrower({ scene: scene, x: x, y: y, player: this });

    this.speed = 300;
    this.isFast = false;
    this.speedMultiplier = 1;
    this.fastTimer = new Phaser.Time.TimerEvent();

    this.setMaxHealth(100);

    this.strength = 1;
    this.isStrong = false;
    this.strengthMultiplier = 1;
    this.strongTimer = new Phaser.Time.TimerEvent();

    this.invincible = false;
    this.invincibleTimer = new Phaser.Time.TimerEvent();


    this._setAnim();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.pushable = false;
    this.setCollideWorldBounds(true);
  }

  handle(scene)
  {
    let previous = { state: this.state, direction: this.direction };

    this._handlePlayerControls(scene);

    if(previous.state != this.state || previous.direction != this.direction)
    {
      this._setAnim();
    }

    this.flamethrower.handle(scene);
  }

  subtractHealth(v)
  {
    if(!this.invincible){ super.subtractHealth(v); }
  }
  
  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'player',
      'assets/player.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'idle-right',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle-up',
      frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle-down',
      frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
      frameRate: 6,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk-right',
      frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 12,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk-up',
      frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 12,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk-down',
      frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
      frameRate: 12,
      repeat: -1
    });
  }

  _setAnim()
  {
    let animation;
    this.flipX = false;
    if(this.state === 'idle')
    {
      switch(this.direction)
      {
        case 'up':
          animation = 'idle-up'
          break;
        case 'down':
          animation = 'idle-down'
          break;
        case 'left':
          animation = 'idle-right'
          this.flipX = true;
          break;
        case 'right':
          animation = 'idle-right'
          break;
      }
    }
    else {
      switch(this.direction)
      {
        case 'up':
          animation = 'walk-up'
          break;
        case 'down':
          animation = 'walk-down'
          break;
        case 'left':
          animation = 'walk-right'
          this.flipX = true;
          break;
        case 'right':
          animation = 'walk-right'
          break;
      }
    }
    this.anims.play(animation, true);
  }

  _handlePlayerControls(scene)
  {
    let controller = scene.game.controller;
    let firing = false;
    let speed = this.speed * this.speedMultiplier;

    this.state = 'idle';
    this.setVelocityX(0);
    this.setVelocityY(0);
    for(let command of controller.poll())
    {
      if(command.startsWith('MOVE_'))
      {
        this.state = 'moving';
        switch (command)
        {
          case 'MOVE_UP':
            this.setVelocityY(-speed);
            break;
          case 'MOVE_DOWN':
            this.setVelocityY(speed);
            break;
          case 'MOVE_LEFT':
            this.setVelocityX(-speed);
            break;
          case 'MOVE_RIGHT':
            this.setVelocityX(speed);
            break;
        }
      }

      if(command.startsWith('AIM_'))
      {
        firing = true;
        switch(command)
        {
          case 'AIM_UP':
            this.direction = 'up';
            break;
          case 'AIM_DOWN':
            this.direction = 'down';
            break;
          case 'AIM_LEFT':
            this.direction = 'left';
            break;
          case 'AIM_RIGHT':
            this.direction = 'right';
            break;
        }
      }
    }

    this.firing = firing;
  }

  // Overriding to do nothing because the player shouldn't have follow behaviour ever.
  _follow(scene, c){ }
}
