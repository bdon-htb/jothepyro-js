import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Image
{
  constructor(scene, x, y, texture, frame, callback)
  {
    super(scene, x, y, texture, frame);
    this.setCallback(callback)
    this.setInteractive();
  }

  execute()
  {
    if(this.callback instanceof Function ){ this.callback(); }
  }

  getCallback()
  {
    return this.callback;
  }

  setCallback(callback)
  {
    this.callback = callback;
  }
}
