import Consumable from '../Consumable';

export default class Propane extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'propane.png');
    this.amount = 30;
  }

  consume(scene, player)
  {
    player.flamethrower.addFuel(this.amount);
  }
}
