import Phaser from 'phaser';

import Character from '../Character';

export default class RoseEnemy extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'rose');

    this.speed = 30;
    this.setMaxHealth(80);

    this.anims.play('rose_enemy_move', true);
    this._setFlipX();
  }

  // TODO: Implement.
  handle(scene)
  {
    this._follow(scene, scene.gameStateObj.player);
    this._setFlipX();
  }

  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'rose_enemy',
      'assets/enemies/rose_enemy.png',
      { frameWidth: 40, frameHeight: 64 }
    );
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'rose_enemy_move',
      frames: scene.anims.generateFrameNumbers('rose_enemy', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: -1
    });
  }
}
