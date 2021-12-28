import Phaser from 'phaser';

import Character from '../Character';

export default class BoxEnemy extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'box_enemy');

    this.strength = 0.1
    this.speed = 720;
    this.setMaxHealth(10);

    this.anims.play('box_enemy_move', true);
  }

  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'box_enemy',
      'assets/enemies/box_enemy.png',
      { frameWidth: 64, frameHeight: 64 }
    );
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'box_enemy_move',
      frames: scene.anims.generateFrameNumbers('box_enemy', { start: 0, end: 9 }),
      frameRate: 60,
      repeat: -1
    });
  }
}
