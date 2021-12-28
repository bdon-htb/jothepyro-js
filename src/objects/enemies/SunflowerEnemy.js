import Phaser from 'phaser';

import Character from '../Character';

export default class SunflowerEnemy extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'sunflower_enemy');

    this.strength = 0.7;
    this.speed = 330;
    this.setMaxHealth(45);

    this.sprinting = false;
    this.sprintTimer = new Phaser.Time.TimerEvent({
      delay: 250,
      callback: ( () => this.sprinting = !this.sprinting ),
      repeat: -1
    });
    scene.time.addEvent(this.sprintTimer);

    this.anims.play('sunflower_enemy_move', true);
  }

  handle(scene)
  {
    if(this.sprinting) // Sprinting.
    {
      this.anims.play('sunflower_enemy_move', true);
      this._follow(scene, scene.gameStateObj.player);
      this._setFlipX();
    }
    else { // Standing.
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.anims.stop();
      this.setFrame(4);
    }
  }

  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'sunflower_enemy',
      'assets/enemies/sunflower_enemy.png',
      { frameWidth: 38, frameHeight: 64 }
    );
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'sunflower_enemy_move',
      frames: scene.anims.generateFrameNumbers('sunflower_enemy', { start: 0, end: 7 }),
      frameRate: 30,
      repeat: -1
    });
  }
}
