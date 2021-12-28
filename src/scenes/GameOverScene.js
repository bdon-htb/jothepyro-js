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

  init(data)
  {
    this.finalScore = (data.finalScore != null) ? data.finalScore : 0;
    this.isNewRecord = (data.isNewRecord != null) ? data.isNewRecord : false;
  }

  create()
  {
    this.gameOver = new Phaser.GameObjects.Image(this, 250, 180, 'ui', 'game_over.png').setOrigin(0, 0);
    this.deadJo = new Phaser.GameObjects.Image(this, 335, 280, 'player_gameover').setOrigin(0, 0);
    this.mainBtn = new Button(this, 450, 500, 'ui', 'mainmenu.png', () => this.mainMenu()).setOrigin(0, 0);
    this.restartBtn = new Button(this, 150, 500, 'ui', 'tryagain.png', () => this.restartGame()).setOrigin(0, 0);

    this.finalScoreText = new Phaser.GameObjects.Text(this, 310, 410, 'Score:', {font: '23px Arial', fill: '#FFFFFF'});
    this.finalScoreDisplay = new Phaser.GameObjects.Text(this, 385, 410, `${this.finalScore}`, {font: '23px Arial', fill: '#FFFFFF'});

    this.highScoreText = new Phaser.GameObjects.Text(this, 310, 440, `High Score:`, {font: '23px Arial', fill: '#FFFFFF'});
    this.highScoreDisplay = new Phaser.GameObjects.Text(this, 439, 440, `${this.game.getHighScore()}`, {font: '23px Arial', fill: '#FFFFFF'});

    this.newRecordText = new Phaser.GameObjects.Text(this, 333, 250, `New Record!`, {font: '23px Arial', fill: '#FFEB3B'});
    this.newRecordText.setVisible(this.isNewRecord);

    this.allObjects = [
      this.gameOver,
      this.deadJo,
      this.mainBtn,
      this.restartBtn,
      this.finalScoreText,
      this.finalScoreDisplay,
      this.highScoreDisplay,
      this.newRecordText,
      this.highScoreText
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
