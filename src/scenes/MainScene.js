import Phaser from 'phaser';

import HealthBar from '../objects/HealthBar';
import Projectile from '../objects/Projectile'

import Campfire from '../objects/Campfire';

/**
 * Play state handles the actual playing of the game.
*/
export default class MainScene extends Phaser.Scene
{
  constructor()
  {
    super('main');

    this.background; // Phaser.Physics.Arcade.Group containing background imagery (i.e. grass, tent, etc).
    this.foreground; // Phaser.Physics.Arcade.Group containing foreground imager (i.e. forest).
  }

  create()
  {
    this.game.controller.init(this);

    // Add background components.
    this.createBackground();

    // Midground; Player is added to the stage here.
    this.initGameStateObj();

    // Debug stuff.
    this.spawnEnemy(new this.game.characters.RoseEnemy({ scene: this, x: 75, y: 300 }));
    this.spawnEnemy(new this.game.characters.TreeEnemy({ scene: this, x: 720, y: 300 }));
    this.spawnEnemy(new this.game.characters.BoxEnemy({ scene: this, x: 300, y: 80 }));
    this.spawnEnemy(new this.game.characters.SunflowerEnemy({ scene: this, x: 300, y: 400 }));
    this.spawnEnemy(new this.game.characters.WatermelonEnemy({ scene: this, x: 500, y: 500 }));

    // Add foreground components.
    this.createForeground();

    // Add ui components.
    this.createUI();

    // for collision detection.
    // this.physics.world.on('overlap', this.handleOverlap)
    this.physics.world.on('worldbounds', this.handleBoundCollision);
  }

  update()
  {
    this.gameStateObj.player.handle(this);
    for(const enemy of this.gameStateObj.enemies.children.getArray())
    {
      enemy.handle(this);
    }
  }

  spawnEnemy(e)
  {
    this.gameStateObj.enemies.add(e, true);
    e.setCollideWorldBounds(true);
    this.physics.add.existing(e);
    e.body.pushable = false;
    this.physics.add.collider(e, this.gameStateObj.player);
  }

  setProjectile(x, y, texture, strength, velocityX, velocityY)
  {
    let p = this.gameStateObj.projectiles.getFirstDead();
    if(p == null)
    {
      p = new Projectile(this, x, y, texture, strength, velocityX, velocityY);
      this.gameStateObj.projectiles.add(p, true);
      this.physics.add.existing(p);
    }
    else {
      p.setPosition(x, y);
      p.setTexture(texture);
      p.setStrength(strength);
      p.activate();
    }
    p.setVelocity(velocityX, velocityY);
    p.body.onWorldBounds = true;
    p.setCollideWorldBounds(true);
    return p;
  }

  createBackground()
  {
    this.background = this.add.group();
    this.background.create(0, 0, 'bg').setOrigin(0,0);
    this.background.create(400, 150, 'tent').setOrigin(0,0);
    this.background.add(new Campfire({ scene: this, x: 355, y: 215 }));
  }

  createForeground()
  {
    this.foreground = this.add.group();
    this.foreground.create(0, -10, 'treesU').setOrigin(0,0);
    this.foreground.create(-22, 0, 'treesL').setOrigin(0,0);
    this.foreground.create(768, 0, 'treesR').setOrigin(0,0);
    this.foreground.create(0, 546, 'treesD').setOrigin(0,0);
  }

  createUI()
  {
    this.ui = this.add.group();
    this.ui.create(632, 2, 'ui', 'score.png').setOrigin(0,0);
    this.ui.add(this.gameStateObj.healthBar, true);
    this.ui.create(-10, 0, 'ui', 'healthbar.png').setOrigin(0,0);
    this.ui.add(this.gameStateObj.fuelBar, true);
    this.ui.create(110, 0, 'ui', 'fuelbar.png').setOrigin(0,0);
    this.ui.add(this.gameStateObj.scoreText, true);
  }

  initGameStateObj()
  {
    let player = new this.game.characters.Player({ scene: this, x: 400, y: 400 });
    this.gameStateObj = {
      player: player,
      enemies: this.physics.add.group(),
      projectiles: this.physics.add.group(),
      score: 0,
      scoreText: new Phaser.GameObjects.Text(this, 661, 20, '0', {font: '23px Arial', fill: '#FFFFFF'}),
      healthBar: new HealthBar(this, 40, 20, 100, 24, player.health, 0xff0000, null),
      fuelBar: new HealthBar(this, 160, 24, 100, 24, player.fuel, 0xF27D0C, null)
    }
  }

/*
  getPlayerRaycast(x, y, velocityX, velocityY)
  {
    let enemies = this.gameStateObj.enemies.children();
    this.raycaster.mapGameObjects(enemies);

    // Conceptually slow calculations but that probably doesn't matter all too much right?
    let angle = Math.atan2(velocityY, velocityX);
    let range = Math.sqrt((velocityX ** 2) + (velocityY ** 2));

    this.ray.setRay(x, y, angle, range);
    let intersection = this.ray.cast();

    this.raycaster.removeMappedObjects(enemies);
  }
*/

  handleBoundCollision(body)
  {
    if(body.gameObject instanceof Projectile)
    {
      body.gameObject.deactivate();
    }
  }
}
