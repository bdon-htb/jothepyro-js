import Consumable from '../Consumable';

export default class Bandages extends Consumable
{
  constructor({ scene, x, y })
  {
    super(scene, x, y, 'items', 'bandages.png');
    this.amount = 25;
  }

  consume(scene, player)
  {
    player.addHealth(this.amount);
  }
}
