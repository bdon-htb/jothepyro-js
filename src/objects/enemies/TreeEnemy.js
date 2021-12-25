import Phaser from 'phaser';

import Character from '../Character';

export default class TreeEnemy extends Character
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'tree_enemy');

    this.speed = 6;
    this.setMaxHealth(250);

    this.anims.play('tree_enemy_move', true);
  }

  static loadAssets(scene)
  {
    scene.load.spritesheet(
      'tree_enemy',
      'assets/enemies/tree_enemy.png',
      { frameWidth: 96, frameHeight: 96 }
    );
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'tree_enemy_move',
      frames: scene.anims.generateFrameNumbers('tree_enemy', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });
  }
}
