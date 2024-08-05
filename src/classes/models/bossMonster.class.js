import Monster from './monster.class.js';

class BossMonster extends Monster {
  constructor(
    idx,
    id,
    hp,
    power,
    name,
    effectCode,
    exp,
    gold,
    critical,
    criticalAttack,
    maxHp,
    location,
  ) {
    super(idx, id, hp, power, name, effectCode, exp, gold, critical, criticalAttack, maxHp);
    this.location = location;
  }
}

export default BossMonster;
