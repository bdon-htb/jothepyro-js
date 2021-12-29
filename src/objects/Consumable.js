import Phaser from 'phaser';

/**
 * Base class for all consumable items.
 * @abstract
*/
export default class Consumable extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param { Phaser.Scene } scene - The scene the character is currently in.
   * @param { number } x - Consumable's starting x position.
   * @param { number } y - Consumable's starting y position.
   * @param { string | Phaser.Textures.Texture } texture - Texture character will render with.
  */
  constructor(scene, x, y, texture, frame)
  {
    super(scene, x, y, texture, frame);
  }

  /**
   * Consumable is consumed by the player and applies its effects.
   * @param { Phaser.Scene } scene - The scene the character and consumable is currently in.
   * @param { Player } player - The player character that is consuming this consumable.
   * @abstract
  */
  consume(scene){ }

  activate()
  {
    this.setActive(true);
    this.setVisible(true);
  }

  deactivate()
  {
    this.setActive(false);
    this.setVisible(false);
    this.destroyOverlap();
  }

  destroyOverlap()
  {
    if(this.overlap != null)
    {
      this.overlap.destroy();
      this.overlap = null;
    }
  }
}
