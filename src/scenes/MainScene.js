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
    this.input.keyboard.on('keyup-M', () => this.game.toggleMute());

    this.musicList = [
      'fight1',
      'fight2',
      'fight3'
    ]

    this.music = this.sound.add(this.musicList[randomInt(0, this.musicList.length - 1)]);
    this.music.play({ volume: 0.1, loop: true });

    this.initGame();
    this.physics.world.on('worldbounds', this.handleBoundCollision);

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

    this.killStreakTimerConfig = {
      delay: 6700,
      callback: () => {
        this.stopKillStreak();
      },
      repeat: 0
    }
    this.killStreakTimer = new Phaser.Time.TimerEvent(this.killStreakTimerConfig);
  }

  update()
  {

    // Handle player.
    let player = this.getPlayer();
    player.handle(this);
    this.gameStateObj.healthBar.setValue(player.health);

    if(this.characterIsDead(player)){ this.gameOver(); }

    // Handle enemies.
    for(const enemy of this.getAllEnemies())
    {
      if(this.characterIsDead(enemy))
      {
        this.killEnemy(enemy);
        this.handleConsumableSpawn(enemy.x, enemy.y);
        this.incrementScore(enemy);
        this.updateDifficulty();
        this.updateKillStreak();
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

    // Handle display stuff.
    if(player.isFast || player.isStrong || player.invincible)
    {
      this.gameStateObj.emptyBar.setVisible(true);
    } else this.gameStateObj.emptyBar.setVisible(false);

    this.gameStateObj.displayPepper.setVisible(player.isFast);
    this.gameStateObj.displaySteak.setVisible(player.isStrong);
    this.gameStateObj.displayMask.setVisible(player.invincible);
    this.gameStateObj.killStreakDisplay.setVisible(this.gameStateObj.killStreak);

  }

  initGame()
  {
    let player = new this.game.characters.Player({ scene: this, x: 400, y: 400 });

    this.gameStateObj = {
      background: this.add.group(),
      foreground: this.add.group(),
      ui: this.add.group(),
      player: player,
      enemies: this.createEnemiesGroup(),
      projectiles: this.physics.add.group(),
      consumables: this.createConsumablesGroup(),
      score: 0,
      scoreThousand: 1,
      scoreText: new Phaser.GameObjects.Text(this, 661, 20, '0', {font: '23px Arial', fill: '#FFFFFF'}),
      healthBar: new HealthBar(this, 40, 20, 100, 24, player.health, 0xff0000, null),
      fuelBar: new HealthBar(this, 160, 24, 100, 24, player.fuel, 0xF27D0C, null),
      emptyBar: new Phaser.GameObjects.Sprite(this, 34, 50, 'ui', 'emptybar.png').setOrigin(0, 0),
      displayPepper: new Phaser.GameObjects.Sprite(this, 53, 65, 'items', 'pepper.png'),
      displaySteak: new Phaser.GameObjects.Sprite(this, 88, 65, 'items', 'steak.png'),
      displayMask: new Phaser.GameObjects.Sprite(this, 123, 65, 'items', 'golden_mask.png'),
      maxEnemies: 10,
      baseAddition: 10,
      enemySpawnRate: 100, // Denom. 1/100
      consumSpawnRate: 2, // Denom. 1/2
      killStreak: false,
      killStreakMark: 5,
      killStreakCount: 0, // Kill count towards killstreak
      killStreakDisplay: new Phaser.GameObjects.Sprite(this, 647, 50, 'ui', 'killstreak.png').setOrigin(0, 0),
    }

    this.setupBackground();
    this.setupForeground();
    this.setupUI();

    player.setDepth(1);
    player.flamethrower.setDepth(2);
    this.gameStateObj.projectiles.setDepth(2);
  }

  setupBackground()
  {
    let background = this.gameStateObj.foreground;
    background = this.add.group();
    background.create(0, 0, 'bg').setOrigin(0,0);
    background.create(400, 150, 'tent').setOrigin(0,0);
    background.add(new Campfire({ scene: this, x: 355, y: 215 }));
    background.setDepth(0);
  }

  setupForeground()
  {
    let foreground = this.gameStateObj.foreground;
    foreground = this.add.group();
    foreground.create(0, -10, 'treesU').setOrigin(0,0);
    foreground.create(-22, 0, 'treesL').setOrigin(0,0);
    foreground.create(768, 0, 'treesR').setOrigin(0,0);
    foreground.create(0, 546, 'treesD').setOrigin(0,0);
    foreground.setDepth(3);
  }

  setupUI()
  {
    let ui = this.gameStateObj.ui;
    ui.create(632, 2, 'ui', 'score.png').setOrigin(0,0);
    ui.add(this.gameStateObj.healthBar, true);
    ui.create(-10, 0, 'ui', 'healthbar.png').setOrigin(0,0);
    ui.add(this.gameStateObj.fuelBar, true);
    ui.create(110, 0, 'ui', 'fuelbar.png').setOrigin(0,0);
    ui.add(this.gameStateObj.scoreText, true);
    ui.add(this.gameStateObj.emptyBar, true);
    ui.add(this.gameStateObj.displayPepper, true);
    ui.add(this.gameStateObj.displayMask, true);
    ui.add(this.gameStateObj.displaySteak, true);
    ui.add(this.gameStateObj.killStreakDisplay, true);
    ui.setDepth(4);
  }

  getPlayer()
  {
    return this.gameStateObj.player;
  }

  characterIsDead(c)
  {
    return c.health <= 0;
  }

  /*
   * =====================
   * ENEMY RELATED METHODS
   * =====================
  */
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

    let c = this.physics.add.collider(enemy, this.getPlayer(),
      () => { enemy.touchingPlayer = true; });

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

  /*
   * ==========================
   * CONSUMABLE RELATED METHODS
   * ==========================
  */
  createConsumablesGroup()
  {
    let consumables = { };

    for(const consumClass of Object.values(this.game.consumables))
    {
      consumables[consumClass] = this.physics.add.group();
      consumables[consumClass].setDepth(1); // Same depth as player.
    }
    return consumables;
  }

  spawnConsumable(consumClass, x, y)
  {
    let consumables = this.gameStateObj.consumables[consumClass];
    let consum = consumables.getFirstDead();
    if(consum == null)
    {
      consum = new consumClass({ scene: this, x : x, y: y });
      consumables.add(consum, true);
      this.physics.add.existing(consum);
    }
    else {
      consum.setPosition(x, y);
      consum.activate();
    }

    let o = this.physics.add.overlap(consum, this.getPlayer(),
      () => {
        consum.consume(this, this.getPlayer());
        consum.deactivate();
      })
    consum.overlap = o;
  }

  handleConsumableSpawn(x, y)
  {
    if(randomInt(1, this.gameStateObj.consumSpawnRate) === 1)
    {
      this.randomlySpawnConsumable(x, y);
    }
  }

  randomlySpawnConsumable(x, y)
  {
    let chance = randomInt(1, 100);
    let consumClass;
    if(chance >= 1 && chance <= 24) // 25/100
    {
      consumClass = this.game.consumables.Propane;
    }
    else if(chance >= 25 && chance <= 34) // 10/100
    {
      consumClass = this.game.consumables.Barrel;
    }
    else if(chance >= 35 && chance <= 54) // 20/100
    {
      consumClass = this.game.consumables.Bandages;
    }
    else if(chance >= 55 && chance <= 64) // 10/100
    {
      consumClass = this.game.consumables.Medkit;
    }
    else if(chance >= 65 && chance <= 79) // 15/100
    {
      consumClass = this.game.consumables.Pepper;
    }
    else if(chance >= 80 && chance <= 91) // 12/100
    {
      consumClass = this.game.consumables.Steak;
    }
    else consumClass = this.game.consumables.GoldenMask; // 8/100

    this.spawnConsumable(consumClass, x, y);
  }

  /*
   * ==========================
   * PROJECTILE RELATED METHODS
   * ==========================
  */
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

    let c = this.physics.add.collider(p, this.getPlayer(),
      () => {
        this.getPlayer().subtractHealth(p.getStrength());
        p.deactivate();
      });

      p.setCollider(c);
    return p;
  }

  /*
   * =============
   * MISC. METHODS
   * =============
  */
  handleBoundCollision(body)
  {
    if(body.gameObject instanceof Projectile)
    {
      body.gameObject.deactivate();
    }
  }

  checkDamage()
  {
    let player = this.getPlayer();
    let flamethrower = this.getPlayer().flamethrower;
    let enemies = this.getAllEnemies()

    for(const enemy of enemies)
    {
      if(enemy.touchingPlayer)
      {
        this.getPlayer().subtractHealth(enemy.strength);
      }

      if(flamethrower.flameActive && this.checkOverlap(enemy, this.getPlayer().flamethrower))
      {
        enemy.subtractHealth(player.strength * player.strengthMultiplier);
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
    let baseAddition = this.gameStateObj.baseAddition;
    if(this.gameStateObj.killStreak){ baseAddition *= this.gameStateObj.killStreakCount; }
    this.gameStateObj.score += Math.floor(baseAddition + (enemy.maxHealth / 2));
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

  // Call this on enemy death.
  updateKillStreak()
  {
    this.gameStateObj.killStreakCount += 1;

    if(!this.gameStateObj.killStreak && this.gameStateObj.killStreakCount > this.gameStateObj.killStreakMark)
    {
      this.startKillStreak();
    }
    else if(this.gameStateObj.killStreak)
    {
      this.extendKillStreak();
    }
  }

  extendKillStreak()
  {
    this.killStreakTimer.reset(this.killStreakTimerConfig);
  }

  startKillStreak()
  {
    this.gameStateObj.killStreak = true;
    this.killStreakTimer.reset(this.killStreakTimerConfig);
    this.time.addEvent(this.killStreakTimer);
  }

  stopKillStreak()
  {
    this.gameStateObj.killStreak = false;
    this.gameStateObj.killStreakCount = 0;
    this.time.removeEvent(this.killStreakTimer);
  }

  gameOver()
  {
    this.music.stop();
    this.scene.start('gameOver', {
      finalScore: this.gameStateObj.score,
      isNewRecord: this.game.updateHighScore(this.gameStateObj.score)
    });
  }
}
