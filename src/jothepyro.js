import Phaser from 'phaser';

// Scenes.
import PreloadScene from '/scenes/PreloadScene';
import MainScene from '/scenes/MainScene';
import TitleScene from '/scenes/TitleScene';
import GameOverScene from '/scenes/GameOverScene';

// Characters.
import Player from '/objects/Player';
import RoseEnemy from '/objects/enemies/RoseEnemy';
import TreeEnemy from '/objects/enemies/TreeEnemy';
import BoxEnemy from '/objects/enemies/BoxEnemy';
import SunflowerEnemy from '/objects/enemies/SunflowerEnemy';
import WatermelonEnemy from '/objects/enemies/WatermelonEnemy';

// Consumables.
import Bandages from '/objects/consumables/Bandages';
import Barrel from '/objects/consumables/Barrel';
import Medkit from '/objects/consumables/Medkit';
import Pepper from '/objects/consumables/Pepper';
import Propane from '/objects/consumables/Propane';
import Steak from '/objects/consumables/Steak';
import GoldenMask from '/objects/consumables/GoldenMask';

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
        arcade : { debug: false }
      },
      scene: [PreloadScene, MainScene, TitleScene, GameOverScene]
    });

    this.controller = new Controller(this);

    this.highScore;
    this.loadHighScore();

    // Create a reference to all the existing character classes.
    this.characters = {
      Player: Player,
      RoseEnemy: RoseEnemy,
      TreeEnemy: TreeEnemy,
      BoxEnemy: BoxEnemy,
      SunflowerEnemy: SunflowerEnemy,
      WatermelonEnemy: WatermelonEnemy
    }

    this.consumables = {
      Bandages: Bandages,
      Medkit: Medkit,
      Propane: Propane,
      Barrel: Barrel,
      Pepper: Pepper,
      Steak: Steak,
      GoldenMask: GoldenMask
    }
  }

  loadHighScore()
  {
    this.highScore = localStorage.getItem('highScore');
    if(this.highScore == null)
    {
      this.highScore = 0;
    }
  }

  getHighScore()
  {
    return this.highScore;
  }

  updateHighScore(score)
  {
    if(score > this.highScore)
    {
      this.highScore = score;
      localStorage.setItem('highScore', this.highScore);
      return true;
    }
    return false;
  }

  clearHighScore()
  {
    localStorage.removeItem('highScore');
  }
}

export default new JoThePyro();
