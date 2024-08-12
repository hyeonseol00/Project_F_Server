class Monster {
  constructor(idx, id, hp, power, name, monsterEffect, exp, gold, critical, criticalAttack, maxHp) {
    this.idx = idx;
    this.id = id;
    this.hp = hp;
    this.power = power;
    this.name = name;
    this.isDead = false;
    this.effectCode = monsterEffect;
    this.exp = exp;
    this.gold = gold;
    this.critical = critical;
    this.criticalAttack = criticalAttack;
    this.maxHp = maxHp;
  }
}

export default Monster;
