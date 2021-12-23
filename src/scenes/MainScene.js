import Phaser from 'phaser';

import Player from '../objects/Player';

import RoseEnemy from '../objects/enemies/RoseEnemy';

import Campfire from '../objects/Campfire';

/**
 * Play state handles the actual playing of the game.
*/
export default class MainScene extends Phaser.Scene
{
  constructor()
  {
    super('main');

    this.gameStateObj; // An object literal that tracks game objects.

  }

  create()
  {
    this.game.controller.init(this);

    // Add background sprites.
    this.background = this.add.group();
    this.background.create(0, 0, 'bg').setOrigin(0,0);
    this.background.create(400, 150, 'tent').setOrigin(0,0);
    this.background.add(new Campfire({ scene: this, x: 355, y: 215 }));

    // Midground; player, items, and enemies are placed here.
    this.initGameStateObj();
    let e = new RoseEnemy({ scene: this, x: 75, y: 300 });
    this.gameStateObj.enemies.add(e);

    // Add foreground sprites.
    this.foreground = this.add.group();
    this.foreground.create(0, -10, 'treesU').setOrigin(0,0);
    this.foreground.create(-22, 0, 'treesL').setOrigin(0,0);
    this.foreground.create(768, 0, 'treesR').setOrigin(0,0);
    this.foreground.create(0, 546, 'treesD').setOrigin(0,0);
  }

  update()
  {
    this.gameStateObj.player.handle(this);
    this.gameStateObj.enemies.forEach((e) => e.handle(this));
  }

  initGameStateObj()
  {
    this.gameStateObj = {
      player: new Player({ scene: this, x: 400, y: 400 }),
      enemies: new Set()
    }
  }
}
