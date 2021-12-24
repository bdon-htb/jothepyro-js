import Phaser from 'phaser';

import Player from '../objects/Player';

import Campfire from '../objects/Campfire';

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
    this.game.controller.init(this);

    // Add background sprites.
    this.background = this.add.group();
    this.background.create(0, 0, 'bg').setOrigin(0,0);
    this.background.create(400, 150, 'tent').setOrigin(0,0);
    this.background.add(new Campfire({ scene: this, x: 355, y: 215 }));

    // Midground; player, items, and enemies are placed here.
    this.initGameStateObj();
    let e = new this.game.characters.RoseEnemy({ scene: this, x: 75, y: 300 });
    let t = new this.game.characters.TreeEnemy({ scene: this, x: 720, y: 300 });
    let b = new this.game.characters.BoxEnemy({ scene: this, x: 300, y: 80 });
    let f = new this.game.characters.SunflowerEnemy({ scene: this, x: 300, y: 400 });
    this.gameStateObj.enemies.add(e);
    this.gameStateObj.enemies.add(t);
    this.gameStateObj.enemies.add(b);
    this.gameStateObj.enemies.add(f);

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
      player: new this.game.characters.Player({ scene: this, x: 400, y: 400 }),
      enemies: new Set()
    }
  }
}
