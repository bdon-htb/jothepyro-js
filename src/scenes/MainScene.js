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
    // this.spawnEnemy(new this.game.characters.RoseEnemy({ scene: this, x: 75, y: 300 }));
    // this.spawnEnemy(new this.game.characters.TreeEnemy({ scene: this, x: 720, y: 300 }));
    // this.spawnEnemy(new this.game.characters.BoxEnemy({ scene: this, x: 300, y: 80 }));
    // this.spawnEnemy(new this.game.characters.SunflowerEnemy({ scene: this, x: 300, y: 400 }));
    this.spawnEnemy(new this.game.characters.WatermelonEnemy({ scene: this, x: 500, y: 500 }));

    // Add foreground components.
    this.createForeground();

    // Add ui components.
    this.createUI();

    // for collision detection.
    // this.physics.world.on('overlap', this.handleOverlap)
    this.physics.world.on('worldbounds', this.handleBoundCollision);

    this.damageTimerConfig = {
      delay: 17,
      callback: ( () => this.checkDamage() ),
      repeat: -1
    }
    this.damageTimer = new Phaser.Time.TimerEvent(this.damageTimerConfig);
    this.time.addEvent(this.damageTimer);
  }

  update()
  {
    this.gameStateObj.player.handle(this);
    this.gameStateObj.healthBar.setValue(this.gameStateObj.player.health);
    for(const enemy of this.gameStateObj.enemies.children.getArray())
    {
      enemy.handle(this);
      enemy.healthBar.setValue(enemy.health);
      enemy.healthBar.setPosition(enemy.body.left, enemy.body.top - 15);
    }
  }

  spawnEnemy(enemy)
  {
    this.gameStateObj.enemies.add(enemy, true);
    this.physics.add.existing(enemy);

    enemy.setCollideWorldBounds(true);
    enemy.body.pushable = false;

    enemy.touchingPlayer = false;
    enemy.touchingFlamethrower = false;

    this.physics.add.collider(enemy, this.gameStateObj.player,
      () => {enemy.touchingPlayer = true; });

    enemy.healthBar = new HealthBar(
      this, enemy.body.left, enemy.body.top - 15, enemy.width, 10, enemy.health);
    this.add.existing(enemy.healthBar, true);
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

    let c = this.physics.add.collider(p, this.gameStateObj.player,
      () => {
        this.gameStateObj.player.subtractHealth(p.getStrength());
        p.deactivate();
      });

      p.setCollider(c);
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

  handleBoundCollision(body)
  {
    if(body.gameObject instanceof Projectile)
    {
      body.gameObject.deactivate();
    }
  }

  checkDamage()
  {
    let player = this.gameStateObj.player;
    let flamethrower = this.gameStateObj.player.flamethrower;
    let enemies = this.gameStateObj.enemies.children.getArray();

    for(const enemy of enemies)
    {
      if(enemy.touchingPlayer)
      {
        this.gameStateObj.player.subtractHealth(enemy.strength);
      }

      if(flamethrower.flameActive && this.checkFlamethrowerOverlap(enemy))
      {
        enemy.subtractHealth(player.strength);
      }
      enemy.touchingPlayer = false;
      enemy.touchingFlamethrower = false;
    }
  }

  checkOverlap(obj1, obj2)
  {
    let intersect = Phaser.Geom.Rectangle.Intersection(obj1.getBounds(), obj2.getBounds());
    return !(intersect.width === 0 && intersect.height === 0);
  }

  checkFlamethrowerOverlap(enemy)
  {
    return this.checkOverlap(enemy, this.gameStateObj.player.flamethrower);
  }


}
