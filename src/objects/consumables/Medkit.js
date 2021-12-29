import Consumable from '../Consumable';

export default class Medkit extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'medkit.png');
    this.amount = 50;
  }

  consume(scene, player)
  {
    player.addHealth(this.amount);
  }
}
