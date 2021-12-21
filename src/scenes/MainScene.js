import Phaser from 'phaser';
import Player from '../objects/Player';

/**
 * Play state handles the actual playing of the game.
*/
export default class MainScene extends Phaser.Scene
{
  constructor()
  {
    super('main');
  }

  create()
  {
    this.add.image(400, 300, 'bg');

    this.player = new Player({ scene: this, x: 400, y: 300 });
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('idle-down', true)
    this.keys = this.input.keyboard.addKeys({
        up: 'W',
        down: 'S',
        left: 'A',
        right: 'D'
    });

    this.game.controller.init(this);
  }

  update()
  {
    this.player.handle(this);
  }

}
