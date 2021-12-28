import Phaser from 'phaser';

// Scenes.
import PreloadScene from '/scenes/PreloadScene';
import MainScene from '/scenes/MainScene';

// Characters.
import Player from '/objects/Player';
import RoseEnemy from '/objects/enemies/RoseEnemy';
import TreeEnemy from '/objects/enemies/TreeEnemy';
import BoxEnemy from '/objects/enemies/BoxEnemy';
import SunflowerEnemy from '/objects/enemies/SunflowerEnemy';
import WatermelonEnemy from '/objects/enemies/WatermelonEnemy';

// Custom components.
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
        default: 'arcade',
        arcade : { debug: true }
      },
      scene: [PreloadScene, MainScene]
    });

    this.controller = new Controller(this);

    // Create a reference to all the existing character classes.
    this.characters = {
      Player: Player,
      RoseEnemy: RoseEnemy,
      TreeEnemy: TreeEnemy,
      BoxEnemy: BoxEnemy,
      SunflowerEnemy: SunflowerEnemy,
      WatermelonEnemy: WatermelonEnemy
    }

  }
}

export default new JoThePyro();
