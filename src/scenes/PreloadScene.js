import Phaser from 'phaser';

import Player from '../objects/Player';

import RoseEnemy from '../objects/enemies/RoseEnemy';
import TreeEnemy from '../objects/enemies/TreeEnemy';
import BoxEnemy from '../objects/enemies/BoxEnemy';

import Campfire from '../objects/Campfire';
import Flamethrower from '../objects/Flamethrower';

const CHARACTERS = [
  Player,
  RoseEnemy,
  TreeEnemy,
  BoxEnemy
]

/**
 * Preload state loads in all the assets before the game starts.
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
    this.load.image('tent', 'assets/tent.png');
    this.load.image('treesD', 'assets/bg_treesD.png');
    this.load.image('treesL', 'assets/bg_treesL.png');
    this.load.image('treesR', 'assets/bg_treesR.png');
    this.load.image('treesU', 'assets/bg_treesU.png');

    CHARACTERS.forEach((c) => c.loadAssets(this));

    this.load.spritesheet(
      'campfire',
      'assets/campfire.png',
      { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet(
      'flamethrower_fire',
      'assets/flamethrower_fire.png',
      { frameWidth: 96, frameHeight: 32 }
    );
    this.load.spritesheet(
      'sunflower_enemy',
      'assets/enemies/sunflower_enemy.png',
      { frameWidth: 38, frameHeight: 64 }
    );
    this.load.spritesheet(
      'watermelon_enemy',
      'assets/enemies/watermelon_enemy.png',
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  create ()
  {
    CHARACTERS.forEach((c) => c.loadAnims(this));
    Campfire.loadAnims(this);
    Flamethrower.loadAnims(this);
    this.scene.start('main');
  }
}
