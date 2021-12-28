/**
 * This module contains misc. functions that might not apply
 * to a single class.
*/

export default function randomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1) + min)
}
