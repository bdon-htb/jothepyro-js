import Phaser from 'phaser';

import Button from '../objects/Button';

/**
 * GameOverScene is the scene for the game menu screen and handles
 * that menu as well.
*/
export default class GameOverScene extends Phaser.Scene
{
  constructor()
  {
    super('gameOver');
  }

  create()
  {
    this.gameOver = new Phaser.GameObjects.Image(this, 250, 200, 'ui', 'game_over.png').setOrigin(0, 0);
    this.deadJo = new Phaser.GameObjects.Image(this, 335, 300, 'player_gameover').setOrigin(0, 0);
    this.mainBtn = new Button(this, 450, 500, 'ui', 'mainmenu.png', () => this.mainMenu()).setOrigin(0, 0);
    this.restartBtn = new Button(this, 150, 500, 'ui', 'tryagain.png', () => this.restartGame()).setOrigin(0, 0);

    this.allObjects = [
      this.gameOver,
      this.deadJo,
      this.mainBtn,
      this.restartBtn
    ]

    this.allObjects.forEach( (obj) => this.add.existing(obj) );

    // Add button handler.
    this.input.on('gameobjectup', this.clickHandler, this);
  }

  restartGame()
  {
    this.scene.start('main');
  }

  mainMenu()
  {
    this.scene.start('title');
  }

  clickHandler(pointer, obj)
  {
    if(obj instanceof Button)
    {
      obj.execute();
    }
  }
}
