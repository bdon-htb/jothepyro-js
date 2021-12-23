import Phaser from 'phaser';

import Flamethrower from './Flamethrower';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'player');

    this._allStates = ['idle', 'moving'];
    this.state = 'idle';
    this._allDirections = ['up', 'down', 'left', 'right'];
    this.direction = 'right';

    this.flamethrower = new Flamethrower({ scene: scene, x: x, y: y, player: this });
    this.speed = 300;
    this.maxHealth = 100;
    this.health = this.maxHealth;

    this._setAnim();

    scene.add.existing(this);
    scene.physics.add.existing(this);
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
      frameRate: 6,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk-up',
      frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 6,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk-down',
      frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
      frameRate: 6,
      repeat: -1
    });
  }

  _setAnim()
  {
    let animation;
    this.flipX = false;
    if(this.state === 'idle')
    {
      switch (this.direction)
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
      switch (this.direction)
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

    this.state = 'idle';
    this.flamethrower.setFiring(false);
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
            this.setVelocityY(-this.speed);
            break;
          case 'MOVE_DOWN':
            this.setVelocityY(this.speed);
            break;
          case 'MOVE_LEFT':
            this.setVelocityX(-this.speed);
            break;
          case 'MOVE_RIGHT':
            this.setVelocityX(this.speed);
            break;
        }
      }

      if(command.startsWith('AIM_'))
      {
        this.flamethrower.setFiring(true);
        switch (command)
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
  }
}
