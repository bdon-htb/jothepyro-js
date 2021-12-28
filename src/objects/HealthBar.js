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
   * @param { number } maxValue - max value the healthbar tracks. Is also the initial value.
   * @param { number } fill - rect fill value. Default is red.
   * @param { number } bgFill - rect background fill value. Default is black.
  */
  constructor(scene, x, y, width, height, maxValue=100, fill=0xff0000, bgFill=0x000000)
  {
    super(scene, x, y);

    this.width = width;
    this.height = height;

    this.maxValue = maxValue;
    this.value = this.maxValue;

    this.fill = fill;
    this.bgFill = bgFill;

    this.setPosition(x, y);

    this._updateGraphic();
  }

  /**
   * Sets / updates the current value of this healthbar.
  */
  setValue(v)
  {
    this.value = v;
    this._updateGraphic();
  }

  reset()
  {
    this.setValue(this.maxValue);
  }
  
  _updateGraphic()
  {
    this.clear();

    if(this.bgFill != null)
    {
      this.fillStyle(this.bgFill);
      this.fillRect(0, 0, this.width, this.height);
    }

    let width = (this.value / this.maxValue) * this.width
    this.fillStyle(this.fill);
    this.fillRect(0, 0, width, this.height);
  }

}
