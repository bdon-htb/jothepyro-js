import Consumable from '../Consumable';

export default class Propane extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'pepper.png');
    this.multiplier = 2;
    this.statusTimerConfig = {
        delay: 5000,
        callback: ( () => {
          this._removeTimer(scene, scene.getPlayer());
        } ),
        repeat: 0
    }
  }

  consume(scene, player)
  {
    player.speedMultiplier = this.multiplier;
    player.isFast = true;
    player.fastTimer.reset(this.statusTimerConfig);
    scene.time.addEvent(player.fastTimer);
  }

  _removeTimer(scene, player)
  {
    player.speedMultiplier = 1;
    player.isFast = false;
    scene.time.removeEvent(player.fastTimer);
    player.fastTimer.reset(this.statusTimerConfig);
  }
}
