import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene, x, y, texture, strength)
  {
    super(scene, x, y, texture);
    this.activate();

    this.strength;
    this.collider;

    this.setStrength(strength);
    this.setCollider(null);
  }

  getStrength()
  {
    return this.strength;
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
    this.destroyCollider();
  }

  getCollider()
  {
    return this.collider;
  }

  setCollider(c)
  {
    this.collider = c;
  }

  destroyCollider()
  {
    if(this.collider != null)
    {
      this.collider.destroy();
      this.collider = null;
    }
  }
}
