import Consumable from '../Consumable';

export default class Barrel extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'barrel.png');
    this.amount = 75;
  }

  consume(scene, player)
  {
    player.flamethrower.addFuel(this.amount);
  }
}
