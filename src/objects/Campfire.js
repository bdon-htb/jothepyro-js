import Phaser from 'phaser';

export default class Campfire extends Phaser.GameObjects.Sprite
{
  constructor({scene, x, y })
  {
    super(scene, x, y, 'campfire');
    scene.add.existing(this);
    this.setOrigin(0, 0);
    this.anims.play('campfire-burn');
  }

  static loadAnims(scene)
  {
    scene.anims.create({
      key: 'campfire-burn',
      frames: scene.anims.generateFrameNumbers('campfire', { end: 12 }),
      frameRate: 6,
      repeat: -1
    });
  }
}
