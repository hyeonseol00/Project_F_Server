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
    transform,
  ) {
    super(idx, id, hp, power, name, effectCode, exp, gold, critical, criticalAttack, maxHp);
    this.transform = transform;
  }
}

export default BossMonster;
