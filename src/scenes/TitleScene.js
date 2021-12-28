import Phaser from 'phaser';

import Button from '../objects/Button';

/**
 * TitleScene is the scene for the main title screen.
 * It handles all menus except for the game over screen.
*/
export default class TitleScene extends Phaser.Scene
{
  constructor()
  {
    super('title');

    this.allPages = {
      'main': this.setupMainMenu,
      'controls': this.setupControlsHelp,
      'enemies': this.setupEnemiesHelp,
      'items': this.setupItemsHelp,
      'healthfuelscore': this.setupHealthFuel,
      'credits': this.setupCredits
    }
  }

  create()
  {
    this.titleLogo = new Phaser.GameObjects.Image(this, 100, 50, 'ui', 'title_logo.png').setOrigin(0, 0);
    this.companyLogo = new Phaser.GameObjects.Image(this, 606, 545, 'ui', 'company_logo.png').setOrigin(0, 0);

    this.startBtn = new Button(this, 300, 350, 'ui', 'start.png', () => this.startGame()).setOrigin(0, 0);
    this.helpBtn = new Button(this, 300, 425, 'ui', 'help.png', () => this.changePage('controls')).setOrigin(0, 0);
    this.creditsBtn = new Button(this, 0, 550, 'ui', 'credits_button.png', () => this.changePage('credits')).setOrigin(0, 0);

    this.mainBtn = new Button(this, 300, 535, 'ui', 'mainmenu.png', () => this.changePage('main')).setOrigin(0, 0);
    this.backBtn = new Button(this, 50, 535, 'ui', 'back.png').setOrigin(0, 0);
    this.nextBtn = new Button(this, 550, 535, 'ui', 'next.png').setOrigin(0, 0);

    this.controlsHelp = new Phaser.GameObjects.Image(this, 50, 20, 'ui', 'controls_help.png').setOrigin(0, 0);
    this.enemiesHelp = new Phaser.GameObjects.Image(this, 50, 20, 'ui', 'enemies_help.png').setOrigin(0, 0);
    this.itemsHelp = new Phaser.GameObjects.Image(this, 50, 20, 'ui', 'items_help.png').setOrigin(0, 0);
    this.healthFuelScore = new Phaser.GameObjects.Image(this, 50, 20, 'ui', 'healthfuelscore_help.png').setOrigin(0, 0);

    this.credits = new Phaser.GameObjects.Image(this, 50, 20, 'ui', 'credits.png').setOrigin(0, 0);

    this.displayRose = new Phaser.GameObjects.Sprite(this, 116, 77, 'rose_enemy').setOrigin(0, 0);
    this.displayRose.anims.play('rose_enemy_move', true);
    this.displayWatermelon = new Phaser.GameObjects.Sprite(this, 249, 99, 'watermelon_enemy').setOrigin(0, 0);
    this.displayWatermelon.anims.play('watermelon_enemy_move', true);
    this.displaySunflower = new Phaser.GameObjects.Sprite(this, 383, 77, 'sunflower_enemy').setOrigin(0, 0);
    this.displaySunflower.anims.play('sunflower_enemy_move', true);
    this.displayTree = new Phaser.GameObjects.Sprite(this, 475, 67, 'tree_enemy').setOrigin(0, 0);
    this.displayTree.anims.play('tree_enemy_move', true);
    this.displayBox = new Phaser.GameObjects.Sprite(this, 628, 87, 'box_enemy').setOrigin(0, 0);
    this.displayBox.anims.play('box_enemy_move', true);

    // Add button handler.
    this.input.on('gameobjectup', this.clickHandler, this);

    this.allObjects = [
      this.titleLogo,
      this.companyLogo,
      this.startBtn,
      this.mainBtn,
      this.helpBtn,
      this.backBtn,
      this.nextBtn,
      this.creditsBtn,
      this.credits,
      this.controlsHelp,
      this.enemiesHelp,
      this.itemsHelp,
      this.healthFuelScore,
      this.displayRose,
      this.displaySunflower,
      this.displayTree,
      this.displayWatermelon,
      this.displayBox
    ]

    this.allObjects.forEach( (obj) => this.add.existing(obj) );
    this.changePage('main');
  }

  setupMainMenu()
  {
    this.enableAll([
      this.titleLogo,
      this.companyLogo,
      this.startBtn,
      this.helpBtn,
      this.creditsBtn,
    ])
  }

  setupControlsHelp()
  {
    this.enableAll([
      this.controlsHelp,
      this.nextBtn,
      this.mainBtn,
    ])
    this.nextBtn.setCallback(() => this.changePage('healthfuelscore'));
  }

  setupHealthFuel()
  {
    this.enableAll([
      this.healthFuelScore,
      this.nextBtn,
      this.backBtn,
      this.mainBtn,
    ])

    this.backBtn.setCallback(() => this.changePage('controls'));
    this.nextBtn.setCallback(() => this.changePage('enemies'));
  }

  setupEnemiesHelp()
  {
    this.enableAll([
      this.enemiesHelp,
      this.nextBtn,
      this.backBtn,
      this.mainBtn,
      this.displayRose,
      this.displaySunflower,
      this.displayTree,
      this.displayWatermelon,
      this.displayBox
    ])

    this.backBtn.setCallback(() => this.changePage('healthfuelscore'));
    this.nextBtn.setCallback(() => this.changePage('items'));
  }

  setupItemsHelp()
  {
    this.enableAll([
      this.itemsHelp,
      this.backBtn,
      this.mainBtn,
    ])

    this.backBtn.setCallback(() => this.changePage('enemies'));
  }

  setupCredits()
  {
    this.enableAll([
      this.credits,
      this.mainBtn,
    ]);
  }

  changePage(pageName)
  {
    this.disableAll();
    let setup = this.allPages[pageName].bind(this);
    setup();
  }

  startGame()
  {
    this.scene.start('main');
  }

  enableAll(allObjects)
  {
    allObjects = (allObjects == null) ? this.allObjects : allObjects;
    allObjects.forEach( (obj) => this.enable(obj) );
  }

  disableAll(allObjects)
  {
    allObjects = (allObjects == null) ? this.allObjects : allObjects;
    allObjects.forEach( (obj) => this.disable(obj) );
  }

  enable(obj)
  {
    if(obj instanceof Button){ this.input.enable(obj) }
    obj.setVisible(true);
  }

  disable(obj)
  {
    if(obj instanceof Button){ this.input.disable(obj); }
    obj.setVisible(false);
  }

  clickHandler(pointer, obj)
  {
    if(obj instanceof Button)
    {
      obj.execute();
    }
  }
}
