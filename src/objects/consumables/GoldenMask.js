import Consumable from '../Consumable';

export default class GoldenMask extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'golden_mask.png');
    this.multiplier = 10;
    this.statusTimerConfig = {
        delay: 3300,
        callback: ( () => {
          this._removeTimer(scene, scene.getPlayer());
        } ),
        repeat: 0
    }
  }

  consume(scene, player)
  {
    player.invincible = true;
    player.invincibleTimer.reset(this.statusTimerConfig);
    scene.time.addEvent(player.invincibleTimer);
  }

  _removeTimer(scene, player)
  {
    player.invincible = false;
    scene.time.removeEvent(player.invincibleTimer);
    player.invincibleTimer.reset(this.statusTimerConfig);
  }
}
