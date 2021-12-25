import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene, x, y, texture, strength)
  {
    super(scene, x, y, texture);
    this.activate();

    this.strength;

    this.setStrength(strength);
  }

  setStrength(s)
  {
    this.strength = s;
  }

  activate()
  {
    this.setActive(true);
    this.setVisible(true);
  }

  deactivate()
  {
    this.setActive(false);
    this.setVisible(false);
  }
}
