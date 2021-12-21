import Phaser from 'phaser';
import Player from '../objects/Player';
/**
 * Preload state is responsible for loading in assets.
*/
export default class PreloadScene extends Phaser.Scene
{
  constructor()
  {
    super('preload');
  }

  preload ()
  {
    this.load.image('bg', 'assets/background.png');
    this.load.spritesheet(
      'player',
      'assets/player.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  create ()
  {
    Player.loadAnims(this);
    this.scene.start('main');
  }
}
