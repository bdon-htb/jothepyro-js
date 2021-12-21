import Phaser from 'phaser';

import PreloadScene from '/scenes/PreloadScene';
import MainScene from '/scenes/MainScene';

import Controller from '/objects/Controller';

class JoThePyro extends Phaser.Game
{
  constructor()
  {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade'
      },
      scene: [PreloadScene, MainScene]
    });

    this.controller = new Controller(this);

  }
}

export default new JoThePyro();
