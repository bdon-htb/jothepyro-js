import Consumable from '../Consumable';

export default class Steak extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'steak.png');
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
    player.strengthMultiplier = this.multiplier;
    player.isStrong = true;
    player.strongTimer.reset(this.statusTimerConfig);
    scene.time.addEvent(player.strongTimer);
  }

  _removeTimer(scene, player)
  {
    player.strengthMultiplier = 1;
    player.isStrong = false;
    scene.time.removeEvent(player.strongTimer);
    player.strongTimer.reset(this.statusTimerConfig);
  }
}
