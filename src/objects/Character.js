import Phaser from 'phaser';

/**
 * The base class for all game characters. This includes all enemies and the
 * the player.
 * @abstract
 * Note: This class and its children often assumes that the scene being passed
 * is MainScene and has access to its attributes.
*/
export default class Character extends Phaser.Physics.Arcade.Sprite
{
  /**
   * @param { Phaser.Scene } scene - The scene the character is currently in.
   * @param { number } x - Character's starting x position.
   * @param { number } y - Character's starting y position.
   * @param { string | Phaser.Textures.Texture } texture - Texture character will render with.
  */
  constructor(scene, x, y, texture)
  {
    super(scene, x, y, texture);

    this.isEnemy = true;
    this.strength = 1;

    this._allDirections = ['left', 'right'];
    this.direction = 'right';

    this.speed = 300;
    this.setMaxHealth(100);
  }


  /**
   * Sets the maxHealth of the character. By default this also sets the
   * current health but that can be optionally toggled off.
   * @param { number } v - value to set this.maxHealth to.
   * @param { boolean } resetHealth - determines whether to also update this.health.
  */
  setMaxHealth(v, resetHealth=true)
  {
    this.maxHealth = v;
    if(resetHealth){ this.health = v; }
  }

  resetHealth()
  {
    this.health = this.maxHealth;
  }

  subtractHealth(v)
  {
    this.health = Math.max(0, this.health - v);
  }

  addHealth(v)
  {
    this.health = Math.min(this.maxHealth, this.health + 1);
  }

  /**
   * The handle method is effectively the character's game update method.
   * The player has its own handle method so we'll just make this the default
   * for enemies.
   * @param { Phaser.Scene } scene - The scene the character is currently in.
  */
  handle(scene)
  {
    this._follow(scene, scene.gameStateObj.player);
    this._setFlipX();
  }

  /**
   * Loads in assets (i.e. sprites) specific to the character.
   * This should be called during the preload stage.
   * @abstract
   * @param { Phaser.Scene } scene - The scene the character is currently in.
  */
  static loadAssets(scene){ }

  /**
   * Loads character animations into the scene.
   * @abstract
   * @param { Phaser.Scene } scene - The scene the character is currently in.
  */
  static loadAnims(scene){ }

  /**
   * Sets this.flipX based on this.direction.
  */
  _setFlipX()
  {
    switch(this.direction)
    {
      case 'left':
        this.flipX = true;
        break;
      default: // right.
        this.flipX = false;
    }
  }

  /**
   * Moves this character towards the provided character c.
   * This defines the basic movement behaviour for most enemies.
   * @param { Character } c - The character to move towards.
  */
  _follow(scene, c)
  {

    this.setVelocityX(0);
    this.setVelocityY(0);

    // Touching the player.
    if(this.isEnemy && !this.body.touching.none)
    {
      return;
    }

    let currentPos = this.getCenter();
    let waypoint = c.getCenter();

    // Prevents awkward overshooting and shaking.
    let velocityX = Math.min(this.speed, Math.abs(waypoint.x - currentPos.x) * scene.game.loop.delta);
    let velocityY = Math.min(this.speed, Math.abs(waypoint.y - currentPos.y) * scene.game.loop.delta);

    // Horizontal movement.
    if(waypoint.x > currentPos.x)
    {
      this.direction = 'right';
      this.setVelocityX(velocityX);
    }
    else if(waypoint.x < currentPos.x)
    {
      this.direction = 'left';
      this.setVelocityX(-velocityX);
    }

    // Veritcal movement.
    if(waypoint.y > currentPos.y)
    {
      this.setVelocityY(velocityY);
    }
    else if(waypoint.y < currentPos.y)
    {
      this.setVelocityY(-velocityY);
    }
  }
}
