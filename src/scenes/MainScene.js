import Phaser from 'phaser';

import Player from '../objects/Player';
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
  }

  create()
  {
    this.game.controller.init(this);

    // Add background sprites.
    this.background = this.add.group();
    this.background.create(0, 0, 'bg').setOrigin(0,0);
    this.background.create(400, 150, 'tent').setOrigin(0,0);
    this.background.add(new Campfire({ scene: this, x: 355, y: 215 }));

    // Midground; player, items, and enemies are placed here.
    this.initGameStateObj();
    this.spawnEnemy(new this.game.characters.RoseEnemy({ scene: this, x: 75, y: 300 }));
    this.spawnEnemy(new this.game.characters.TreeEnemy({ scene: this, x: 720, y: 300 }));
    this.spawnEnemy(new this.game.characters.BoxEnemy({ scene: this, x: 300, y: 80 }));
    this.spawnEnemy(new this.game.characters.SunflowerEnemy({ scene: this, x: 300, y: 400 }));
    this.spawnEnemy(new this.game.characters.WatermelonEnemy({ scene: this, x: 500, y: 500 }));

    // Add foreground sprites.
    this.foreground = this.add.group();
    this.foreground.create(0, -10, 'treesU').setOrigin(0,0);
    this.foreground.create(-22, 0, 'treesL').setOrigin(0,0);
    this.foreground.create(768, 0, 'treesR').setOrigin(0,0);
    this.foreground.create(0, 546, 'treesD').setOrigin(0,0);


    // for collision detection.
    this.physics.world.on('collide', this.handleCollision)
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

  initGameStateObj()
  {
    this.gameStateObj = {
      player: new this.game.characters.Player({ scene: this, x: 400, y: 400 }),
      enemies: this.physics.add.group(),
      // This is organized { Class : group }
      // I'll probably only have one class but it might
      // be useful to keep flexible.
      projectiles: this.physics.add.group(),
    }
  }

  handleCollision(obj1, obj2)
  {

  }

  handleBoundCollision(body)
  {
    if(body.gameObject instanceof Projectile)
    {
      body.gameObject.deactivate();
    }
  }
}
