import Phaser from 'phaser';

/**
 * The class for the health and fuel bars.
*/
export default class HealthBar extends Phaser.GameObjects.Graphics
{
  /**
   * @param { Phaser.Scene } scene - The scene the healthbar is currently in.
   * @param { number } x - healthbar's x position.
   * @param { number } y - healthbar's y position.
   * @param { number } width - healthbar's width.
   * @param { number } height - healthbar's height.
   * @param { number } height - healthbar's height.
   * @param { number=100 } value - value the healthbar tracks. Needs to be updated when applicable.
   * @param { number=0xff0000} fill - rect fill value. Default is red.
   * @param { number=0x000000} bgFill - rect background fill value. Default is black.
  */
  constructor(scene, x, y, width, height, value=100, fill=0xff0000, bgFill=0x000000)
  {
    super(scene, x, y);

    this.width = width;
    this.height = height;

    this.value = value;

    this.fill = fill;
    this.bgFill = bgFill;

    this.setPosition(x, y);

    this._updateGraphic();
  }

  /**
   * Sets / updates the value of this healthbar.
  */
  setValue(v)
  {
    this.value = v;
    this._updateGraphic();
  }

  _updateGraphic()
  {
    this.clear();

    if(this.bgFill != null)
    {
      this.fillStyle(this.bgFill);
      this.fillRect(0, 0, this.width, this.height);
    }

    let width = (this.value / 100) * this.width
    this.fillStyle(this.fill);
    this.fillRect(0, 0, width, this.height);
  }

}
