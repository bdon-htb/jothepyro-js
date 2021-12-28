import Phaser from 'phaser';

import HealthBar from '../objects/HealthBar';
import Projectile from '../objects/Projectile';

import Campfire from '../objects/Campfire';

import randomInt from '../funcs.js';

/**
 * Play state handles the actual playing of the game.
*/
export default class MainScene extends Phaser.Scene
{
  constructor()
  {
    super('main');

    // Phaser.Physics.Arcade.Group containing background imagery (i.e. grass, tent, etc).
    this.background;
    // Phaser.Physics.Arcade.Group containing foreground imager (i.e. forest).
    this.foreground;
  }

  create()
  {
    this.game.controller.init(this);

    // Add background components.
    this.createBackground();

    // Midground; Player is added to the stage here.
    this.initGameStateObj();

    // Add foreground components.
    this.createForeground();

    // Add ui components.
    this.createUI();

    this.physics.world.on('worldbounds', this.handleBoundCollision);

    // Setup damage timer. Every 1/60th of a second we check for
    // damage-related collisions.
    this.fixedUpdateTimerConfig = {
      delay: 17,
      callback: () => {
        this.checkDamage();
        this.handleEnemySpawn();
      },
      repeat: -1
    }
    this.fixedUpdateTimer = new Phaser.Time.TimerEvent(this.fixedUpdateTimerConfig);
    this.time.addEvent(this.fixedUpdateTimer);
  }

  update()
  {
    // Handle player.
    let player = this.gameStateObj.player;
    player.handle(this);
    this.gameStateObj.healthBar.setValue(player.health);

    if(this.characterIsDead(player)){ this.gameOver(); }

    // Handle enemies.
    for(const enemy of this.getAllEnemies())
    {
      if(this.characterIsDead(enemy))
      {
        this.killEnemy(enemy);
        this.incrementScore(enemy);
        this.updateDifficulty();
        continue;
      }

      if(!enemy.insideMap && this.isInsideMap(enemy))
      {
        enemy.insideMap = true;
        enemy.setCollideWorldBounds(true);
      }
      enemy.handle(this);
      enemy.healthBar.setValue(enemy.health);
      enemy.healthBar.setPosition(enemy.body.left, enemy.body.top - 15);
    }
  }

  spawnEnemy(enemyClass, x, y)
  {
    let enemies = this.gameStateObj.enemies[enemyClass];
    let enemy = enemies.getFirstDead();
    if(enemy == null)
    {
      enemy = new enemyClass({ scene : this, x : x, y : y });
      enemies.add(enemy, true);
      this.physics.add.existing(enemy);

      enemy.healthBar = new HealthBar(
        this, enemy.body.left, enemy.body.top - 15, enemy.width, 10, enemy.health);
      this.add.existing(enemy.healthBar, true);
      enemy.body.pushable = false;
    }
    else {
      enemy.resetHealth();
      enemy.setPosition(x, y);
      enemy.setActive(true);
      enemy.setVisible(true);

      enemy.healthBar.reset();
      enemy.healthBar.setActive(true);
      enemy.healthBar.setVisible(true);
    }

    enemy.touchingPlayer = false;
    enemy.touchingFlamethrower = false;
    enemy.insideMap = false;

    let c = this.physics.add.collider(enemy, this.gameStateObj.player,
      () => {enemy.touchingPlayer = true; });

    enemy.collider = c;
  }

  randomlySpawnEnemy()
  {
    let chance = randomInt(1, 100);
    let enemyClass;
    if(chance >= 1 && chance <= 50) // 51/100
    {
      enemyClass = this.game.characters.RoseEnemy;
    }
    else if(chance >= 51 && chance <= 66) // 16/100
    {
      enemyClass = this.game.characters.SunflowerEnemy;
    }
    else if(chance >= 67 && chance <= 87) // 21/100
    {
      enemyClass = this.game.characters.WatermelonEnemy;
    }
    else if(chance >= 88 && chance <= 99) // 11/100
    {
      enemyClass = this.game.characters.TreeEnemy;
    }
    else enemyClass = this.game.characters.BoxEnemy; // 1 / 100

    let position = this.getEnemySpawnPosition();
    this.spawnEnemy(enemyClass, position.x, position.y);
  }

  getEnemySpawnPosition()
  {
    let top = 0;
    let left = 0;
    let right = 800;
    let bottom = 600;

    let position = {}
    position.x = randomInt(left - 50, right + 50);
    if(position.x >= left && position.x <= right)
    {
      position.y = (randomInt(1, 2) == 1) ? bottom + 50 : top - 50;
    }
    else position.y = randomInt(top, bottom);

    return position;
  }

