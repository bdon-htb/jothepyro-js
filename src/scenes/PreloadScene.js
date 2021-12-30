import Phaser from 'phaser';

import Campfire from '../objects/Campfire';
import Flamethrower from '../objects/Flamethrower';

/**
 * PreloadScene loads in all the assets before the game starts.
 * Only thing it displays is a loading screen.
*/
export default class PreloadScene extends Phaser.Scene
{
  constructor()
  {
    super('preload');
  }

  preload ()
  {
    this.setupProgressBar();

    this.load.image('bg', 'assets/background.png');
    this.load.image('tent', 'assets/tent.png');
    this.load.image('treesD', 'assets/bg_treesD.png');
    this.load.image('treesL', 'assets/bg_treesL.png');
    this.load.image('treesR', 'assets/bg_treesR.png');
    this.load.image('treesU', 'assets/bg_treesU.png');

    for(const character of Object.values(this.game.characters)){
      character.loadAssets(this);
    }

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
      'watermelon_enemy',
      'assets/enemies/watermelon_enemy.png',
      { frameWidth: 32, frameHeight: 32 }
    );

    this.load.atlas('ui', 'assets/ui.png', 'assets/ui.json');
    this.load.image('player_gameover', 'assets/player_gameover.png');

    this.load.atlas('items', 'assets/items.png', 'assets/items.json');

    this.load.audio('fight1', 'assets/audio/sawsquarenoise_stage_1.wav');
    this.load.audio('fight2', 'assets/audio/sawsquarenoise_stage_2.wav');
    this.load.audio('fight3', 'assets/audio/sawsquarenoise_stage_3.wav');
  }

  // I shamelessly copied this from here.
  // https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/#Creating_the_Preloader
  setupProgressBar()
  {
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 30);

    let loadingText = this.make.text({
        x: 400,
        y: 250,
        text: 'Loading...',
        style: {
            font: '23px Arial',
            fill: '#FFFFFF'
        }
    });

    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', function(value){
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 10);
    });

    this.load.on('complete', function(){
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  create ()
  {
    for(const character of Object.values(this.game.characters)){
      character.loadAnims(this);
    }
    Campfire.loadAnims(this);
    Flamethrower.loadAnims(this);
    this.scene.start('title');
  }
}