  handleEnemySpawn()
  {
    if(randomInt(1, this.gameStateObj.enemySpawnRate) === 1)
    {
      this.randomlySpawnEnemy();
    }
  }

  // Returns if the character is dead or not.
  characterIsDead(c)
  {
    return c.health <= 0;
  }

  killEnemy(enemy)
  {
    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.collider.destroy()
    enemy.collider = null;
    enemy.insideMap = false;

    enemy.healthBar.setActive(false);
    enemy.healthBar.setVisible(false);
    enemy.setVelocity(0, 0);

    // Gotta make sure watermelons don't keep shooting after death.
    if(enemy instanceof this.game.characters.WatermelonEnemy)
    {
      enemy.turnOffTimer(this);
    };
  }

  spawnProjectile(x, y, texture, strength, velocityX, velocityY)
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
    this.background.setDepth(0);
  }

  createForeground()
  {
    this.foreground = this.add.group();
    this.foreground.create(0, -10, 'treesU').setOrigin(0,0);
    this.foreground.create(-22, 0, 'treesL').setOrigin(0,0);
    this.foreground.create(768, 0, 'treesR').setOrigin(0,0);
    this.foreground.create(0, 546, 'treesD').setOrigin(0,0);
    this.foreground.setDepth(3);
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
    this.ui.setDepth(4);
  }

  initGameStateObj()
  {
    let player = new this.game.characters.Player({ scene: this, x: 400, y: 400 });
    this.gameStateObj = {
      player: player,
      enemies: this.createEnemiesGroup(),
      projectiles: this.physics.add.group(),
      score: 0,
      scoreThousand: 1,
      scoreText: new Phaser.GameObjects.Text(this, 661, 20, '0', {font: '23px Arial', fill: '#FFFFFF'}),
      healthBar: new HealthBar(this, 40, 20, 100, 24, player.health, 0xff0000, null),
      fuelBar: new HealthBar(this, 160, 24, 100, 24, player.fuel, 0xF27D0C, null),
      maxEnemies: 10,
      baseAddition: 10,
      enemySpawnRate: 100, // Denom. 1/100
      consumSpawnRate: 2, // Denom. 1/2
      killStreak: false
    }

    player.setDepth(1);
    // Projectiles appear over enemies. but under foreground.
    this.gameStateObj.projectiles.setDepth(2);
  }

  createEnemiesGroup()
  {
    let enemies = { };

    for(const enemyClass of Object.values(this.game.characters))
    {
      if(enemyClass === this.game.characters.Player){ continue; }
      enemies[enemyClass] = this.physics.add.group();
      enemies[enemyClass].setDepth(1); // Same depth as player.
    }
    return enemies;
  }

  getAllEnemies()
  {
    let allEnemies = []
    for(const [enemyClass, enemyGroup] of Object.entries(this.gameStateObj.enemies))
    {
      if(enemyClass === this.game.characters.Player){ continue; }
      for(const enemy of enemyGroup.children.getArray())
      {
        if(enemy.active && enemy.visible){ allEnemies.push(enemy); }
      }
    }
    return allEnemies;
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
    let enemies = this.getAllEnemies()

    for(const enemy of enemies)
    {
      if(enemy.touchingPlayer)
      {
        this.gameStateObj.player.subtractHealth(enemy.strength);
      }

      if(flamethrower.flameActive && this.checkOverlap(enemy, this.gameStateObj.player.flamethrower))
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

  isInsideMap(enemy)
  {
    let enemyRect = enemy.getBounds();
    let intersect = Phaser.Geom.Rectangle.Intersection(enemyRect, this.physics.world.bounds);
    return intersect.width === enemyRect.width && intersect.height === enemyRect.height;
  }

  // Increases score based on enemy defeated.
  incrementScore(enemy)
  {
    this.gameStateObj.score += Math.floor(this.gameStateObj.baseAddition + (enemy.maxHealth / 2));
    this.gameStateObj.scoreText.setText(this.gameStateObj.score);
  }

  updateDifficulty()
  {
    let gameStateObj = this.gameStateObj;
    // Pulling this directly from og calculateScore().
    if(gameStateObj.maxEnemies < 100 && (gameStateObj.score / 500) >= gameStateObj.scoreThousand)
    {
      gameStateObj.max_enemies += 1;
      gameStateObj.scoreThousand += 1;

      if(gameStateObj.enemySpawnRate >= 25)
      {
        gameStateObj.enemySpawnRate -= 1;
      }

      if(gameStateObj.consumSpawnRate[1] <= 35)
      {
        gameStateObj.consumSpawnRate += 1;
      }
    }
  }

  gameOver()
  {
    this.scene.start('gameOver', {
      finalScore: this.gameStateObj.score,
      isNewRecord: this.game.updateHighScore(this.gameStateObj.score)
    });
  }
}
